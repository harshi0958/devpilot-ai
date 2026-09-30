"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  ChevronRight,
  Loader2,
  ArrowLeft,
  GitBranch,
  CheckCircle2,
  Link2,
} from "lucide-react";
import { useEffect, useState } from "react";

import Sidebar from "@/components/dashboard/Sidebar";
import TopNavbar from "@/components/dashboard/TopNavbar";

import ProjectHeader from "@/components/project-details/ProjectHeader";
import OverviewCards from "@/components/project-details/OverviewCards";
import ActivityFeed from "@/components/project-details/ActivityFeed";
import AgentStatus from "@/components/project-details/AgentStatus";
import RecentFiles from "@/components/project-details/RecentFiles";
import GitActivity from "@/components/project-details/GitActivity";
import DeploymentStatus from "@/components/project-details/DeploymentStatus";
import RepositoryStats from "@/components/project-details/RepositoryStats";
import ProjectAnalytics from "@/components/project-details/ProjectAnalytics";
import TeamMembers from "@/components/project-details/TeamMembers";
import TaskBoard from "@/components/project-details/tasks/TaskBoard";

import { type Project } from "@/data/projects";

const API_URL = "http://localhost:5000";

type GitHubConnection = {
  id: string;
  projectId: string;
  repositoryUrl: string;
  repositoryName: string;
  ownerName: string;
  branch: string;
  connectedAt: string;
  updatedAt: string;
};

