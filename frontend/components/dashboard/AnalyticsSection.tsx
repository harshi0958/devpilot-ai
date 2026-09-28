"use client";

import { useEffect, useState } from "react";
import AnalyticsCard from "./AnalyticsCard";
import { Loader2 } from "lucide-react";

type Execution = {
  status: string;
};

type Project = {
  id: string;
};

export default function AnalyticsSection() {
  const [executions, setExecutions] = useState<Execution[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const [executionsResponse, projectsResponse] =
          await Promise.all([
            fetch("http://localhost:5000/api/executions", {
              credentials: "include",
            }),
            fetch("http://localhost:5000/api/projects", {
              credentials: "include",
            }),
          ]);

        const executionsData = await executionsResponse.json();
        const projectsData = await projectsResponse.json();

        setExecutions(
          Array.isArray(executionsData?.data)
            ? executionsData.data
            : []
        );

        setProjects(
          Array.isArray(projectsData?.projects)
            ? projectsData.projects
            : []
        );
      } catch (error) {
        console.error(
          "Failed to load analytics:",
          error
        );
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  const totalExecutions = executions.length;

  const completedExecutions = executions.filter(
    (execution) => execution.status === "COMPLETED"
  ).length;

  const failedExecutions = executions.filter(
    (execution) => execution.status === "FAILED"
  ).length;

  const successRate =
    totalExecutions > 0
      ? Math.round(
          (completedExecutions / totalExecutions) * 100
        )
      : 0;

  const executionActivity =
    totalExecutions > 0
      ? `${totalExecutions} executions`
      : "No executions";

  const failureRate =
    totalExecutions > 0
      ? Math.round(
          (failedExecutions / totalExecutions) * 100
        )
      : 0;

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
            value={`${projects.length}`}
            change={
              failureRate > 0
                ? `${failureRate}% execution failure`
                : "No execution failures"
            }
            color="text-purple-400"
          />
        </div>
      )}
    </section>
  );
}