"use client";

import {
  ClipboardList,
  CheckCircle2,
  Loader2,
  AlertTriangle,
  TrendingUp,
} from "lucide-react";

import { Task } from "@/data/tasks";

interface Props {
  tasks: Task[];
}

export default function TaskStats({
  tasks,
}: Props) {
  const total = tasks.length;

  const completed = tasks.filter(
    (t) => t.status === "Done"
  ).length;

  const progress = tasks.filter(
    (t) => t.status === "In Progress"
  ).length;

  const high = tasks.filter(
    (t) => t.priority === "High"
  ).length;

  const productivity =
    total === 0
      ? 0
      : Math.round(
          (completed / total) * 100
        );

  const cards = [
    {
      title: "Total Tasks",
      value: total,
      icon: ClipboardList,
      color: "text-cyan-400",
    },
    {
      title: "Completed",
      value: completed,
      icon: CheckCircle2,
      color: "text-emerald-400",
    },
    {
      title: "In Progress",
      value: progress,
      icon: Loader2,
      color: "text-yellow-400",
    },
    {
      title: "High Priority",
      value: high,
      icon: AlertTriangle,
      color: "text-red-400",
    },
    {
      title: "Productivity",
      value: `${productivity}%`,
      icon: TrendingUp,
      color: "text-purple-400",
    },
  ];

  return (
    <div className="mb-10 grid gap-6 md:grid-cols-2 xl:grid-cols-5">
      {cards.map((card) => {
        const Icon = card.icon;

        return (
          <div
            key={card.title}
            className="
              rounded-2xl
              border
              border-white/10
              bg-[#111827]
              p-6
              transition
              hover:border-cyan-500/30
            "
          >
            <div className="flex items-center justify-between">

              <div>
                <p className="text-sm text-slate-400">
                  {card.title}
                </p>

                <h2 className="mt-2 text-3xl font-bold text-white">
                  {card.value}
                </h2>
              </div>

              <div
                className={`rounded-xl bg-[#1B2433] p-3 ${card.color}`}
              >
                <Icon size={24} />
              </div>

            </div>
          </div>
        );
      })}
    </div>
  );
}