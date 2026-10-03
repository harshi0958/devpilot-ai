"use client";

import { useEffect, useState } from "react";
import ActivityItem from "./ActivityItem";
import { Loader2 } from "lucide-react";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

type Execution = {
  id: string;
  status: string;
  model: string;
  prompt: string;
  response?: string | null;
  createdAt: string;

  agent?: {
    id: string;
    name: string;
    type: string;
  } | null;

  project?: {
    id: string;
    name: string;
    slug: string;
  } | null;
};

export default function ActivityTimeline() {
  const [executions, setExecutions] = useState<Execution[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExecutions = async () => {
      try {
        setLoading(true);

        const response = await fetch(
          `${API_URL}/api/executions`,
          {
            method: "GET",
            credentials: "include",
          }
        );

        const data = await response.json();

        if (!response.ok || !data?.success) {
          throw new Error(
            data?.message || "Failed to fetch activities"
          );
        }

        const executionList: Execution[] =
          Array.isArray(data?.data)
            ? data.data
            : [];

        // Always show the most recent executions first.
        const sortedExecutions = [...executionList]
          .sort(
            (a, b) =>
              new Date(b.createdAt).getTime() -
              new Date(a.createdAt).getTime()
          )
          .slice(0, 5);

        setExecutions(sortedExecutions);
      } catch (error) {
        console.error(
          "Failed to load activity timeline:",
          error
        );

        setExecutions([]);
      } finally {
        setLoading(false);
      }
    };

    fetchExecutions();
  }, []);

  const getColor = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return "bg-emerald-400";

      case "FAILED":
        return "bg-red-400";

      case "RUNNING":
        return "bg-yellow-400";

      case "QUEUED":
        return "bg-violet-400";

      default:
        return "bg-cyan-400";
    }
  };

  const getRelativeTime = (date: string) => {
    const createdAt = new Date(date).getTime();

    if (Number.isNaN(createdAt)) {
      return "Unknown time";
    }

    const difference = Math.max(
      0,
      Date.now() - createdAt
    );

    const seconds = Math.floor(difference / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (seconds < 60) {
      return "Just now";
    }

    if (minutes < 60) {
      return `${minutes} min ago`;
    }

    if (hours < 24) {
      return `${hours} hour${hours > 1 ? "s" : ""} ago`;
    }

    return `${days} day${days > 1 ? "s" : ""} ago`;
  };

  const getPromptSummary = (prompt: string) => {
    const cleanPrompt = (prompt || "")
      .replace(/\s+/g, " ")
      .trim();

    if (!cleanPrompt) {
      return "AI execution completed";
    }

    if (cleanPrompt.length <= 70) {
      return cleanPrompt;
    }

    return `${cleanPrompt.substring(0, 70)}...`;
  };

  return (
    <section className="mt-12">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white">
          Recent Activity
        </h2>

        <p className="mt-1 text-slate-400">
          Live updates from your AI engineering team.
        </p>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex min-h-40 items-center justify-center rounded-2xl border border-white/10 bg-[#0B1220]">
          <div className="flex items-center gap-3 text-slate-400">
            <Loader2
              size={20}
              className="animate-spin text-cyan-400"
            />

            Loading recent activity...
          </div>
        </div>
      )}

      {/* Empty */}
      {!loading && executions.length === 0 && (
        <div className="flex min-h-40 items-center justify-center rounded-2xl border border-white/10 bg-[#0B1220]">
          <p className="text-sm text-slate-500">
            No AI activity yet.
          </p>
        </div>
      )}

      {/* Activity */}
      {!loading && executions.length > 0 && (
        <div className="space-y-6">
          {executions.map((execution) => (
            <ActivityItem
              key={execution.id}
              title={
                execution.agent?.name ||
                "AI Agent"
              }
              description={
                execution.project
                  ? `${execution.project.name} • ${getPromptSummary(
                      execution.prompt
                    )}`
                  : getPromptSummary(
                      execution.prompt
                    )
              }
              time={getRelativeTime(
                execution.createdAt
              )}
              color={getColor(
                execution.status
              )}
            />
          ))}
        </div>
      )}
    </section>
  );
}