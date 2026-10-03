"use client";

import { useEffect, useState } from "react";
import {
  FolderKanban,
  Bot,
  Activity,
  FileCode2,
  TrendingUp,
  Loader2,
} from "lucide-react";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

type Stats = {
  projects: number;
  agents: number;
  executions: number;
  files: number;
};

type DashboardStatsResponse = {
  success: boolean;
  stats: Stats;
};

export default function StatsCards() {
  const [stats, setStats] = useState<Stats>({
    projects: 0,
    agents: 0,
    executions: 0,
    files: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const fetchDashboardStats = async () => {
      try {
        const response = await fetch(
          `${API_URL}/api/dashboard/stats`,
          {
            method: "GET",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error(
            `Dashboard stats request failed: ${response.status}`
          );
        }

        const result: DashboardStatsResponse =
          await response.json();

        if (cancelled) return;

        if (result.success && result.stats) {
          setStats({
            projects: result.stats.projects ?? 0,
            agents: result.stats.agents ?? 0,
            executions: result.stats.executions ?? 0,
            files: result.stats.files ?? 0,
          });
        }
      } catch (error) {
        console.error(
          "Failed to load dashboard statistics:",
          error
        );
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchDashboardStats();

    return () => {
      cancelled = true;
    };
  }, []);

  const statsCards = [
    {
      title: "Projects",
      value: stats.projects,
      subtitle: "Created projects",
      icon: FolderKanban,
      color: "text-cyan-400",
    },
    {
      title: "AI Agents",
      value: stats.agents,
      subtitle: "Available agents",
      icon: Bot,
      color: "text-violet-400",
    },
    {
      title: "AI Executions",
      value: stats.executions,
      subtitle: "Total executions",
      icon: Activity,
      color: "text-orange-400",
    },
    {
      title: "Generated Files",
      value: stats.files,
      subtitle: "Project files",
      icon: FileCode2,
      color: "text-emerald-400",
    },
  ];

  return (
    <section className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
      {statsCards.map((item) => {
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
                Live
              </div>
            </div>

            <h2 className="mt-6 text-3xl font-bold text-white">
              {loading ? (
                <Loader2
                  size={28}
                  className="animate-spin text-cyan-400"
                />
              ) : (
                item.value
              )}
            </h2>

            <p className="mt-2 text-sm text-slate-400">
              {item.title}
            </p>

            <p className="mt-1 text-xs text-slate-500">
              {item.subtitle}
            </p>
          </div>
        );
      })}
    </section>
  );
}