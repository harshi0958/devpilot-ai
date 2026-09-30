import { GoogleGenAI } from "@google/genai";
import { prisma } from "../lib/prisma";

type AgentType =
  | "ARCHITECT"
  | "DEVELOPER"
  | "UIUX"
  | "DEBUGGER"
  | "TESTING"
  | "DOCUMENTATION";

interface ExecuteAgentInput {
  agentId: string;
  prompt: string;
  userId?: string;
  projectId?: string;
  conversationId?: string;
}

interface ExecuteAgentResult {
  agentId: string;
  agentName: string;
  agentType: AgentType;
  response: string;
  model: string;
  durationMs: number;
  executionId?: string;
}

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  console.warn("GEMINI_API_KEY is not configured.");
}

const ai = apiKey
  ? new GoogleGenAI({
      apiKey,
    })
  : null;

/*
|--------------------------------------------------------------------------
| Gemini Models
|--------------------------------------------------------------------------
*/

const PRIMARY_MODEL =
  process.env.GEMINI_MODEL || "gemini-3.8-flash";

const FALLBACK_MODEL =
  process.env.GEMINI_FALLBACK_MODEL ||
  "gemini-3.5-flash-lite";

/*
|--------------------------------------------------------------------------
| Retry / Timeout Configuration
|--------------------------------------------------------------------------
*/

const MAX_RETRIES = 2;

const GEMINI_TIMEOUT_MS = 45000;

const RETRY_DELAY_MS = 1500;

const sleep = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

/*
|--------------------------------------------------------------------------
| Detect Temporary Gemini Errors
|--------------------------------------------------------------------------
*/

function isRetryableGeminiError(error: unknown): boolean {
  const message =
    error instanceof Error
      ? error.message.toLowerCase()
      : String(error).toLowerCase();

  return (
    message.includes("503") ||
    message.includes("unavailable") ||
    message.includes("high demand") ||
    message.includes("429") ||
    message.includes("resource exhausted") ||
    message.includes("rate limit") ||
    message.includes("timeout") ||
    message.includes("timed out") ||
    message.includes("fetch failed") ||
    message.includes("headers timeout")
  );
}

/*
|--------------------------------------------------------------------------
| Gemini Request Using Interactions API
|--------------------------------------------------------------------------
*/

async function generateGeminiRequest(
  model: string,
  prompt: string
) {
  if (!ai) {
    throw new Error(
      "GEMINI_API_KEY is not configured on the backend."
    );
  }

  console.log(
    `Gemini API call started | model=${model}`
  );

  const response = await ai.interactions.create({
    model,
    input: prompt,
    generation_config: {
      thinking_level: "low",
      max_output_tokens: 2500,
    },
  });

  console.log(
    `Gemini API call completed | model=${model}`
  );

  return response;
}

/*
|--------------------------------------------------------------------------
| Generate Gemini Response
|--------------------------------------------------------------------------
*/

async function generateGeminiResponse(
  model: string,
  prompt: string,
  maxRetries = MAX_RETRIES
) {
  if (!ai) {
    throw new Error(
      "GEMINI_API_KEY is not configured on the backend."
    );
  }

  let lastError: unknown = null;

  for (
    let attempt = 1;
    attempt <= maxRetries;
    attempt++
  ) {
    try {
      console.log(
        `Gemini request | model=${model} | attempt=${attempt}`
      );

      const response =
        await generateGeminiRequest(
          model,
          prompt
        );

      console.log(
        `Gemini success | model=${model} | attempt=${attempt}`
      );

      return response;
    } catch (error) {
      lastError = error;

      console.error(
        `Gemini Error | model=${model} | attempt=${attempt}`,
        error
      );

      if (
        !isRetryableGeminiError(error) ||
        attempt === maxRetries
      ) {
        break;
      }

      console.log(
        `Retrying Gemini request in ${RETRY_DELAY_MS}ms...`
      );

      await sleep(RETRY_DELAY_MS);
    }
  }

  throw lastError instanceof Error
    ? lastError
    : new Error(
        "Failed to generate AI response."
      );
}

/*
|--------------------------------------------------------------------------
| Get Project Context
|--------------------------------------------------------------------------
*/

