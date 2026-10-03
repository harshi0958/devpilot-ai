"use client";

import { useEffect, useState } from "react";
import {
  Activity,
  Bot,
  Database,
  FolderKanban,
  Loader2,
  CheckCircle2,
  XCircle,
} from "lucide-react";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

type HealthState = "checking" | "healthy" | "error";

type HealthCard = {
  title: string;
  description: string;
  status: HealthState;
  icon: React.ReactNode;
};

export default function WorkspaceHealth() {
  const [backendStatus, setBackendStatus] =
    useState<HealthState>("checking");

  const [agentStatus, setAgentStatus] =
    useState<HealthState>("checking");

  const [executionStatus, setExecutionStatus] =
    useState<HealthState>("checking");

  const [projectStatus, setProjectStatus] =
    useState<HealthState>("checking");

  useEffect(() => {
    let cancelled = false;

    const checkWorkspaceHealth = async () => {
      const checks = await Promise.allSettled([
        // Backend API
        fetch(`${API_URL}/health`),

        // AI Agents
        fetch(`${API_URL}/api/agents`, {
          credentials: "include",
        }),

        // Execution API
        fetch(`${API_URL}/api/executions`, {
          credentials: "include",
        }),

        // Project API
        fetch(`${API_URL}/api/projects`, {
          credentials: "include",
        }),
      ]);

      if (cancelled) return;

      // -----------------------------
      // Backend
      // -----------------------------
      const backendResult = checks[0];

      if (
        backendResult.status === "fulfilled" &&
        backendResult.value.ok
      ) {
        setBackendStatus("healthy");
      } else {
        setBackendStatus("error");
      }

      // -----------------------------
      // AI Agents
      // -----------------------------
      const agentResult = checks[1];

      if (
        agentResult.status === "fulfilled" &&
        agentResult.value.ok
      ) {
        try {
          const data = await agentResult.value.json();

          setAgentStatus(
            data?.success &&
              Array.isArray(data?.agents)
              ? "healthy"
              : "error"
          );
        } catch {
          setAgentStatus("error");
        }
      } else {
        setAgentStatus("error");
      }

      // -----------------------------
      // Execution API
      // -----------------------------
      const executionResult = checks[2];

      if (
        executionResult.status === "fulfilled" &&
        executionResult.value.ok
      ) {
        try {
          const data =
            await executionResult.value.json();

          setExecutionStatus(
            data?.success &&
              Array.isArray(data?.data)
              ? "healthy"
              : "error"
          );
        } catch {
          setExecutionStatus("error");
        }
      } else {
        setExecutionStatus("error");
      }

      // -----------------------------
      // Project API
      // -----------------------------
      const projectResult = checks[3];

      if (
        projectResult.status === "fulfilled" &&
        projectResult.value.ok
      ) {
        try {
          const data =
            await projectResult.value.json();

          setProjectStatus(
            data?.success &&
              Array.isArray(data?.projects)
              ? "healthy"
              : "error"
          );
        } catch {
          setProjectStatus("error");
        }
      } else {
        setProjectStatus("error");
      }
    };

    checkWorkspaceHealth();

    return () => {
      cancelled = true;
    };
  }, []);

  const getStatusText = (status: HealthState) => {
    switch (status) {
      case "healthy":
        return "Connected";

      case "error":
        return "Unavailable";

      default:
        return "Checking...";
    }
  };

  const getStatusIcon = (status: HealthState) => {
    switch (status) {
      case "healthy":
        return (
          <CheckCircle2
            size={18}
            className="text-emerald-400"
          />
        );

      case "error":
        return (
          <XCircle
            size={18}
            className="text-red-400"
          />
        );

      default:
        return (
          <Loader2
            size={18}
            className="animate-spin text-yellow-400"
          />
        );
    }
  };

  const getStatusClass = (status: HealthState) => {
    switch (status) {
      case "healthy":
        return "text-emerald-400";

      case "error":
        return "text-red-400";

      default:
        return "text-yellow-400";
    }
  };

  const healthCards: HealthCard[] = [
    {
      title: "Backend API",
      description:
        "Express backend and API services",
      status: backendStatus,
      icon: <Activity size={21} />,
    },
    {
      title: "AI Agents",
      description:
        "Registered DevPilot AI agents",
      status: agentStatus,
      icon: <Bot size={21} />,
    },
    {
      title: "Execution API",
      description:
        "AI execution history and services",
      status: executionStatus,
      icon: <Database size={21} />,
    },
    {
      title: "Project Workspace",
      description:
        "Project management API",
      status: projectStatus,
      icon: <FolderKanban size={21} />,
    },
  ];

  return (
    <section className="mt-12">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-white">
          Workspace Health
        </h2>

        <p className="mt-2 text-slate-400">
          Monitor the status of your DevPilot workspace services.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {healthCards.map((card) => (
          <div
            key={card.title}
            className="
              group
              rounded-2xl
              border
              border-white/10
              bg-[#101827]
              p-6
              transition-all
              duration-300
              hover:-translate-y-1
              hover:border-cyan-500/30
              hover:bg-[#111D30]
            "
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-4">
                <div
                  className={`
                    flex
                    h-11
                    w-11
                    items-center
                    justify-center
                    rounded-xl
                    ${
                      card.status === "healthy"
                        ? "bg-emerald-500/10 text-emerald-400"
                        : card.status === "error"
                          ? "bg-red-500/10 text-red-400"
                          : "bg-yellow-500/10 text-yellow-400"
                    }
                  `}
                >
                  {card.icon}
                </div>

                <div>
                  <h3 className="font-semibold text-white">
                    {card.title}
                  </h3>

                  <p className="mt-1 text-sm text-slate-500">
                    {card.description}
                  </p>
                </div>
              </div>

              <div className="flex shrink-0 items-center gap-2">
                {getStatusIcon(card.status)}

                <span
                  className={`text-sm font-medium ${getStatusClass(
                    card.status
                  )}`}
                >
                  {getStatusText(card.status)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}