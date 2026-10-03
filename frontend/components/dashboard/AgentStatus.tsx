"use client";

import { useEffect, useState } from "react";
import {
  Boxes,
  Code2,
  Database,
  ShieldCheck,
  Rocket,
  FileText,
  Loader2,
} from "lucide-react";

import AgentCard from "./AgentCard";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

type BackendAgent = {
  id: string;
  type: string;
  name: string;
  description?: string | null;
  isActive: boolean;
};

type Execution = {
  id: string;
  status: string;
  createdAt: string;
  agent?: {
    id: string;
    name: string;
    type: string;
  } | null;
};

type DashboardAgent = {
  name: string;
  description: string;
  status: string;
  progress: number;
  color: string;
  icon: React.ReactNode;
};

export default function AgentStatus() {
  const [agents, setAgents] = useState<DashboardAgent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const fetchAgents = async () => {
      try {
        setLoading(true);

        const [agentsResponse, executionsResponse] =
          await Promise.all([
            fetch(`${API_URL}/api/agents`, {
              method: "GET",
              credentials: "include",
            }),
            fetch(`${API_URL}/api/executions`, {
              method: "GET",
              credentials: "include",
            }),
          ]);

        const agentsData = await agentsResponse.json();
        const executionsData =
          await executionsResponse.json();

        if (!agentsResponse.ok) {
          throw new Error(
            agentsData?.message ||
              "Failed to fetch agents"
          );
        }

        if (cancelled) return;

        const backendAgents: BackendAgent[] =
          Array.isArray(agentsData?.agents)
            ? agentsData.agents
            : [];

        const executions: Execution[] =
          Array.isArray(executionsData?.data)
            ? executionsData.data
            : [];

        const getLatestExecution = (
          agentId: string
        ) => {
          return executions
            .filter(
              (execution) =>
                execution.agent?.id === agentId
            )
            .sort(
              (a, b) =>
                new Date(b.createdAt).getTime() -
                new Date(a.createdAt).getTime()
            )[0];
        };

        const getIcon = (type: string) => {
          switch (type) {
            case "ARCHITECT":
              return <Boxes size={22} />;

            case "DEVELOPER":
            case "UIUX":
              return <Code2 size={22} />;

            case "DEBUGGER":
              return <Database size={22} />;

            case "TESTING":
              return <ShieldCheck size={22} />;

            case "DOCUMENTATION":
              return <FileText size={22} />;

            default:
              return <Rocket size={22} />;
          }
        };

        const getStatus = (
          agent: BackendAgent,
          latestExecution?: Execution
        ) => {
          if (!agent.isActive) {
            return "Inactive";
          }

          if (!latestExecution) {
            return "Active";
          }

          switch (latestExecution.status) {
            case "RUNNING":
              return "Running";

            case "QUEUED":
              return "Queued";

            case "FAILED":
            case "COMPLETED":
            default:
              return "Active";
          }
        };

        const getColor = (status: string) => {
          switch (status) {
            case "Running":
              return "bg-cyan-500/10 text-cyan-400";

            case "Queued":
              return "bg-yellow-500/10 text-yellow-400";

            case "Inactive":
              return "bg-slate-500/10 text-slate-400";

            default:
              return "bg-emerald-500/10 text-emerald-400";
          }
        };

        const getProgress = (status: string) => {
          switch (status) {
            case "Running":
              return 50;

            case "Queued":
              return 25;

            case "Inactive":
              return 0;

            default:
              return 100;
          }
        };

        const dashboardAgents: DashboardAgent[] =
          backendAgents.map((agent) => {
            const latestExecution =
              getLatestExecution(agent.id);

            const status = getStatus(
              agent,
              latestExecution
            );

            return {
              name: agent.name,
              description:
                agent.description ||
                "AI software engineering agent",
              status,
              progress: getProgress(status),
              color: getColor(status),
              icon: getIcon(agent.type),
            };
          });

        setAgents(dashboardAgents);
      } catch (error) {
        if (!cancelled) {
          console.error(
            "Failed to load agent status:",
            error
          );

          setAgents([]);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchAgents();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section className="mt-12">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">
            AI Agents
          </h2>

          <p className="mt-1 text-slate-400">
            Monitor your autonomous engineering team in
            real-time.
          </p>
        </div>
      </div>

      {loading && (
        <div className="flex min-h-45 items-center justify-center rounded-2xl border border-white/10 bg-[#0B1220]">
          <div className="flex items-center gap-3 text-slate-400">
            <Loader2
              size={20}
              className="animate-spin text-cyan-400"
            />

            Loading AI agents...
          </div>
        </div>
      )}

      {!loading && agents.length === 0 && (
        <div className="flex min-h-45 items-center justify-center rounded-2xl border border-white/10 bg-[#0B1220]">
          <p className="text-sm text-slate-500">
            No AI agents available.
          </p>
        </div>
      )}

      {!loading && agents.length > 0 && (
        <div className="grid gap-6 lg:grid-cols-2">
          {agents.map((agent) => (
            <AgentCard
              key={agent.name}
              {...agent}
            />
          ))}
        </div>
      )}
    </section>
  );
}