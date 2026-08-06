"use client";

import {
  Bot,
  Cpu,
  CheckCircle2,
  LoaderCircle,
  PauseCircle,
} from "lucide-react";

const agents = [
  {
    name: "Athena",
    task: "Authentication Module",
    status: "Running",
    progress: 92,
  },
  {
    name: "Nova",
    task: "UI Components",
    status: "Building",
    progress: 71,
  },
  {
    name: "CodeGen",
    task: "API Generation",
    status: "Review",
    progress: 58,
  },
  {
    name: "DeployBot",
    task: "Production Deploy",
    status: "Idle",
    progress: 100,
  },
];

const statusBadge = {
  Running: "bg-emerald-500/15 text-emerald-400",
  Building: "bg-purple-500/15 text-purple-400",
  Review: "bg-yellow-500/15 text-yellow-400",
  Idle: "bg-slate-500/15 text-slate-400",
};

const statusIcon = {
  Running: CheckCircle2,
  Building: LoaderCircle,
  Review: Cpu,
  Idle: PauseCircle,
};

export default function AgentStatus() {
  return (
    <section
      className="
      rounded-3xl
      border
      border-white/10
      bg-[#111827]
      p-6
    "
    >
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-bold text-white">
          AI Agents
        </h2>

        <span className="text-sm text-slate-500">
          Live Status
        </span>
      </div>

      <div className="space-y-5">
        {agents.map((agent) => {
          const Icon =
            statusIcon[
              agent.status as keyof typeof statusIcon
            ];

          return (
            <div
              key={agent.name}
              className="
                rounded-2xl
                border
                border-white/10
                bg-[#0F172A]
                p-4
              "
            >
              <div className="flex items-center justify-between">

                <div className="flex items-center gap-4">

                  <div
                    className="
                      flex
                      h-12
                      w-12
                      items-center
                      justify-center
                      rounded-xl
                      bg-cyan-500/10
                      text-cyan-400
                    "
                  >
                    <Bot size={22} />
                  </div>

                  <div>

                    <h3 className="font-semibold text-white">
                      {agent.name}
                    </h3>

                    <p className="text-sm text-slate-400">
                      {agent.task}
                    </p>

                  </div>

                </div>

                <span
                  className={`flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${
                    statusBadge[
                      agent.status as keyof typeof statusBadge
                    ]
                  }`}
                >
                  <Icon
                    size={14}
                    className={
                      agent.status === "Building"
                        ? "animate-spin"
                        : ""
                    }
                  />

                  {agent.status}
                </span>

              </div>

              <div className="mt-4">

                <div className="mb-2 flex justify-between text-sm">
                  <span className="text-slate-400">
                    Progress
                  </span>

                  <span className="text-cyan-400">
                    {agent.progress}%
                  </span>
                </div>

                <div className="h-2 overflow-hidden rounded-full bg-white/10">
                  <div
                    style={{
                      width: `${agent.progress}%`,
                    }}
                    className="
                      h-full
                      rounded-full
                      bg-linear-to-r
                      from-cyan-400
                      via-blue-500
                      to-purple-500
                    "
                  />
                </div>

              </div>

            </div>
          );
        })}
      </div>
    </section>
  );
}