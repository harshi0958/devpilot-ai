"use client";

import {
  Activity,
  Bot,
  CheckCircle2,
  Cpu,
  Zap,
} from "lucide-react";

interface AgentHeaderProps {
  totalAgents: number;
  activeAgents: number;
  busyAgents: number;
  tasksCompleted: number;
}

export default function AgentHeader({
  totalAgents,
  activeAgents,
  busyAgents,
  tasksCompleted,
}: AgentHeaderProps) {
  return (
    <div className="space-y-8">

      {/* Page Heading */}

      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">

        <div>

          <div className="mb-3 flex items-center gap-2">

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/10">
              <Bot
                size={21}
                className="text-cyan-400"
              />
            </div>

            <span className="text-sm font-medium uppercase tracking-wider text-cyan-400">
              DevPilot AI
            </span>

          </div>

          <h1 className="text-4xl font-bold tracking-tight text-white">
            AI Agents
          </h1>

          <p className="mt-2 max-w-2xl text-slate-400">
            Manage and monitor your autonomous AI agents
            throughout the software development lifecycle.
          </p>

        </div>

        {/* System Status */}

        <div className="flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-4 py-2">

          <span className="relative flex h-2.5 w-2.5">

            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />

            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-400" />

          </span>

          <span className="text-sm font-medium text-emerald-400">
            Agent System Online
          </span>

        </div>

      </div>

      {/* Statistics */}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

        {/* Total Agents */}

        <div className="rounded-2xl border border-white/10 bg-[#111827] p-5">

          <div className="flex items-start justify-between">

            <div>

              <p className="text-sm text-slate-400">
                Total Agents
              </p>

              <p className="mt-2 text-3xl font-bold text-white">
                {totalAgents}
              </p>

            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-cyan-500/10">
              <Bot
                size={21}
                className="text-cyan-400"
              />
            </div>

          </div>

          <p className="mt-3 text-xs text-slate-500">
            Available development agents
          </p>

        </div>

        {/* Active Agents */}

        <div className="rounded-2xl border border-white/10 bg-[#111827] p-5">

          <div className="flex items-start justify-between">

            <div>

              <p className="text-sm text-slate-400">
                Active Agents
              </p>

              <p className="mt-2 text-3xl font-bold text-white">
                {activeAgents}
              </p>

            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500/10">
              <Activity
                size={21}
                className="text-emerald-400"
              />
            </div>

          </div>

          <p className="mt-3 flex items-center gap-1 text-xs text-emerald-400">
            <CheckCircle2 size={13} />
            Currently available
          </p>

        </div>

        {/* Busy Agents */}

        <div className="rounded-2xl border border-white/10 bg-[#111827] p-5">

          <div className="flex items-start justify-between">

            <div>

              <p className="text-sm text-slate-400">
                Busy Agents
              </p>

              <p className="mt-2 text-3xl font-bold text-white">
                {busyAgents}
              </p>

            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-500/10">
              <Cpu
                size={21}
                className="text-violet-400"
              />
            </div>

          </div>

          <p className="mt-3 text-xs text-slate-500">
            Currently processing tasks
          </p>

        </div>

        {/* Tasks Completed */}

        <div className="rounded-2xl border border-white/10 bg-[#111827] p-5">

          <div className="flex items-start justify-between">

            <div>

              <p className="text-sm text-slate-400">
                Tasks Completed
              </p>

              <p className="mt-2 text-3xl font-bold text-white">
                {tasksCompleted}
              </p>

            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-yellow-500/10">
              <Zap
                size={21}
                className="text-yellow-400"
              />
            </div>

          </div>

          <p className="mt-3 text-xs text-slate-500">
            Tasks processed by agents
          </p>

        </div>

      </div>

    </div>
  );
}