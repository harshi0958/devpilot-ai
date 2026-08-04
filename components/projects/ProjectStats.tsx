"use client";

import {
  FolderKanban,
  PlayCircle,
  CheckCircle2,
  Archive,
} from "lucide-react";

const stats = [
  {
    title: "Total Projects",
    value: "12",
    icon: FolderKanban,
    color: "text-cyan-400",
  },
  {
    title: "Running",
    value: "5",
    icon: PlayCircle,
    color: "text-green-400",
  },
  {
    title: "Completed",
    value: "6",
    icon: CheckCircle2,
    color: "text-emerald-400",
  },
  {
    title: "Archived",
    value: "1",
    icon: Archive,
    color: "text-slate-400",
  },
];

export default function ProjectStats() {
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

              <div className={`rounded-xl bg-[#1B2433] p-3 ${item.color}`}>
                <Icon size={24} />
              </div>

            </div>
          </div>
        );
      })}
    </div>
  );
}