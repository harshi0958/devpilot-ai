"use client";

import {
  FolderKanban,
  Bot,
  CheckCircle2,
  Rocket,
  TrendingUp,
} from "lucide-react";

const stats = [
  {
    title: "Active Projects",
    value: "12",
    change: "+18%",
    icon: FolderKanban,
    color: "text-cyan-400",
  },
  {
    title: "AI Agents",
    value: "7",
    change: "Running",
    icon: Bot,
    color: "text-violet-400",
  },
  {
    title: "Tasks Completed",
    value: "128",
    change: "+34%",
    icon: CheckCircle2,
    color: "text-emerald-400",
  },
  {
    title: "Deployments",
    value: "24",
    change: "Healthy",
    icon: Rocket,
    color: "text-orange-400",
  },
];

export default function StatsCards() {
  return (
    <section className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
      {stats.map((item) => {
        const Icon = item.icon;

        return (
          <div
            key={item.title}
            className="
              group
              rounded-2xl
              border
              border-white/10
              bg-[#0B1220]
              p-6
              transition-all
              duration-300
              hover:-translate-y-1
              hover:border-cyan-500/40
              hover:shadow-[0_0_40px_rgba(6,182,212,0.15)]
            "
          >
            <div className="flex items-center justify-between">
              <div
                className="
                  rounded-xl
                  bg-white/5
                  p-3
                  transition
                  group-hover:bg-cyan-500/10
                "
              >
                <Icon size={24} className={item.color} />
              </div>

              <div className="flex items-center gap-1 text-xs text-emerald-400">
                <TrendingUp size={14} />
                {item.change}
              </div>
            </div>

            <h2 className="mt-6 text-3xl font-bold text-white">
              {item.value}
            </h2>

            <p className="mt-2 text-sm text-slate-400">
              {item.title}
            </p>
          </div>
        );
      })}
    </section>
  );
}