"use client";

import { FolderKanban, Plus } from "lucide-react";

interface ProjectsHeaderProps {
  onNewProject?: () => void;
}

export default function ProjectsHeader({
  onNewProject,
}: ProjectsHeaderProps) {
  return (
    <div className="mb-8 flex items-center justify-between">
      <div>
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-cyan-500/10 p-3 text-cyan-400">
            <FolderKanban size={24} />
          </div>

          <div>
            <h1 className="text-4xl font-bold text-white">
              Projects
            </h1>

            <p className="mt-1 text-slate-400">
              Manage, build and deploy your AI software projects.
            </p>
          </div>
        </div>
      </div>

      <button
        onClick={onNewProject}
        className="
          flex
          items-center
          gap-2
          rounded-xl
          bg-cyan-500
          px-5
          py-3
          font-semibold
          text-black
          transition-all
          duration-300
          hover:scale-105
          hover:bg-cyan-400
        "
      >
        <Plus size={18} />
        New Project
      </button>
    </div>
  );
}