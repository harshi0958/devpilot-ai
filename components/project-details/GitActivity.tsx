"use client";

import {
  GitCommit,
  GitPullRequest,
  CheckCircle2,
  Rocket,
} from "lucide-react";

const activities = [
  {
    icon: GitCommit,
    title: "8 commits pushed",
    subtitle: "Harshit • 12 min ago",
    color: "text-cyan-400",
  },
  {
    icon: GitPullRequest,
    title: "Pull Request Created",
    subtitle: "Feature/project-dashboard",
    color: "text-purple-400",
  },
  {
    icon: CheckCircle2,
    title: "Build Passed",
    subtitle: "All checks successful",
    color: "text-emerald-400",
  },
  {
    icon: Rocket,
    title: "Deployment Ready",
    subtitle: "Waiting for production",
    color: "text-yellow-400",
  },
];

export default function GitActivity() {
  return (
    <section className="rounded-3xl border border-white/10 bg-[#111827] p-6">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-bold text-white">
          Git Activity
        </h2>

        <span className="text-sm text-slate-500">
          Repository
        </span>
      </div>

      <div className="space-y-4">
        {activities.map((item, index) => {
          const Icon = item.icon;

          return (
            <div
              key={index}
              className="
                flex
                items-center
                gap-4
                rounded-2xl
                border
                border-white/10
                bg-[#0F172A]
                p-4
                transition-all
                duration-300
                hover:border-cyan-500/30
              "
            >
              <div className="rounded-xl bg-white/5 p-3">
                <Icon
                  size={20}
                  className={item.color}
                />
              </div>

              <div>
                <h3 className="font-medium text-white">
                  {item.title}
                </h3>

                <p className="text-sm text-slate-400">
                  {item.subtitle}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}