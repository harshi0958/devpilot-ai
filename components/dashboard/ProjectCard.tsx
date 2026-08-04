"use client";

import { ArrowUpRight, Clock } from "lucide-react";

interface ProjectCardProps {
  name: string;
  status: string;
  progress: number;
  updated: string;
  color: string;
}

export default function ProjectCard({
  name,
  status,
  progress,
  updated,
  color,
}: ProjectCardProps) {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#101827] p-5 transition hover:border-cyan-500/40 hover:shadow-lg hover:shadow-cyan-500/10">

      <div className="flex items-center justify-between">

        <div>
          <h3 className="text-lg font-semibold text-white">
            {name}
          </h3>

          <div className="mt-2 flex items-center gap-2">

            <span
              className={`h-2.5 w-2.5 rounded-full ${color}`}
            />

            <span className="text-sm text-slate-400">
              {status}
            </span>

          </div>

        </div>

        <button className="rounded-lg border border-white/10 p-2 transition hover:border-cyan-500 hover:text-cyan-400">
          <ArrowUpRight size={18} />
        </button>

      </div>

      <div className="mt-6">

        <div className="mb-2 flex justify-between text-sm">

          <span className="text-slate-400">
            Progress
          </span>

          <span className="text-cyan-400 font-medium">
            {progress}%
          </span>

        </div>

        <div className="h-2 rounded-full bg-white/10 overflow-hidden">

          <div
            style={{ width: `${progress}%` }}
            className="h-full rounded-full bg-linear-to-r from-cyan-400 to-purple-500"
          />

        </div>

      </div>

      <div className="mt-5 flex items-center gap-2 text-sm text-slate-500">

        <Clock size={15} />

        {updated}

      </div>

    </div>
  );
}