async function getProjectContext(
  projectId: string | undefined,
  userId: string | undefined
): Promise<string> {
  if (!projectId || !userId) {
    return `
No specific project context was provided.

If architectural decisions are required, clearly
state assumptions before making them.
`;
  }

  const project =
    await prisma.project.findFirst({
      where: {
        id: projectId,
        ownerId: userId,
      },
      select: {
        id: true,
        name: true,
        description: true,
        slug: true,
        createdAt: true,
        updatedAt: true,

        _count: {
          select: {
            members: true,
            conversations: true,
            executions: true,
            files: true,
          },
        },
      },
    });

  if (!project) {
    throw new Error(
      "Project not found or you do not have access to it."
    );
  }

  return `
PROJECT CONTEXT
===============

Project Name:
${project.name}

Project ID:
${project.id}

Project Slug:
${project.slug}

Project Description:
${project.description || "No project description provided."}

Current Project Statistics:
- Members: ${project._count.members}
- Conversations: ${project._count.conversations}
- AI Executions: ${project._count.executions}
- Project Files: ${project._count.files}

DEVPILOT PLATFORM TECHNOLOGY
============================

The project is being developed inside the DevPilot AI
software engineering platform.

Use the following existing platform architecture
unless the user explicitly asks to change it:

Frontend:
- Next.js
- React
- TypeScript
- Tailwind CSS
- shadcn/ui

Backend:
- Node.js
- Express
- TypeScript

Database:
- PostgreSQL

ORM:
- Prisma

Authentication:
- JWT authentication
- HTTP-only authentication cookie

AI:
- Google Gemini API

AI Agent System:
- Architect Agent
- Developer Agent
- UI/UX Agent
- Debugger Agent
- Testing Agent
- Documentation Agent

Existing DevPilot database entities include:
- User
- Project
- ProjectMember
- Agent
- Conversation
- Message
- AIExecution
- ProjectFile
- Notification

Development Environment:
- Frontend: http://localhost:3000
- Backend: http://localhost:5000

IMPORTANT ARCHITECTURE RULES
============================

1. Do NOT replace the existing Express backend with
   Next.js Serverless Functions unless explicitly requested.

2. Do NOT introduce Redis unless the user explicitly
   requests caching, rate limiting, queues, or Redis.

3. Do NOT replace PostgreSQL with another database.

4. Do NOT replace Prisma unless explicitly requested.

5. Do NOT assume Vercel Serverless architecture.

6. Reuse the existing DevPilot architecture whenever
   designing features for this project.

7. If a new technology is genuinely required,
   explain why before recommending it.

8. Treat the supplied project information as the
   source of truth for the current architecture.
`;
}