export default function ProjectDetailsPage() {
  const params = useParams();
  const router = useRouter();

  const projectId = params.projectId as string;

  const [project, setProject] =
    useState<Project | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /*
  |--------------------------------------------------------------------------
  | GitHub State
  |--------------------------------------------------------------------------
  */

  const [githubConnection, setGithubConnection] =
    useState<GitHubConnection | null>(null);

  const [githubLoading, setGithubLoading] =
    useState(true);

  const [githubConnecting, setGithubConnecting] =
    useState(false);

  const [githubError, setGithubError] =
    useState("");

  const [repositoryUrl, setRepositoryUrl] =
    useState("");

  const [repositoryName, setRepositoryName] =
    useState("");

  const [ownerName, setOwnerName] =
    useState("");

  const [branch, setBranch] =
    useState("main");

  /*
  |--------------------------------------------------------------------------
  | Load Project From Backend
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    const loadProject = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `${API_URL}/api/projects/${projectId}`,
          {
            method: "GET",
            credentials: "include",
          }
        );

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(
            data.message || "Failed to load project."
          );
        }

        const backendProject = data.project;

        const mappedProject: Project = {
          id: backendProject.id,

          name: backendProject.name,

          description:
            backendProject.description || "",

          status: "Building",

          progress: 0,

          members:
            backendProject._count?.members ?? 1,

          agents: 1,

          github: "",

          deployment: "",

          techStack: ["Next.js"],

          agentsActive: 1,

          membersOnline: 1,

          files:
            backendProject._count?.files ?? 0,

          tasks: 0,

          pendingTasks: 0,

          archived: false,
        };

        setProject(mappedProject);
      } catch (error) {
        console.error(
          "Load Project Error:",
          error
        );

        setError(
          error instanceof Error
            ? error.message
            : "Failed to load project."
        );
      } finally {
        setLoading(false);
      }
    };

    if (projectId) {
      loadProject();
    }
  }, [projectId]);

  /*
  |--------------------------------------------------------------------------
  | Load GitHub Connection
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    const loadGitHubStatus = async () => {
      if (!projectId) {
        return;
      }

      try {
        setGithubLoading(true);
        setGithubError("");

        const response = await fetch(
          `${API_URL}/api/github/status/${projectId}`,
          {
            method: "GET",
            credentials: "include",
          }
        );

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(
            data.message ||
              "Failed to load GitHub status."
          );
        }

        if (data.connected && data.data) {
          setGithubConnection(data.data);

          setRepositoryUrl(
            data.data.repositoryUrl || ""
          );

          setRepositoryName(
            data.data.repositoryName || ""
          );

          setOwnerName(
            data.data.ownerName || ""
          );

          setBranch(
            data.data.branch || "main"
          );
        } else {
          setGithubConnection(null);
        }
      } catch (error) {
        console.error(
          "GitHub Status Error:",
          error
        );

        setGithubError(
          error instanceof Error
            ? error.message
            : "Failed to load GitHub status."
        );
      } finally {
        setGithubLoading(false);
      }
    };

    loadGitHubStatus();
  }, [projectId]);

  /*
  |--------------------------------------------------------------------------
  | Connect GitHub Repository
  |--------------------------------------------------------------------------
  */

  const handleConnectGitHub = async () => {
    if (
      !repositoryUrl.trim() ||
      !repositoryName.trim() ||
      !ownerName.trim()
    ) {
      setGithubError(
        "Please fill Repository URL, Repository Name and Owner."
      );

      return;
    }

    try {
      setGithubConnecting(true);
      setGithubError("");

      const response = await fetch(
        `${API_URL}/api/github/connect`,
        {
          method: "POST",

          credentials: "include",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            projectId,
            repositoryUrl:
              repositoryUrl.trim(),
            repositoryName:
              repositoryName.trim(),
            ownerName:
              ownerName.trim(),
            branch:
              branch.trim() || "main",
          }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message ||
            "Failed to connect GitHub repository."
        );
      }

      setGithubConnection(data.data);

      setRepositoryUrl(
        data.data.repositoryUrl
      );

      setRepositoryName(
        data.data.repositoryName
      );

      setOwnerName(
        data.data.ownerName
      );

      setBranch(
        data.data.branch
      );
    } catch (error) {
      console.error(
        "GitHub Connect Error:",
        error
      );

      setGithubError(
        error instanceof Error
          ? error.message
          : "Failed to connect GitHub repository."
      );
    } finally {
      setGithubConnecting(false);
    }
  };

  const handlePushToGitHub = async () => {
  try {
    setGithubConnecting(true);
    setGithubError("");

    const response = await fetch(
      `${API_URL}/api/github/push`,
      {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          projectId,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(
        data.message || "Failed to push changes to GitHub."
      );
    }

    alert(
      `Successfully pushed ${data.data?.filesPushed ?? 0} files to GitHub.\n\nCommit: ${
        data.data?.commitSha ?? "Created"
      }`
    );
  } catch (error) {
    console.error("GitHub Push Error:", error);

    setGithubError(
      error instanceof Error
        ? error.message
        : "Failed to push changes to GitHub."
    );
  } finally {
    setGithubConnecting(false);
  }
};

  /*
  |--------------------------------------------------------------------------
  | Loading
  |--------------------------------------------------------------------------
  */

  if (loading) {
    return (
      <div className="flex min-h-screen bg-[#070B14]">
        <Sidebar />

        <div className="flex flex-1">
          <TopNavbar />

          <main className="flex flex-1 items-center justify-center">
            <div className="text-center">
              <Loader2 className="mx-auto h-8 w-8 animate-spin text-cyan-400" />

              <p className="mt-4 text-white">
                Loading project...
              </p>

              <p className="mt-1 text-sm text-slate-500">
                Fetching project from DevPilot backend
              </p>
            </div>
          </main>
        </div>
      </div>
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Error
  |--------------------------------------------------------------------------
  */

  if (error || !project) {
    return (
      <div className="flex min-h-screen bg-[#070B14]">
        <Sidebar />

        <div className="flex-1">
          <TopNavbar />

          <main className="flex min-h-[80vh] items-center justify-center p-8">
            <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#111827] p-8 text-center">

              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-500/10 text-2xl">
                ⚠️
              </div>

              <h2 className="mt-5 text-xl font-bold text-white">
                Project Not Found
              </h2>

              <p className="mt-2 text-sm text-slate-400">
                {error ||
                  "This project could not be loaded."}
              </p>

              <button
                onClick={() =>
                  router.push("/projects")
                }
                className="
                  mt-6
                  inline-flex
                  items-center
                  gap-2
                  rounded-xl
                  bg-cyan-500
                  px-5
                  py-3
                  font-semibold
                  text-black
                  transition
                  hover:bg-cyan-400
                "
              >
                <ArrowLeft size={18} />
                Back to Projects
              </button>
            </div>
          </main>
        </div>
      </div>
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Project Details
  |--------------------------------------------------------------------------
  */

  return (
    <div className="flex min-h-screen bg-[#070B14]">
      <Sidebar />

      <div className="flex-1">
        <TopNavbar />

        <main className="p-8">

          {/* Breadcrumb */}

          <div className="mb-6 flex items-center gap-2 text-sm">
            <Link
              href="/projects"
              className="text-slate-400 transition hover:text-cyan-400"
            >
              Projects
            </Link>

            <ChevronRight
              size={16}
              className="text-slate-500"
            />

            <span className="font-medium text-white">
              {project.name}
            </span>
          </div>

          {/* Header */}

          <ProjectHeader
            name={project.name}
            description={project.description}
            status={project.status}
            progress={project.progress}
            techStack={project.techStack}
            github={
              githubConnection?.repositoryUrl ||
              project.github
            }
            deployment={project.deployment}
          />

          {/* AI Workspace */}

          <div className="mt-6 flex justify-end">
            <Link
              href={`/agents?projectId=${project.id}`}
              className="
                inline-flex
                items-center
                gap-2
                rounded-xl
                bg-cyan-500
                px-5
                py-3
                font-semibold
                text-black
                transition
                hover:bg-cyan-400
              "
            >
              🤖 Open AI Workspace
              <ChevronRight size={18} />
            </Link>
          </div>

          {/* Overview Cards */}

          <OverviewCards
            agents={project.agents}
            activeAgents={project.agentsActive}
            members={project.members}
            onlineMembers={project.membersOnline}
            files={project.files}
            tasks={project.tasks}
            pendingTasks={project.pendingTasks}
          />

          {/* Activity + Agent Status */}

          <div className="mt-8 grid gap-8 xl:grid-cols-2">
            <ActivityFeed />
            <AgentStatus />
          </div>

          {/* Recent Files + Git Activity */}

          <div className="mt-8 grid gap-8 xl:grid-cols-2">
            <RecentFiles />
            <GitActivity />
          </div>

          {/* GitHub Integration */}

          <section className="mt-8 rounded-2xl border border-white/10 bg-[#0D1422] p-6 shadow-xl">

            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

              <div className="flex items-center gap-4">

                <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-white/10 bg-[#111827]">
                  <GitBranch
                    size={26}
                    className="text-white"
                  />
                </div>

                <div>
                  <h2 className="text-lg font-semibold text-white">
                    GitHub Integration
                  </h2>

                  <p className="mt-1 text-sm text-slate-400">
                    Connect this project to a GitHub repository.
                  </p>
                </div>

              </div>

              {githubConnection && (
                <div className="inline-flex w-fit items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1.5 text-sm font-medium text-emerald-400">
                  <CheckCircle2 size={16} />
                  Connected
                </div>
              )}

            </div>

            {githubLoading ? (
              <div className="mt-6 flex items-center gap-3 text-sm text-slate-400">
                <Loader2
                  size={18}
                  className="animate-spin text-cyan-400"
                />
                Checking GitHub connection...
              </div>
            ) : (
              <div className="mt-6">

                {githubConnection && (
                  <div className="mb-6 rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-5">

                    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

                      <div>

                        <p className="text-xs uppercase tracking-wider text-slate-500">
                          Connected Repository
                        </p>

                        <a
                          href={
                            githubConnection.repositoryUrl
                          }
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-1 inline-flex items-center gap-2 text-lg font-semibold text-cyan-400 transition hover:text-cyan-300"
                        >
                          <GitBranch size={18} />

                          {githubConnection.ownerName}/
                          {githubConnection.repositoryName}
                        </a>

                        <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-slate-400">

                          <span className="inline-flex items-center gap-1.5">
                            <GitBranch size={15} />
                            {githubConnection.branch}
                          </span>

                          <span className="inline-flex items-center gap-1.5">
                            <Link2 size={15} />
                            Repository connected
                          </span>

                        </div>

                      </div>

                    </div>
                  </div>
                )}

                {githubError && (
                  <div className="mb-5 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                    {githubError}
                  </div>
                )}

                <div className="grid gap-5 md:grid-cols-2">

                  {/* Repository URL */}

                  <div className="md:col-span-2">

                    <label className="mb-2 block text-sm font-medium text-slate-300">
                      Repository URL
                    </label>

                    <input
                      type="url"
                      value={repositoryUrl}
                      onChange={(event) =>
                        setRepositoryUrl(
                          event.target.value
                        )
                      }
                      placeholder="https://github.com/username/repository"
                      className="
                        w-full
                        rounded-xl
                        border
                        border-white/10
                        bg-[#070B14]
                        px-4
                        py-3
                        text-sm
                        text-white
                        outline-none
                        transition
                        placeholder:text-slate-600
                        focus:border-cyan-500/50
                        focus:ring-2
                        focus:ring-cyan-500/10
                      "
                    />

                  </div>

                  {/* Owner */}

                  <div>

                    <label className="mb-2 block text-sm font-medium text-slate-300">
                      GitHub Owner
                    </label>

                    <input
                      type="text"
                      value={ownerName}
                      onChange={(event) =>
                        setOwnerName(
                          event.target.value
                        )
                      }
                      placeholder="harshi0958"
                      className="
                        w-full
                        rounded-xl
                        border
                        border-white/10
                        bg-[#070B14]
                        px-4
                        py-3
                        text-sm
                        text-white
                        outline-none
                        transition
                        placeholder:text-slate-600
                        focus:border-cyan-500/50
                        focus:ring-2
                        focus:ring-cyan-500/10
                      "
                    />

                  </div>

                  {/* Repository Name */}

                  <div>

                    <label className="mb-2 block text-sm font-medium text-slate-300">
                      Repository Name
                    </label>

                    <input
                      type="text"
                      value={repositoryName}
                      onChange={(event) =>
                        setRepositoryName(
                          event.target.value
                        )
                      }
                      placeholder="devpilot-project"
                      className="
                        w-full
                        rounded-xl
                        border
                        border-white/10
                        bg-[#070B14]
                        px-4
                        py-3
                        text-sm
                        text-white
                        outline-none
                        transition
                        placeholder:text-slate-600
                        focus:border-cyan-500/50
                        focus:ring-2
                        focus:ring-cyan-500/10
                      "
                    />

                  </div>

                  {/* Branch */}

                  <div>

                    <label className="mb-2 block text-sm font-medium text-slate-300">
                      Branch
                    </label>

                    <input
                      type="text"
                      value={branch}
                      onChange={(event) =>
                        setBranch(
                          event.target.value
                        )
                      }
                      placeholder="main"
                      className="
                        w-full
                        rounded-xl
                        border
                        border-white/10
                        bg-[#070B14]
                        px-4
                        py-3
                        text-sm
                        text-white
                        outline-none
                        transition
                        placeholder:text-slate-600
                        focus:border-cyan-500/50
                        focus:ring-2
                        focus:ring-cyan-500/10
                      "
                    />

                  </div>

                </div>

                <div className="mt-6 flex justify-end gap-3">

                  <button
                    type="button"
                    onClick={handleConnectGitHub}
                    disabled={githubConnecting}
                    className="
                      inline-flex
                      items-center
                      gap-2
                      rounded-xl
                      border
                      border-white/10
                      bg-[#111827]
                      px-5
                      py-3
                      font-semibold
                      text-white
                      transition
                      hover:border-cyan-500/40
                      hover:bg-[#172033]
                      disabled:cursor-not-allowed
                      disabled:opacity-50
                    "
                  >

                    {githubConnecting ? (
                      <>
                        <Loader2
                          size={18}
                          className="animate-spin"
                        />

                        Connecting...
                      </>
                    ) : (
                      <>
                        <GitBranch size={18} />

                        {githubConnection
                          ? "Update Repository"
                          : "Connect Repository"}
                      </>
                    )}

                  </button>

                  {githubConnection && (
                    <button
                      type="button"
                      onClick={handlePushToGitHub}
                      disabled={githubConnecting}
                      className="
                        inline-flex
                        items-center
                        gap-2
                        rounded-xl
                        bg-cyan-500
                        px-5
                        py-3
                        font-semibold
                        text-black
                        transition
                        hover:bg-cyan-400
                        disabled:cursor-not-allowed
                        disabled:opacity-50
                      "
                    >
                      {githubConnecting ? (
                        <>
                          <Loader2
                            size={18}
                            className="animate-spin"
                          />
                          Pushing...
                        </>
                      ) : (
                        <>
                          🚀
                          Push Changes
                        </>
                      )}
                    </button>
                  )}

                </div>

              </div>
            )}

          </section>

          {/* Deployment Status */}

          <DeploymentStatus
            deployment={project.deployment}
          />

          <ProjectAnalytics />

          <TaskBoard />

          <RepositoryStats
            github={
              githubConnection?.repositoryUrl ||
              project.github
            }
          />

          <TeamMembers />

        </main>
      </div>
    </div>
  );
}