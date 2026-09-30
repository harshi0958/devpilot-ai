import { prisma } from "../lib/prisma";

const GITHUB_API = "https://api.github.com";
const GITHUB_API_VERSION = "2026-03-10";

function githubUrl(path: string): string {
  if (/^https?:\/\//i.test(path)) {
    return path;
  }

  return `${GITHUB_API}${path.startsWith("/") ? path : `/${path}`}`;
}

type GitHubResponse<T> = {
  data: T;
  status: number;
};

type GitHubCommitResponse = {
  sha: string;
  html_url?: string;
};

type GitHubUser = {
  login: string;
};

type ProjectFileRecord = {
  path: string;
  content: string | null;
  type: "FILE" | "FOLDER";
};

/*
|--------------------------------------------------------------------------
| GitHub Token
|--------------------------------------------------------------------------
*/

function getGitHubToken(): string {
  const token = process.env.GITHUB_TOKEN;

  if (!token) {
    throw new Error(
      "GITHUB_TOKEN is not configured on the backend."
    );
  }

  return token.trim();
}

/*
|--------------------------------------------------------------------------
| GitHub Headers
|--------------------------------------------------------------------------
*/

function githubHeaders(): HeadersInit {
  return {
    Accept: "application/vnd.github+json",
    Authorization: `Bearer ${getGitHubToken()}`,
    "X-GitHub-Api-Version": GITHUB_API_VERSION,
    "Content-Type": "application/json",
  };
}

/*
|--------------------------------------------------------------------------
| Verify GitHub Token
|--------------------------------------------------------------------------
|
| IMPORTANT:
| We never print the token itself.
| We only print the GitHub account associated with it.
|
*/

