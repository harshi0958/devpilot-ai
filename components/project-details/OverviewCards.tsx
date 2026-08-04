"use client";

import {
  Bot,
  Users,
  FolderOpen,
  CheckSquare,
} from "lucide-react";

interface OverviewCardsProps {
  agents: number;
  activeAgents: number;
  members: number;
  onlineMembers: number;
  files: number;
  tasks: number;
  pendingTasks: number;
}

export default function OverviewCards({
  agents,
  activeAgents,
  members,
  onlineMembers,
  files,
  tasks,
  pendingTasks,
}: OverviewCardsProps) {
  const stats = [
    {
      title: "AI Agents",
      value: agents,
      subtitle: `${activeAgents} Active`,
      icon: Bot,
      color: "text-cyan-400",
    },
    {
      title: "Team Members",
      value: members,
      subtitle: `${onlineMembers} Online`,
      icon: Users,
      color: "text-green-400",
    },
    {
      title: "Files",
      value: files,
      subtitle: "Project Assets",
      icon: FolderOpen,
      color: "text-purple-400",
    },
    {
      title: "Tasks",
      value: tasks,
      subtitle: `${pendingTasks} Pending`,
      icon: CheckSquare,
      color: "text-yellow-400",
    },
  ];

  return (
    <section className="mt-8">
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
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
                hover:-translate-y-1
                hover:border-cyan-500/30
                hover:shadow-lg
                hover:shadow-cyan-500/5
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

                  <p className="mt-1 text-sm text-slate-500">
                    {item.subtitle}
                  </p>
                </div>

                <div
                  className={`
                    rounded-xl
                    bg-[#1B2433]
                    p-3
                    ${item.color}
                  `}
                >
                  <Icon size={26} />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}