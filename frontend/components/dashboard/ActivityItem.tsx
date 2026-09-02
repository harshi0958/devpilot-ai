"use client";

import { ArrowUpRight } from "lucide-react";

interface ActivityItemProps {
  title: string;
  description: string;
  time: string;
  color: string;
}

export default function ActivityItem({
  title,
  description,
  time,
  color,
}: ActivityItemProps) {
  return (
    <div className="relative flex gap-4">

      {/* Timeline Dot */}

      <div className="flex flex-col items-center">

        <div className={`h-3 w-3 rounded-full ${color}`} />

        <div className="mt-2 h-full w-px bg-white/10" />

      </div>

      {/* Content */}

      <div className="flex-1 rounded-xl border border-white/10 bg-[#101827] p-4 transition hover:border-cyan-500/40">

        <div className="flex items-start justify-between">

          <div>

            <h3 className="font-semibold text-white">
              {title}
            </h3>

            <p className="mt-1 text-sm text-slate-400">
              {description}
            </p>

          </div>

          <ArrowUpRight
            size={16}
            className="text-cyan-400"
          />

        </div>

        <p className="mt-3 text-xs text-slate-500">
          {time}
        </p>

      </div>

    </div>
  );
}