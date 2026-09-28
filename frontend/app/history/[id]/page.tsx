"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  Bot,
  CheckCircle2,
  Clock3,
  FolderKanban,
  Loader2,
  XCircle,
  Cpu,
  Timer,
  CalendarDays,
} from "lucide-react";

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
    description?: string | null;
  } | null;

  project?: {
    id: string;
    name: string;
    slug: string;
    description?: string | null;
  } | null;
};

export default function ExecutionDetailsPage() {
  const params = useParams();
  const executionId = params?.id as string;

  const [execution, setExecution] = useState<Execution | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!executionId) return;

    const fetchExecution = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `http://localhost:5000/api/executions/${executionId}`,
          {
            method: "GET",
            credentials: "include",
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data?.message || "Failed to fetch execution"
          );
        }

        setExecution(data?.data || null);
      } catch (err) {
        console.error("Execution details error:", err);

        setError(
          err instanceof Error
            ? err.message
            : "Failed to load execution details"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchExecution();
  }, [executionId]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return (
          <CheckCircle2
            size={20}
            className="text-emerald-400"
          />
        );

      case "FAILED":
        return (
          <XCircle
            size={20}
            className="text-red-400"
          />
        );

      case "RUNNING":
        return (
          <Loader2
            size={20}
            className="animate-spin text-yellow-400"
          />
        );

      default:
        return (
          <Clock3
            size={20}
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

  const formatDate = (date?: string | null) => {
    if (!date) return "—";

    return new Date(date).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDuration = (durationMs?: number | null) => {
    if (!durationMs) return "—";

    if (durationMs < 1000) {
      return `${durationMs}ms`;
    }

    return `${(durationMs / 1000).toFixed(1)}s`;
  };

  return (
    <div className="min-h-screen bg-[#070B14] px-6 py-8 text-white">
      <div className="mx-auto max-w-6xl">
        {/* Back */}
        <Link
          href="/history"
          className="mb-6 inline-flex items-center gap-2 text-sm text-slate-400 transition hover:text-cyan-400"
        >
          <ArrowLeft size={17} />
          Back to History
        </Link>

        {/* Loading */}
        {loading && (
          <div className="flex min-h-125 items-center justify-center">
            <div className="flex items-center gap-3 text-slate-400">
              <Loader2
                size={24}
                className="animate-spin text-cyan-400"
              />
              Loading execution details...
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
                  Failed to load execution
                </h2>

                <p className="mt-1 text-sm text-red-400">
                  {error}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Details */}
        {!loading && !error && execution && (
          <>
            {/* Header */}
            <div className="mb-8">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-cyan-500/20 bg-cyan-500/10">
                      <Bot
                        size={24}
                        className="text-cyan-400"
                      />
                    </div>

                    <div>
                      <h1 className="text-3xl font-bold">
                        Execution Details
                      </h1>

                      <p className="mt-1 text-sm text-slate-400">
                        {execution.agent?.name ||
                          "AI Agent"}
                      </p>
                    </div>
                  </div>
                </div>

                <span
                  className={`inline-flex w-fit items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium ${getStatusClass(
                    execution.status
                  )}`}
                >
                  {getStatusIcon(execution.status)}
                  {execution.status}
                </span>
              </div>
            </div>

            {/* Metadata */}
            <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-2xl border border-white/10 bg-white/3 p-5">
                <div className="flex items-center gap-2 text-sm text-slate-400">
                  <Bot size={16} />
                  Agent
                </div>

                <p className="mt-3 font-semibold text-white">
                  {execution.agent?.name || "AI Agent"}
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/3 p-5">
                <div className="flex items-center gap-2 text-sm text-slate-400">
                  <FolderKanban size={16} />
                  Project
                </div>

                <p className="mt-3 font-semibold text-white">
                  {execution.project?.name || "No Project"}
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/3 p-5">
                <div className="flex items-center gap-2 text-sm text-slate-400">
                  <Cpu size={16} />
                  Model
                </div>

                <p className="mt-3 font-semibold text-white">
                  {execution.model}
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/3 p-5">
                <div className="flex items-center gap-2 text-sm text-slate-400">
                  <Timer size={16} />
                  Duration
                </div>

                <p className="mt-3 font-semibold text-white">
                  {formatDuration(execution.durationMs)}
                </p>
              </div>
            </div>

            {/* Dates */}
            <div className="mb-6 rounded-2xl border border-white/10 bg-white/3 p-5">
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <div>
                  <div className="flex items-center gap-2 text-sm text-slate-400">
                    <CalendarDays size={16} />
                    Started
                  </div>

                  <p className="mt-2 text-sm text-slate-200">
                    {formatDate(execution.createdAt)}
                  </p>
                </div>

                <div>
                  <div className="flex items-center gap-2 text-sm text-slate-400">
                    <CheckCircle2 size={16} />
                    Completed
                  </div>

                  <p className="mt-2 text-sm text-slate-200">
                    {formatDate(execution.completedAt)}
                  </p>
                </div>
              </div>
            </div>

            {/* Prompt */}
            <section className="mb-6">
              <div className="mb-3 flex items-center gap-2">
                <h2 className="text-xl font-semibold">
                  User Prompt
                </h2>
              </div>

              <div className="rounded-2xl border border-white/10 bg-[#0B1220] p-6">
                <p className="whitespace-pre-wrap text-sm leading-7 text-slate-300">
                  {execution.prompt}
                </p>
              </div>
            </section>

            {/* Response */}
            <section>
              <div className="mb-3 flex items-center gap-2">
                <h2 className="text-xl font-semibold">
                  AI Response
                </h2>
              </div>

              <div className="rounded-2xl border border-cyan-500/10 bg-[#0B1220] p-6">
                {execution.response ? (
                  <pre className="whitespace-pre-wrap wrap-break-word font-sans text-sm leading-7 text-slate-300">
                    {execution.response}
                  </pre>
                ) : (
                  <p className="text-sm text-slate-500">
                    No AI response was stored for this execution.
                  </p>
                )}
              </div>
            </section>

            {/* Execution ID */}
            <div className="mt-6 rounded-xl border border-white/5 bg-white/2 p-4">
              <p className="text-xs text-slate-500">
                Execution ID
              </p>

              <p className="mt-1 break-all font-mono text-xs text-slate-400">
                {execution.id}
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}