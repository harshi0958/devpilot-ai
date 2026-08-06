import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { notFound } from "next/navigation";

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


import { projects } from "@/data/projects";

export default async function ProjectDetailsPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;

  const project = projects.find(
    (p) => p.id === projectId
  );

  if (!project) {
    notFound();
  }

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

<RepositoryStats
  github={project.github}
/>
<TeamMembers />
        </main>
      </div>
    </div>
  );
}