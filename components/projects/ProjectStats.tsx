"use client";

import {
  FolderKanban,
  PlayCircle,
  CheckCircle2,
  Archive,
} from "lucide-react";

import { type Project } from "@/data/projects";

interface ProjectStatsProps {
  projects: Project[];
}

export default function ProjectStats({
  projects,
}: ProjectStatsProps) {
  const totalProjects = projects.filter(
    (p) => !p.archived
  ).length;

  const runningProjects = projects.filter(
    (p) => p.status === "Running" && !p.archived
  ).length;

  const completedProjects = projects.filter(
    (p) => p.status === "Completed" && !p.archived
  ).length;

  const archivedProjects = projects.filter(
    (p) => p.archived
  ).length;

  const stats = [
    {
      title: "Total Projects",
      value: totalProjects,
      icon: FolderKanban,
      color: "text-cyan-400",
    },
    {
      title: "Running",
      value: runningProjects,
      icon: PlayCircle,
      color: "text-green-400",
    },
    {
      title: "Completed",
      value: completedProjects,
      icon: CheckCircle2,
      color: "text-emerald-400",
    },
    {
      title: "Archived",
      value: archivedProjects,
      icon: Archive,
      color: "text-slate-400",
    },
  ];

  return (
    <div className="mb-8 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
      {stats.map((item) => {
        const Icon = item.icon;

        return (
          <div
            key={item.title}
            className="
              rounded-2xl
              border
              border-white/10
              bg-[#111827]
              p-6
              transition-all
              duration-300
              hover:border-cyan-500/30
            "
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">
                  {item.title}
                </p>

                <h2 className="mt-2 text-3xl font-bold text-white">
                  {item.value}
                </h2>
              </div>

              <div
                className={`rounded-xl bg-[#1B2433] p-3 ${item.color}`}
              >
                <Icon size={24} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}