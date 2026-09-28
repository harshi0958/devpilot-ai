"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ChevronRight, Loader2, ArrowLeft } from "lucide-react";
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
  | Load Project From Backend
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    const loadProject = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `http://localhost:5000/api/projects/${projectId}`,
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

        /*
        |--------------------------------------------------------------------------
        | Backend Project → Frontend Project
        |--------------------------------------------------------------------------
        */

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
            github={project.github}
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

          {/* Deployment Status */}

          <DeploymentStatus
            deployment={project.deployment}
          />

          <ProjectAnalytics />

          <TaskBoard />

          <RepositoryStats
            github={project.github}
          />

          <TeamMembers />

        </main>
      </div>
    </div>
  );
}