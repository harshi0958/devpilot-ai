"use client";

import {
  GitCommit,
  Rocket,
  Bot,
  CheckCircle2,
  FileText,
} from "lucide-react";

const activities = [
  {
    icon: GitCommit,
    title: "New commit pushed",
    description: "Harshit pushed 8 commits to main branch.",
    time: "5 min ago",
    color: "text-cyan-400",
  },
  {
    icon: Bot,
    title: "AI Review Completed",
    description: "Athena reviewed 14 changed files.",
    time: "18 min ago",
    color: "text-purple-400",
  },
  {
    icon: Rocket,
    title: "Deployment Started",
    description: "Production deployment has started.",
    time: "45 min ago",
    color: "text-green-400",
  },
  {
    icon: FileText,
    title: "README Updated",
    description: "Project documentation updated.",
    time: "Yesterday",
    color: "text-yellow-400",
  },
  {
    icon: CheckCircle2,
    title: "Build Successful",
    description: "Latest build passed all checks.",
    time: "Yesterday",
    color: "text-emerald-400",
  },
];

export default function ActivityFeed() {
  return (
    <section
      className="
      rounded-3xl
      border
      border-white/10
      bg-[#111827]
      p-6
    "
    >
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-bold text-white">
          Activity Feed
        </h2>

        <span className="text-sm text-slate-500">
          Latest Updates
        </span>
      </div>

      <div className="space-y-6">
        {activities.map((activity, index) => {
          const Icon = activity.icon;

          return (
            <div
              key={index}
              className="relative flex gap-4"
            >
              {/* Timeline */}
              {index !== activities.length - 1 && (
                <div
                  className="
                  absolute
                  left-5
                  top-10
                  h-full
                  w-px
                  bg-white/10
                "
                />
              )}

              {/* Icon */}

              <div
                className="
                z-10
                flex
                h-10
                w-10
                items-center
                justify-center
                rounded-xl
                bg-[#0F172A]
              "
              >
                <Icon
                  size={18}
                  className={activity.color}
                />
              </div>

              {/* Content */}

              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-white">
                    {activity.title}
                  </h3>

                  <span className="text-xs text-slate-500">
                    {activity.time}
                  </span>
                </div>

                <p className="mt-1 text-sm text-slate-400">
                  {activity.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}