"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Clock3,
  Bot,
  FolderKanban,
  CheckCircle2,
  XCircle,
  Loader2,
  ChevronRight,
  History as HistoryIcon,
} from "lucide-react";

import Sidebar from "@/components/dashboard/Sidebar";
import TopNavbar from "@/components/dashboard/TopNavbar";

type Execution = {
  id: string;
  status: string;
  model: string;
  prompt: string;
  response?: string | null;
  durationMs?: number | null;
  createdAt: string;
  completedAt?: string | null;

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

export default function HistoryPage() {
  const [executions, setExecutions] = useState<Execution[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchExecutions = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          "http://localhost:5000/api/agents/executions",
          {
            method: "GET",
            credentials: "include",
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data?.message ||
              "Failed to fetch execution history"
          );
        }

        setExecutions(data?.data || []);
      } catch (err) {
        console.error("History fetch error:", err);

        setError(
          err instanceof Error
            ? err.message
            : "Failed to load execution history"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchExecutions();
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return (
          <CheckCircle2
            size={18}
            className="text-emerald-400"
          />
        );

      case "FAILED":
        return (
          <XCircle
            size={18}
            className="text-red-400"
          />
        );

      case "RUNNING":
        return (
          <Loader2
            size={18}
            className="animate-spin text-yellow-400"
          />
        );

      default:
        return (
          <Clock3
            size={18}
            className="text-slate-400"
          />
        );
    }
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return "border-emerald-500/20 bg-emerald-500/10 text-emerald-400";

      case "FAILED":
        return "border-red-500/20 bg-red-500/10 text-red-400";

      case "RUNNING":
        return "border-yellow-500/20 bg-yellow-500/10 text-yellow-400";

      default:
        return "border-slate-500/20 bg-slate-500/10 text-slate-400";
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDuration = (
    durationMs?: number | null
  ) => {
    if (!durationMs) return "—";

    if (durationMs < 1000) {
      return `${durationMs}ms`;
    }

    return `${(durationMs / 1000).toFixed(1)}s`;
  };

  const truncatePrompt = (prompt: string) => {
    const cleanPrompt = prompt
      .replace(/\s+/g, " ")
      .trim();

    if (cleanPrompt.length <= 140) {
      return cleanPrompt;
    }

    return `${cleanPrompt.substring(0, 140)}...`;
  };

  return (
    <div className="flex min-h-screen bg-[#070B14]">
      <Sidebar />

      <div className="flex-1">
        <TopNavbar />

        <main className="p-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-cyan-500/20 bg-cyan-500/10">
                <HistoryIcon
                  size={22}
                  className="text-cyan-400"
                />
              </div>

              <div>
                <h1 className="text-4xl font-bold text-white">
                  Execution History
                </h1>

                <p className="mt-1 text-slate-400">
                  View your AI agent execution history and
                  results.
                </p>
              </div>
            </div>
          </div>

          {/* Loading */}
          {loading && (
            <div className="flex min-h-75 items-center justify-center rounded-2xl border border-white/10 bg-white/3">
              <div className="flex items-center gap-3 text-slate-400">
                <Loader2
                  size={22}
                  className="animate-spin text-cyan-400"
                />
                Loading execution history...
              </div>
            </div>
          )}

          {/* Error */}
          {!loading && error && (
            <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-6">
              <div className="flex items-center gap-3">
                <XCircle
                  size={22}
                  className="text-red-400"
                />

                <div>
                  <h2 className="font-semibold text-red-300">
                    Failed to load history
                  </h2>

                  <p className="mt-1 text-sm text-red-400">
                    {error}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Empty State */}
          {!loading &&
            !error &&
            executions.length === 0 && (
              <div className="flex min-h-87.5 flex-col items-center justify-center rounded-2xl border border-white/10 bg-white/3 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-cyan-500/10">
                  <Bot
                    size={30}
                    className="text-cyan-400"
                  />
                </div>

                <h2 className="mt-5 text-xl font-semibold text-white">
                  No AI executions yet
                </h2>

                <p className="mt-2 max-w-md text-sm text-slate-400">
                  Run an AI agent from your project workspace
                  and the execution will appear here.
                </p>

                <Link
                  href="/agents"
                  className="mt-6 rounded-xl bg-cyan-500 px-5 py-3 font-semibold text-black transition hover:bg-cyan-400"
                >
                  Open AI Workspace
                </Link>
              </div>
            )}

          {/* Execution List */}
          {!loading &&
            !error &&
            executions.length > 0 && (
              <div className="space-y-4">
                {/* Summary */}
                <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
                  <div className="rounded-2xl border border-white/10 bg-white/3 p-5">
                    <p className="text-sm text-slate-400">
                      Total Executions
                    </p>

                    <p className="mt-2 text-3xl font-bold text-white">
                      {executions.length}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-white/3 p-5">
                    <p className="text-sm text-slate-400">
                      Completed
                    </p>

                    <p className="mt-2 text-3xl font-bold text-emerald-400">
                      {
                        executions.filter(
                          (execution) =>
                            execution.status ===
                            "COMPLETED"
                        ).length
                      }
                    </p>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-white/3 p-5">
                    <p className="text-sm text-slate-400">
                      Failed
                    </p>

                    <p className="mt-2 text-3xl font-bold text-red-400">
                      {
                        executions.filter(
                          (execution) =>
                            execution.status === "FAILED"
                        ).length
                      }
                    </p>
                  </div>
                </div>

                {/* Cards */}
                {executions.map((execution) => (
                  <div
                    key={execution.id}
                    className="group rounded-2xl border border-white/10 bg-white/3 p-6 transition hover:border-cyan-500/30 hover:bg-white/5"
                  >
                    <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                      {/* Main Info */}
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-3">
                          <div className="flex items-center gap-2">
                            <Bot
                              size={19}
                              className="text-cyan-400"
                            />

                            <h2 className="font-semibold text-white">
                              {execution.agent?.name ||
                                "AI Agent"}
                            </h2>
                          </div>

                          <span
                            className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium ${getStatusClass(
                              execution.status
                            )}`}
                          >
                            {getStatusIcon(
                              execution.status
                            )}

                            {execution.status}
                          </span>
                        </div>

                        {/* Project */}
                        {execution.project && (
                          <div className="mt-3 flex items-center gap-2 text-sm text-slate-400">
                            <FolderKanban
                              size={15}
                              className="text-slate-500"
                            />

                            <span>
                              {execution.project.name}
                            </span>
                          </div>
                        )}

                        {/* Prompt */}
                        <div className="mt-5 rounded-xl border border-white/5 bg-black/20 p-4">
                          <p className="mb-2 text-xs font-medium uppercase tracking-wider text-slate-500">
                            Prompt
                          </p>

                          <p className="text-sm leading-6 text-slate-300">
                            {truncatePrompt(
                              execution.prompt
                            )}
                          </p>
                        </div>

                        {/* Metadata */}
                        <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-slate-500">
                          <span>
                            Model:{" "}
                            <span className="text-slate-400">
                              {execution.model}
                            </span>
                          </span>

                          <span>
                            Duration:{" "}
                            <span className="text-slate-400">
                              {formatDuration(
                                execution.durationMs
                              )}
                            </span>
                          </span>

                          <span>
                            {formatDate(
                              execution.createdAt
                            )}
                          </span>
                        </div>
                      </div>

                      {/* View Button */}
                      <Link
                        href={`/history/${execution.id}`}
                        className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border border-white/10 px-4 py-2.5 text-sm font-medium text-slate-300 transition hover:border-cyan-500/30 hover:bg-cyan-500/10 hover:text-cyan-300"
                      >
                        View Details
                        <ChevronRight size={16} />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
        </main>
      </div>
    </div>
  );
}