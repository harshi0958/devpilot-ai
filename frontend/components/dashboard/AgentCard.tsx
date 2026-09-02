"use client";

import { ArrowUpRight } from "lucide-react";

interface AgentCardProps {
  icon: React.ReactNode;
  name: string;
  description: string;
  status: string;
  progress: number;
  color: string;
}

export default function AgentCard({
  icon,
  name,
  description,
  status,
  progress,
  color,
}: AgentCardProps) {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#101827] p-5 transition hover:border-cyan-500/40 hover:shadow-lg hover:shadow-cyan-500/10">

      <div className="flex items-start justify-between">

        <div className="flex gap-4">

          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/5 text-cyan-400">
            {icon}
          </div>

          <div>
            <h3 className="text-lg font-semibold text-white">
              {name}
            </h3>

            <p className="mt-1 text-sm text-slate-400">
              {description}
            </p>
          </div>

        </div>

        <span className={`rounded-full px-3 py-1 text-xs font-medium ${color}`}>
          {status}
        </span>

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

        <div className="h-2 overflow-hidden rounded-full bg-white/10">

          <div
            style={{ width: `${progress}%` }}
            className="h-full rounded-full bg-linear-to-r from-cyan-400 via-blue-500 to-purple-500"
          />

        </div>

      </div>

      <button className="mt-5 flex items-center gap-2 text-sm text-cyan-400 transition hover:translate-x-1">

        View Details

        <ArrowUpRight size={15} />

      </button>

    </div>
  );
}