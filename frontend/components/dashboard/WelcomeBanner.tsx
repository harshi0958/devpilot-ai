"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Sparkles, Loader2 } from "lucide-react";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

type Stats = {
  projects: number;
  agents: number;
  executions: number;
  files: number;
  completed: number;
  failed: number;
  successRate: number;
};

type DashboardStatsResponse = {
  success: boolean;
  stats: Stats;
};

export default function WelcomeBanner() {
  const [stats, setStats] = useState<Stats>({
    projects: 0,
    agents: 0,
    executions: 0,
    files: 0,
    completed: 0,
    failed: 0,
    successRate: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const fetchStats = async () => {
      try {
        const response = await fetch(
          `${API_URL}/api/dashboard/stats`,
          {
            method: "GET",
            credentials: "include",
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch workspace stats");
        }

        const data: DashboardStatsResponse =
          await response.json();

        if (!cancelled && data.success && data.stats) {
          setStats({
            projects: data.stats.projects ?? 0,
            agents: data.stats.agents ?? 0,
            executions: data.stats.executions ?? 0,
            files: data.stats.files ?? 0,
            completed: data.stats.completed ?? 0,
            failed: data.stats.failed ?? 0,
            successRate: data.stats.successRate ?? 0,
          });
        }
      } catch (error) {
        console.error(
          "Failed to load workspace stats:",
          error
        );
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchStats();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-linear-to-r from-cyan-500/10 via-slate-900 to-slate-950 p-8">
      {/* Background Glow */}
      <div className="absolute -top-20 -right-20 h-60 w-60 rounded-full bg-cyan-500/10 blur-3xl" />

      <div className="relative flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
        {/* Left Content */}
        <div>
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-cyan-500/20 bg-cyan-500/10 px-4 py-2 text-sm text-cyan-400">
            <Sparkles size={16} />
            AI Workspace Ready
          </div>

          <h1 className="text-4xl font-bold text-white">
            Welcome back,
            <span className="text-cyan-400"> Harshit 👋</span>
          </h1>

          <p className="mt-4 max-w-2xl text-slate-400">
            Manage your AI agents, monitor projects, generate code,
            deploy applications and collaborate with your autonomous
            development team from one intelligent dashboard.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
  <Link
    href="/agents"
    className="rounded-xl bg-cyan-500 px-6 py-3 font-semibold text-black transition hover:scale-105 hover:bg-cyan-400"
  >
    Launch Workspace
  </Link>

  <Link
    href="/projects"
    className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-6 py-3 text-white transition hover:border-cyan-500 hover:bg-cyan-500/10"
  >
    View Projects
    <ArrowRight size={18} />
  </Link>
</div>
        </div>

        {/* Right Card */}
        <div className="w-full max-w-sm rounded-2xl border border-white/10 bg-black/30 p-6 backdrop-blur-xl">
          <p className="text-sm text-slate-400">
            Workspace Status
          </p>

          <div className="mt-6 space-y-5">
            {/* AI Agents */}
            <div className="flex items-center justify-between">
              <span className="text-slate-300">
                AI Agents
              </span>

              {loading ? (
                <Loader2
                  size={16}
                  className="animate-spin text-cyan-400"
                />
              ) : (
                <span className="font-semibold text-green-400">
                  {stats.agents} Active
                </span>
              )}
            </div>

            {/* Projects */}
            <div className="flex items-center justify-between">
              <span className="text-slate-300">
                Projects
              </span>

              {loading ? (
                <Loader2
                  size={16}
                  className="animate-spin text-cyan-400"
                />
              ) : (
                <span className="font-semibold text-cyan-400">
                  {stats.projects}
                </span>
              )}
            </div>

            {/* Completed Tasks */}
            <div className="flex items-center justify-between">
              <span className="text-slate-300">
                Tasks Completed
              </span>

              {loading ? (
                <Loader2
                  size={16}
                  className="animate-spin text-cyan-400"
                />
              ) : (
                <span className="font-semibold text-white">
                  {stats.completed}
                </span>
              )}
            </div>

            {/* Deployment */}
            <div className="flex items-center justify-between">
              <span className="text-slate-300">
                Deployment
              </span>

              <span className="font-semibold text-emerald-400">
                Healthy
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}