async function saveDeveloperFiles(
  responseText: string,
  projectId?: string
): Promise<number> {
  if (!projectId) {
    return 0;
  }

  type GeneratedFile = {
    path: string;
    content: string;
  };

  const generatedFiles: GeneratedFile[] = [];

  /*
  |--------------------------------------------------------------------------
  | Parser 1: JSON
  |--------------------------------------------------------------------------
  */

  try {
    const cleanedJson = responseText
      .replace(/^```json\s*/i, "")
      .replace(/^```\s*/i, "")
      .replace(/\s*```$/i, "")
      .trim();

    const parsed = JSON.parse(cleanedJson);

    if (parsed && Array.isArray(parsed.files)) {
      for (const file of parsed.files) {
        if (
          file &&
          typeof file.path === "string" &&
          typeof file.content === "string"
        ) {
          generatedFiles.push({
            path: file.path,
            content: file.content,
          });
        }
      }
    }
  } catch {
    // JSON parsing failed.
    // Continue with Markdown parser.
  }

  /*
  |--------------------------------------------------------------------------
  | Parser 2: Markdown Heading + Code Block
  |--------------------------------------------------------------------------
  |
  | Example:
  |
  | ### Student Controller (`server/controllers/student.controller.ts`)
  |
  | ```typescript
  | ...
  | ```
  |
  |--------------------------------------------------------------------------
  */

  if (generatedFiles.length === 0) {
    const lines = responseText.split(/\r?\n/);

    let pendingPath: string | null = null;
    let insideCodeBlock = false;
    let codeLanguage = "";
    let codeLines: string[] = [];

    for (const line of lines) {
      /*
      |--------------------------------------------------------------------------
      | Detect file path
      |--------------------------------------------------------------------------
      */

      const pathMatch = line.match(
        /`([^`\n]+\.[a-zA-Z0-9]+)`/
      );

      if (!insideCodeBlock && pathMatch) {
        const possiblePath = pathMatch[1].trim();

        if (
          possiblePath.includes("/") ||
          possiblePath.includes("\\") ||
          possiblePath.includes(".")
        ) {
          pendingPath = possiblePath;
        }
      }

      /*
      |--------------------------------------------------------------------------
      | Start code block
      |--------------------------------------------------------------------------
      */

      if (!insideCodeBlock) {
        const fenceMatch =
          line.match(/^```([a-zA-Z0-9+#.-]*)\s*$/);

        if (fenceMatch) {
          insideCodeBlock = true;
          codeLanguage = fenceMatch[1] || "";
          codeLines = [];
          continue;
        }
      }

      /*
      |--------------------------------------------------------------------------
      | End code block
      |--------------------------------------------------------------------------
      */

      if (
        insideCodeBlock &&
        line.trim() === "```"
      ) {
        insideCodeBlock = false;

        if (
          pendingPath &&
          codeLines.length > 0
        ) {
          const content =
            codeLines.join("\n").trim();

          if (content) {
            generatedFiles.push({
              path: pendingPath,
              content,
            });
          }
        }

        pendingPath = null;
        codeLanguage = "";
        codeLines = [];

        continue;
      }

      /*
      |--------------------------------------------------------------------------
      | Collect code
      |--------------------------------------------------------------------------
      */

      if (insideCodeBlock) {
        codeLines.push(line);
      }
    }
  }

  /*
  |--------------------------------------------------------------------------
  | Remove duplicate paths
  |--------------------------------------------------------------------------
  */

  const uniqueFiles = new Map<
    string,
    GeneratedFile
  >();

  for (const file of generatedFiles) {
    const cleanPath = file.path
      .trim()
      .replace(/^\/+/, "")
      .replace(/\\/g, "/");

    if (!cleanPath) {
      continue;
    }

    uniqueFiles.set(cleanPath, {
      path: cleanPath,
      content: file.content,
    });
  }

  /*
  |--------------------------------------------------------------------------
  | Save Files
  |--------------------------------------------------------------------------
  */

  if (uniqueFiles.size === 0) {
    console.warn(
      "Developer Agent response did not contain parseable project files."
    );

    return 0;
  }

  let savedCount = 0;

  for (const file of uniqueFiles.values()) {
    const cleanPath = file.path;

    const pathParts = cleanPath.split("/");

    const name =
      pathParts[pathParts.length - 1];

    if (!name) {
      continue;
    }

    const parentPath =
      pathParts.length > 1
        ? pathParts
            .slice(0, -1)
            .join("/")
        : null;

    const extension =
      name.includes(".")
        ? name
            .split(".")
            .pop()
            ?.toLowerCase()
        : undefined;

    const mimeTypes: Record<
      string,
      string
    > = {
      ts: "text/typescript",
      tsx: "text/tsx",
      js: "text/javascript",
      jsx: "text/jsx",
      json: "application/json",
      css: "text/css",
      html: "text/html",
      md: "text/markdown",
      txt: "text/plain",
      prisma: "text/plain",
    };

    const mimeType =
      extension && mimeTypes[extension]
        ? mimeTypes[extension]
        : "text/plain";

    const size = BigInt(
      Buffer.byteLength(
        file.content,
        "utf8"
      )
    );

    await prisma.projectFile.upsert({
      where: {
        projectId_path: {
          projectId,
          path: cleanPath,
        },
      },

      update: {
        name,
        content: file.content,
        mimeType,
        size,
        parentPath,
      },

      create: {
        projectId,
        name,
        path: cleanPath,
        type: "FILE",
        mimeType,
        size,
        content: file.content,
        parentPath,
      },
    });

    savedCount++;
  }

  console.log(
    `Developer Agent saved ${savedCount} project file(s) | projectId=${projectId}`
  );

  return savedCount;
}
/*
|--------------------------------------------------------------------------
| Execute AI Agent
|--------------------------------------------------------------------------
*/

export async function executeAgent(
  input: ExecuteAgentInput
): Promise<ExecuteAgentResult> {
  const startTime = Date.now();

  /*
  |--------------------------------------------------------------------------
  | Validate Gemini
  |--------------------------------------------------------------------------
  */

  if (!ai) {
    throw new Error(
      "GEMINI_API_KEY is not configured on the backend."
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Validate Agent ID
  |--------------------------------------------------------------------------
  */

  if (!input.agentId?.trim()) {
    throw new Error(
      "AI agent ID is required."
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Validate Prompt
  |--------------------------------------------------------------------------
  */

  const prompt = input.prompt?.trim();

  if (!prompt) {
    throw new Error(
      "Please provide a task for the AI agent."
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Find Agent
  |--------------------------------------------------------------------------
  */

  const agent =
    await prisma.agent.findUnique({
      where: {
        id: input.agentId,
      },
    });

  if (!agent) {
    throw new Error(
      "AI agent not found."
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Check Agent Status
  |--------------------------------------------------------------------------
  */

  if (!agent.isActive) {
    throw new Error(
      "This AI agent is currently inactive."
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Get Project Context
  |--------------------------------------------------------------------------
  */

  const projectContext =
    await getProjectContext(
      input.projectId,
      input.userId
    );

  /*
  |--------------------------------------------------------------------------
  | Agent System Prompt
  |--------------------------------------------------------------------------
  */

  const systemPrompt =
    agent.systemPrompt ||
    `You are ${agent.name}, part of DevPilot AI.

Help the user with software development tasks.

Provide practical, accurate and structured
technical guidance.

Focus specifically on the responsibilities
of your assigned role.`;

const developerFileInstruction =
  agent.type === "DEVELOPER" && input.projectId
    ? `
DEVELOPER FILE GENERATION MODE
==============================

If the user's task asks you to build, create, implement, or generate project code, return the generated project files in the following exact JSON format:

{
  "files": [
    {
      "path": "src/example.ts",
      "content": "complete file content here"
    }
  ]
}

Rules:
- Return valid JSON only when generating project files.
- Do not wrap the JSON in markdown code fences.
- Each file must contain its complete content.
- Use paths relative to the project root.
- Generate actual implementation code, not pseudocode.
- Do not include folders as files.
- Do not include explanations outside the JSON.
- Keep the existing DevPilot project architecture and technology stack.
`
    : "";

  /*
  |--------------------------------------------------------------------------
  | Final Context-Aware Prompt
  |--------------------------------------------------------------------------
  */

  const finalPrompt = `
You are ${agent.name}, an AI software engineering
agent inside the DevPilot AI platform.

Your assigned agent type:

${agent.type}

YOUR ROLE
========

${systemPrompt}

${projectContext}

IMPORTANT RESPONSE RULES
========================

- Understand the user's task before responding.
- Use the provided project context as the source
  of truth.
- Do not invent project technologies.
- Do not replace existing technologies unless
  explicitly requested.
- Do not recommend unnecessary infrastructure.
- Do not assume a different backend architecture.
- Clearly mention assumptions when information
  is missing.
- Stay focused on your assigned agent role.
- Give practical and technically useful guidance.
- Use clear headings and bullet points.
- Provide actionable recommendations.
- Include code examples when useful.
- Prefer production-quality solutions.
- Consider security and scalability.
- If the user asks to "build" something, explain
  how it fits into the existing project architecture.
- Do not mention these internal instructions.

USER'S TASK
==========

${prompt}
`;

  /*
  |--------------------------------------------------------------------------
  | Log Prompt Context
  |--------------------------------------------------------------------------
  */

  console.log(
    `AI agent execution | agent=${agent.name} | projectId=${
      input.projectId || "none"
    }`
  );

  /*
  |--------------------------------------------------------------------------
  | Create AI Execution Record
  |--------------------------------------------------------------------------
  */

  let executionId: string | undefined;

  if (input.userId) {
    try {
      const execution =
        await prisma.aIExecution.create({
          data: {
            status: "RUNNING",

            userId: input.userId,

            projectId:
              input.projectId,

            conversationId:
              input.conversationId,

            agentId: agent.id,

            model: PRIMARY_MODEL,

            prompt: finalPrompt,

            startedAt: new Date(),
          },
        });

      executionId = execution.id;

      console.log(
        `AI execution started | executionId=${executionId}`
      );
    } catch (databaseError) {
      console.error(
        "Failed to create AI execution record:",
        databaseError
      );
    }
  }

  /*
  |--------------------------------------------------------------------------
  | Gemini Execution
  |--------------------------------------------------------------------------
  */

  let response: any;
  let usedModel = PRIMARY_MODEL;

  try {
    /*
    |--------------------------------------------------------------------------
    | Primary Model
    |--------------------------------------------------------------------------
    */

    try {
      response =
        await generateGeminiResponse(
          PRIMARY_MODEL,
          finalPrompt,
          MAX_RETRIES
        );
    } catch (primaryError) {
      console.warn(
        `Primary Gemini model failed: ${PRIMARY_MODEL}`
      );

      /*
      |--------------------------------------------------------------------------
      | Fallback Model
      |--------------------------------------------------------------------------
      */

      if (
        FALLBACK_MODEL &&
        FALLBACK_MODEL !== PRIMARY_MODEL
      ) {
        console.log(
          `Trying fallback Gemini model: ${FALLBACK_MODEL}`
        );

        usedModel = FALLBACK_MODEL;

        /*
        | Only one fallback attempt.
        */

        response =
          await generateGeminiResponse(
            FALLBACK_MODEL,
            finalPrompt,
            1
          );
      } else {
        throw primaryError;
      }
    }
  } catch (error) {
    const durationMs =
      Date.now() - startTime;

    /*
    |--------------------------------------------------------------------------
    | Mark Execution Failed
    |--------------------------------------------------------------------------
    */

    if (executionId) {
      try {
        await prisma.aIExecution.update({
          where: {
            id: executionId,
          },

          data: {
            status: "FAILED",

            model: usedModel,

            durationMs,

            errorMessage:
              error instanceof Error
                ? error.message
                : "AI execution failed.",

            completedAt: new Date(),
          },
        });
      } catch (databaseError) {
        console.error(
          "Failed to update AI execution failure:",
          databaseError
        );
      }
    }

    throw error;
  }

  /*
  |--------------------------------------------------------------------------
  | Extract Response Text
  |--------------------------------------------------------------------------
  */

  const text =
    response?.output_text?.trim() ||
    "The AI agent did not return a response.";

    let generatedFileCount = 0;

if (
  agent.type === "DEVELOPER" &&
  input.projectId
) {
  generatedFileCount =
    await saveDeveloperFiles(
      text,
      input.projectId
    );
}

  const durationMs =
    Date.now() - startTime;

  /*
  |--------------------------------------------------------------------------
  | Token Usage
  |--------------------------------------------------------------------------
  |
  | Interactions API response structure can vary by SDK
  | version, so usage is read defensively.
  |--------------------------------------------------------------------------
  */

  const usage =
    response?.usageMetadata ||
    response?.usage_metadata ||
    response?.usage;

  const inputTokens =
    usage?.promptTokenCount ??
    usage?.inputTokenCount ??
    usage?.input_tokens ??
    undefined;

  const outputTokens =
    usage?.candidatesTokenCount ??
    usage?.outputTokenCount ??
    usage?.output_tokens ??
    undefined;

  const totalTokens =
    usage?.totalTokenCount ??
    usage?.totalTokenCount ??
    usage?.total_tokens ??
    undefined;

  /*
  |--------------------------------------------------------------------------
  | Mark Execution Completed
  |--------------------------------------------------------------------------
  */

  if (executionId) {
    try {
      await prisma.aIExecution.update({
        where: {
          id: executionId,
        },

        data: {
          status: "COMPLETED",

          model: usedModel,

          response: text,

          inputTokens,

          outputTokens,

          totalTokens,

          durationMs,

          completedAt: new Date(),
        },
      });

      console.log(
        `AI execution completed | executionId=${executionId} | duration=${durationMs}ms`
      );
    } catch (databaseError) {
      console.error(
        "Failed to save AI execution result:",
        databaseError
      );
    }
  }

  /*
  |--------------------------------------------------------------------------
  | Return Result
  |--------------------------------------------------------------------------
  */

  return {
    agentId: agent.id,

    agentName: agent.name,

    agentType:
      agent.type as AgentType,

    response: text,

    model: usedModel,

    durationMs,

    executionId,
  };
}