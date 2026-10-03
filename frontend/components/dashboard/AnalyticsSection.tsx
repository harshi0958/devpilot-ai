"use client";

import { useEffect, useState } from "react";
import AnalyticsCard from "./AnalyticsCard";
import { Loader2 } from "lucide-react";

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

export default function AnalyticsSection() {
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

    const fetchAnalytics = async () => {
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
            `Analytics request failed: ${response.status}`
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
            completed: result.stats.completed ?? 0,
            failed: result.stats.failed ?? 0,
            successRate: result.stats.successRate ?? 0,
          });
        }
      } catch (error) {
        console.error(
          "Failed to load analytics:",
          error
        );
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchAnalytics();

    return () => {
      cancelled = true;
    };
  }, []);

  const totalExecutions = stats.executions;
  const completedExecutions = stats.completed;
  const failedExecutions = stats.failed;
  const successRate = stats.successRate;

  const executionActivity =
    totalExecutions > 0
      ? `${totalExecutions} executions`
      : "No executions";

  const failureActivity =
    failedExecutions > 0
      ? `${failedExecutions} failed executions`
      : "No execution failures";

  return (
    <section className="mt-12">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-white">
          Analytics
        </h2>

        <p className="mt-2 text-slate-400">
          Overview of your AI workspace performance.
        </p>
      </div>

      {loading ? (
        <div className="flex min-h-45 items-center justify-center rounded-2xl border border-white/10 bg-[#0B1220]">
          <div className="flex items-center gap-3 text-slate-400">
            <Loader2
              size={20}
              className="animate-spin text-cyan-400"
            />
            Loading analytics...
          </div>
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-3">
          <AnalyticsCard
            title="AI Success Rate"
            value={`${successRate}%`}
            change={`${completedExecutions} completed`}
            color="text-emerald-400"
          />

          <AnalyticsCard
            title="AI Usage"
            value={`${totalExecutions}`}
            change={executionActivity}
            color="text-cyan-400"
          />

          <AnalyticsCard
            title="Active Projects"
            value={`${stats.projects}`}
            change={failureActivity}
            color="text-purple-400"
          />
        </div>
      )}
    </section>
  );
}