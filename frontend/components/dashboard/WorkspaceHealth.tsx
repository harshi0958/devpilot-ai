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

type HealthState = "checking" | "healthy" | "error";

type HealthCard = {
  title: string;
  description: string;
  status: string;
  healthy: boolean;
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
    const checkWorkspaceHealth = async () => {
      // Backend API
      try {
        const response = await fetch(
          "http://localhost:5000/health"
        );

        if (response.ok) {
          setBackendStatus("healthy");
        } else {
          setBackendStatus("error");
        }
      } catch {
        setBackendStatus("error");
      }

      // AI Agents
      try {
        const response = await fetch(
          "http://localhost:5000/api/agents",
          {
            credentials: "include",
          }
        );

        const data = await response.json();

        if (
          response.ok &&
          data?.success &&
          Array.isArray(data?.agents) &&
          data.agents.length > 0
        ) {
          setAgentStatus("healthy");
        } else {
          setAgentStatus("error");
        }
      } catch {
        setAgentStatus("error");
      }

      // AI Execution storage
      try {
        const response = await fetch(
          "http://localhost:5000/api/executions",
          {
            credentials: "include",
          }
        );

        const data = await response.json();

        if (
          response.ok &&
          data?.success &&
          Array.isArray(data?.data)
        ) {
          setExecutionStatus("healthy");
        } else {
          setExecutionStatus("error");
        }
      } catch {
        setExecutionStatus("error");
      }

      // Project workspace
      try {
        const response = await fetch(
          "http://localhost:5000/api/projects",
          {
            credentials: "include",
          }
        );

        const data = await response.json();

        if (
          response.ok &&
          data?.success &&
          Array.isArray(data?.projects)
        ) {
          setProjectStatus("healthy");
        } else {
          setProjectStatus("error");
        }
      } catch {
        setProjectStatus("error");
      }
    };

    checkWorkspaceHealth();
  }, []);

  const getStatusText = (status: HealthState) => {
    if (status === "checking") {
      return "Checking...";
    }

    if (status === "healthy") {
      return "Connected";
    }

    return "Unavailable";
  };

  const getStatusIcon = (status: HealthState) => {
    if (status === "checking") {
      return (
        <Loader2
          size={18}
          className="animate-spin text-yellow-400"
        />
      );
    }

    if (status === "healthy") {
      return (
        <CheckCircle2
          size={18}
          className="text-emerald-400"
        />
      );
    }

    return (
      <XCircle
        size={18}
        className="text-red-400"
      />
    );
  };

  const getStatusClass = (status: HealthState) => {
    if (status === "healthy") {
      return "text-emerald-400";
    }

    if (status === "error") {
      return "text-red-400";
    }

    return "text-yellow-400";
  };

  const healthCards: HealthCard[] = [
    {
      title: "Backend API",
      description:
        "Express backend and API services",
      status: getStatusText(backendStatus),
      healthy: backendStatus === "healthy",
      icon: <Activity size={21} />,
    },
    {
      title: "AI Agents",
      description:
        "Registered DevPilot AI agents",
      status: getStatusText(agentStatus),
      healthy: agentStatus === "healthy",
      icon: <Bot size={21} />,
    },
    {
      title: "AI Execution Storage",
      description:
        "AI execution history persistence",
      status: getStatusText(executionStatus),
      healthy: executionStatus === "healthy",
      icon: <Database size={21} />,
    },
    {
      title: "Project Workspace",
      description:
        "Project management API",
      status: getStatusText(projectStatus),
      healthy: projectStatus === "healthy",
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
            className="rounded-2xl border border-white/10 bg-[#101827] p-6 transition hover:border-cyan-500/20"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-4">
                <div
                  className={`flex h-11 w-11 items-center justify-center rounded-xl ${
                    card.healthy
                      ? "bg-emerald-500/10 text-emerald-400"
                      : "bg-white/5 text-slate-400"
                  }`}
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

              <div className="flex items-center gap-2">
                {getStatusIcon(
                  card.title === "Backend API"
                    ? backendStatus
                    : card.title === "AI Agents"
                      ? agentStatus
                      : card.title ===
                          "AI Execution Storage"
                        ? executionStatus
                        : projectStatus
                )}

                <span
                  className={`text-sm font-medium ${getStatusClass(
                    card.title === "Backend API"
                      ? backendStatus
                      : card.title === "AI Agents"
                        ? agentStatus
                        : card.title ===
                            "AI Execution Storage"
                          ? executionStatus
                          : projectStatus
                  )}`}
                >
                  {card.status}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}