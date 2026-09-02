"use client";

import {
  FolderKanban,
  Settings,
  Star,
  GitBranch,
  ExternalLink,
  Users,
  Bot,
  Clock3,
} from "lucide-react";

interface ProjectHeaderProps {
  name: string;
  description: string;
  status: "Running" | "Building" | "Testing" | "Completed";
  progress: number;
  techStack: readonly string[];
  github: string;
  deployment: string;
}

export default function ProjectHeader({
  name,
  description,
  status,
  progress,
  techStack,
  github,
  deployment,
}: ProjectHeaderProps) {
  const statusColor = {
    Running: "bg-emerald-500/15 text-emerald-400",
    Building: "bg-purple-500/15 text-purple-400",
    Testing: "bg-yellow-500/15 text-yellow-400",
    Completed: "bg-cyan-500/15 text-cyan-400",
  };

  return (
    <section className="rounded-3xl border border-white/10 bg-[#111827] p-8">
      <div className="flex flex-col justify-between gap-8 lg:flex-row">
        {/* Left */}
        <div className="flex gap-5">
          <div
            className="
              flex
              h-16
              w-16
              items-center
              justify-center
              rounded-2xl
              bg-cyan-500/10
              text-cyan-400
            "
          >
            <FolderKanban size={30} />
          </div>

          <div>
            {/* Title */}
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-4xl font-bold text-white">
                {name}
              </h1>

              <span
                className={`rounded-full px-3 py-1 text-sm font-semibold ${statusColor[status]}`}
              >
                {status}
              </span>
            </div>

            {/* Description */}
            <p className="mt-3 max-w-3xl text-slate-400">
              {description}
            </p>

            {/* Project Info */}
            <div className="mt-5 flex flex-wrap items-center gap-5 text-sm text-slate-400">
              <div className="flex items-center gap-2">
                <Users size={16} />
                <span>Team Workspace</span>
              </div>

              <div className="flex items-center gap-2">
                <Bot size={16} />
                <span>AI Powered</span>
              </div>

              <div className="flex items-center gap-2">
                <Clock3 size={16} />
                <span>Updated Recently</span>
              </div>
            </div>

            {/* Tech Stack */}
            <div className="mt-5 flex flex-wrap gap-2">
              {techStack.map((tech) => (
                <span
                  key={tech}
                  className="
                    rounded-full
                    border
                    border-cyan-500/20
                    bg-cyan-500/10
                    px-3
                    py-1
                    text-xs
                    text-cyan-300
                  "
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Right Buttons */}
        <div className="flex flex-wrap items-start gap-3">
          <button
            className="
              rounded-xl
              border
              border-white/10
              p-3
              text-slate-400
              transition-all
              hover:border-yellow-400
              hover:text-yellow-400
            "
          >
            <Star size={20} />
          </button>

          {github && (
            <button
              onClick={() => window.open(github, "_blank")}
              className="
                flex
                items-center
                gap-2
                rounded-xl
                border
                border-white/10
                px-5
                py-3
                text-white
                transition-all
                hover:border-cyan-500
                hover:text-cyan-400
              "
            >
              <GitBranch size={18} />
GitHub
            </button>
          )}

          {deployment && (
            <button
              onClick={() => window.open(deployment, "_blank")}
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
                hover:scale-105
                hover:bg-cyan-400
              "
            >
              <ExternalLink size={18} />
              Live Demo
            </button>
          )}

          <button
            className="
              rounded-xl
              border
              border-white/10
              p-3
              text-slate-400
              transition-all
              hover:border-cyan-500
              hover:text-cyan-400
            "
          >
            <Settings size={20} />
          </button>
        </div>
      </div>

      {/* Progress */}
      <div className="mt-8">
        <div className="mb-2 flex justify-between">
          <span className="text-sm text-slate-400">
            Overall Progress
          </span>

          <span className="font-semibold text-cyan-400">
            {progress}%
          </span>
        </div>

        <div className="h-3 overflow-hidden rounded-full bg-white/10">
          <div
            style={{ width: `${progress}%` }}
            className="
              h-full
              rounded-full
              bg-linear-to-r
              from-cyan-400
              via-blue-500
              to-purple-500
            "
          />
        </div>
      </div>
    </section>
  );
}