async function verifyGitHubToken(): Promise<string> {
  const response = await fetch(`${GITHUB_API}/user`, {
    method: "GET",
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${getGitHubToken()}`,
      "X-GitHub-Api-Version": GITHUB_API_VERSION,
    },
  });

  const text = await response.text();

  let data: GitHubUser & {
    message?: string;
  };

  try {
    data = text
      ? (JSON.parse(text) as GitHubUser & {
          message?: string;
        })
      : ({} as GitHubUser & {
          message?: string;
        });
  } catch {
    throw new Error(
      `GitHub token verification returned invalid JSON. Status: ${response.status}`
    );
  }

  if (!response.ok) {
    throw new Error(
      `GitHub token verification failed (${response.status}): ${
        data.message || "Unknown GitHub error."
      }`
    );
  }

  console.log(
    `GitHub authenticated account: ${data.login}`
  );

  return data.login;
}

/*
|--------------------------------------------------------------------------
| Generic GitHub Request
|--------------------------------------------------------------------------
*/

async function githubRequest<T>(
  path: string,
  options: RequestInit = {}
): Promise<GitHubResponse<T>> {
  const response = await fetch(
    githubUrl(path),
    {
      ...options,
      headers: {
        ...githubHeaders(),
        ...(options.headers || {}),
      },
    }
  );

  const text = await response.text();

  let data: T;

  try {
    data = text
      ? (JSON.parse(text) as T)
      : ({} as T);
  } catch {
    throw new Error(
      `GitHub returned invalid JSON. Status: ${response.status}`
    );
  }

  if (!response.ok) {
    const githubMessage =
      typeof data === "object" &&
      data !== null &&
      "message" in data
        ? String(
            (data as { message?: unknown }).message
          )
        : "Unknown GitHub API error.";

    const acceptedPermissions =
      response.headers.get(
        "X-Accepted-GitHub-Permissions"
      );

    console.error(
      "========== GITHUB API ERROR =========="
    );

    console.error(
      "Method:",
      options.method || "GET"
    );

    console.error(
      "Endpoint:",
      path
    );

    console.error(
      "Status:",
      response.status
    );

    console.error(
      "Message:",
      githubMessage
    );

    console.error(
      "Required Permissions:",
      acceptedPermissions || "Not provided"
    );

    console.error(
      "======================================"
    );

    throw new Error(
      `GitHub API error (${response.status}): ${githubMessage}${
        acceptedPermissions
          ? ` | Required permission: ${acceptedPermissions}`
          : ""
      }`
    );
  }

  return {
    data,
    status: response.status,
  };
}

/*
|--------------------------------------------------------------------------
| Parse Repository URL
|--------------------------------------------------------------------------
*/

function parseRepositoryUrl(
  repositoryUrl: string
): {
  owner: string;
  repository: string;
} {
  try {
    const url = new URL(repositoryUrl);

    if (
      url.hostname.toLowerCase() !==
      "github.com"
    ) {
      throw new Error(
        "Repository URL must belong to github.com."
      );
    }

    const parts = url.pathname
      .replace(/^\/+|\/+$/g, "")
      .split("/");

    if (parts.length < 2) {
      throw new Error(
        "Invalid GitHub repository URL."
      );
    }

    const owner = parts[0];

    const repository = parts[1].replace(
      /\.git$/,
      ""
    );

    if (!owner || !repository) {
      throw new Error(
        "Invalid GitHub repository URL."
      );
    }

    return {
      owner,
      repository,
    };
  } catch (error) {
    if (
      error instanceof Error &&
      error.message.includes(
        "Repository URL"
      )
    ) {
      throw error;
    }

    throw new Error(
      "Invalid GitHub repository URL."
    );
  }
}

async function verifyGitHubRepositoryAccess(
  owner: string,
  repository: string
): Promise<void> {
  const response = await githubRequest<{
    permissions?: {
      push?: boolean;
      pull?: boolean;
      maintain?: boolean;
      admin?: boolean;
    };
  }>(`/repos/${owner}/${repository}`);

  const permissions = response.data.permissions;

  console.log("========== GITHUB REPOSITORY ACCESS ==========");
  console.log(`Repository: ${owner}/${repository}`);
  console.log(`Push: ${permissions?.push}`);
  console.log(`Pull: ${permissions?.pull}`);
  console.log(`Maintain: ${permissions?.maintain}`);
  console.log(`Admin: ${permissions?.admin}`);
  console.log("==============================================");
}

/*
|--------------------------------------------------------------------------
| Push Project To GitHub
|--------------------------------------------------------------------------
|
| Flow:
|
| DevPilot Project Files
|        ↓
| GitHub Blobs
|        ↓
| GitHub Tree
|        ↓
| GitHub Commit
|        ↓
| Update Branch
|
*/

export async function pushProjectToGitHub(
  projectId: string,
  commitMessage =
    "chore: sync project files from DevPilot AI"
) {
  /*
  |--------------------------------------------------------------------------
  | 0. Verify GitHub Token
  |--------------------------------------------------------------------------
  */

  await verifyGitHubToken();

  /*
  |--------------------------------------------------------------------------
  | 1. Load GitHub Connection
  |--------------------------------------------------------------------------
  */

  const connection =
    await prisma.gitHubConnection.findUnique({
      where: {
        projectId,
      },
    });

  if (!connection) {
    throw new Error(
      "GitHub repository is not connected to this project."
    );
  }

  /*
 |--------------------------------------------------------------------------
 | 2. Parse Repository
 |--------------------------------------------------------------------------
 */

const parsedRepository = parseRepositoryUrl(
  connection.repositoryUrl
);

const owner =
  connection.ownerName ||
  parsedRepository.owner;

const repository =
  connection.repositoryName ||
  parsedRepository.repository;

const branch =
  connection.branch || "main";

// Verify effective GitHub repository permissions
await verifyGitHubRepositoryAccess(
  owner,
  repository
);

  /*
  |--------------------------------------------------------------------------
  | 3. Load Project Files
  |--------------------------------------------------------------------------
  */

  const projectFiles =
    await prisma.projectFile.findMany({
      where: {
        projectId,
        type: "FILE",
      },
      select: {
        path: true,
        content: true,
        type: true,
      },
      orderBy: {
        path: "asc",
      },
    });

  if (projectFiles.length === 0) {
    throw new Error(
      "No project files are available to push."
    );
  }

  console.log(
    `GitHub push started for ${owner}/${repository}`
  );

  console.log(
    `Branch: ${branch}`
  );

  console.log(
    `Files to push: ${projectFiles.length}`
  );

  /*
   |--------------------------------------------------------------------------
   | 4. Push Files Using GitHub Contents API
   |--------------------------------------------------------------------------
   |
   | We use the repository Contents API instead of the low-level Git
   | Database blob/tree API. Files are pushed sequentially.
   |--------------------------------------------------------------------------
  */

  let lastCommitSha: string | null = null;
  let lastCommitUrl: string | null = null;

  for (const file of projectFiles as ProjectFileRecord[]) {
    const filePath = file.path.replace(/^\/+/, '');

    if (!filePath) continue;

    const content = file.content ?? '';
    console.log(`Pushing file: ${filePath}`);

    let existingFileSha: string | undefined;

    const encodedFilePath = filePath
      .split('/')
      .map((part) => encodeURIComponent(part))
      .join('/');

const fileUrl = githubUrl(
  `/repos/${encodeURIComponent(owner)}/${encodeURIComponent(
    repository
  )}/contents/${encodedFilePath}?ref=${encodeURIComponent(branch)}`
);

const fileResponse = await fetch(fileUrl, {
  method: "GET",
  headers: githubHeaders(),
});

    const fileResponseText = await fileResponse.text();

    if (fileResponse.ok) {
      try {
        const existingFile = JSON.parse(fileResponseText) as {
          sha?: string;
          type?: string;
        };

        if (existingFile.type === 'file' && existingFile.sha) {
          existingFileSha = existingFile.sha;
        }
      } catch {
        throw new Error(`GitHub returned invalid JSON while checking ${filePath}.`);
      }
    } else if (fileResponse.status !== 404) {
      let errorMessage = `Unable to check GitHub file ${filePath}.`;

      try {
        const errorData = JSON.parse(fileResponseText) as { message?: string };
        if (errorData.message) errorMessage = errorData.message;
      } catch {
        // Keep the default error message.
      }

      throw new Error(
        `GitHub file check failed (${fileResponse.status}): ${errorMessage}`
      );
    }

    const updateResponse = await githubRequest<{
      content?: {
        path?: string;
        sha?: string;
        html_url?: string;
      };
      commit?: {
        sha?: string;
        html_url?: string;
      };
    }>(`${GITHUB_API}/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repository)}/contents/${encodedFilePath}`, {
      method: 'PUT',
      body: JSON.stringify({
        message: commitMessage,
        content: Buffer.from(content, 'utf8').toString('base64'),
        branch,
        ...(existingFileSha ? { sha: existingFileSha } : {}),
      }),
    });

    lastCommitSha = updateResponse.data.commit?.sha || null;
    lastCommitUrl = updateResponse.data.commit?.html_url || null;
  }

  /*
   |--------------------------------------------------------------------------
   | 5. Return Result
   |--------------------------------------------------------------------------
  */

  if (!lastCommitSha) {
    throw new Error(
      'GitHub did not return a commit SHA after pushing the project files.'
    );
  }

  const commitUrl =
    lastCommitUrl ||
    `https://github.com/${owner}/${repository}/commit/${lastCommitSha}`;

  console.log('GitHub push completed successfully.');
  console.log(`Commit: ${lastCommitSha}`);
  console.log(`Files pushed: ${projectFiles.length}`);

  /*
   |--------------------------------------------------------------------------
   | Return Result
   |--------------------------------------------------------------------------
  */

  return {
    success: true,
    repository: `${owner}/${repository}`,
    branch,
    filesPushed: projectFiles.length,
    commitSha: lastCommitSha,
    commitUrl,
  };
}
