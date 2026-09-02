"use client";

import {
  Bot,
  Brain,
  Bug,
  Code2,
  FileText,
  Palette,
  Play,
  Sparkles,
  TestTube2,
} from "lucide-react";

export type AgentStatus = "Active" | "Idle" | "Busy";

export type AgentType =
  | "architect"
  | "developer"
  | "uiux"
  | "debugger"
  | "testing"
  | "documentation";

interface AgentCardProps {
  name: string;
  description: string;
  type: AgentType;
  status: AgentStatus;
  tasksCompleted: number;
  onOpen: () => void;
}

const agentConfig = {
  architect: {
    icon: Brain,
    label: "Architecture",
    iconClass: "text-cyan-400",
    bgClass: "bg-cyan-500/10",
  },

  developer: {
    icon: Code2,
    label: "Development",
    iconClass: "text-violet-400",
    bgClass: "bg-violet-500/10",
  },

  uiux: {
    icon: Palette,
    label: "UI / UX",
    iconClass: "text-pink-400",
    bgClass: "bg-pink-500/10",
  },

  debugger: {
    icon: Bug,
    label: "Debugging",
    iconClass: "text-red-400",
    bgClass: "bg-red-500/10",
  },

  testing: {
    icon: TestTube2,
    label: "Testing",
    iconClass: "text-emerald-400",
    bgClass: "bg-emerald-500/10",
  },

  documentation: {
    icon: FileText,
    label: "Documentation",
    iconClass: "text-yellow-400",
    bgClass: "bg-yellow-500/10",
  },
};

const statusConfig = {
  Active: {
    dot: "bg-emerald-400",
    text: "text-emerald-400",
    background: "bg-emerald-500/10",
  },

  Busy: {
    dot: "bg-cyan-400",
    text: "text-cyan-400",
    background: "bg-cyan-500/10",
  },

  Idle: {
    dot: "bg-slate-400",
    text: "text-slate-400",
    background: "bg-slate-500/10",
  },
};

export default function AgentCard({
  name,
  description,
  type,
  status,
  tasksCompleted,
  onOpen,
}: AgentCardProps) {
  const config = agentConfig[type];
  const Icon = config.icon;
  const currentStatus = statusConfig[status];

  return (
    <div
      className="
        group
        relative
        flex
        h-[420px]
        w-full
        flex-col
        overflow-hidden
        rounded-3xl
        border
        border-white/10
        bg-[#111827]
        p-6
        transition-all
        duration-300
        hover:-translate-y-1
        hover:border-cyan-500/30
        hover:shadow-xl
        hover:shadow-cyan-500/5
      "
    >
      {/* Decorative Glow */}
      <div
        className="
          pointer-events-none
          absolute
          -right-16
          -top-16
          h-32
          w-32
          rounded-full
          bg-cyan-500/5
          blur-3xl
          transition
          duration-300
          group-hover:bg-cyan-500/10
        "
      />

      {/* Header */}
      <div className="relative flex items-start justify-between">
        {/* Agent Icon */}
        <div
          className={`
            flex
            h-14
            w-14
            shrink-0
            items-center
            justify-center
            rounded-2xl
            ${config.bgClass}
          `}
        >
          <Icon
            size={27}
            strokeWidth={2}
            className={config.iconClass}
          />
        </div>

        {/* Status */}
        <div
          className={`
            flex
            items-center
            gap-2
            rounded-full
            px-3
            py-1.5
            text-xs
            font-medium
            ${currentStatus.background}
            ${currentStatus.text}
          `}
        >
          <span
            className={`
              h-2
              w-2
              rounded-full
              ${currentStatus.dot}
              ${status === "Active" ? "animate-pulse" : ""}
            `}
          />

          {status}
        </div>
      </div>

      {/* Agent Information */}
      <div className="relative mt-5">
        <div className="flex items-center gap-2">
          <h3 className="text-xl font-bold leading-tight text-white">
            {name}
          </h3>

          <Sparkles
            size={15}
            className="
              text-cyan-400
              opacity-0
              transition
              duration-200
              group-hover:opacity-100
            "
          />
        </div>

        <p className="mt-2 text-sm leading-6 text-slate-400">
          {description}
        </p>
      </div>

      {/* Agent Type */}
      <div className="relative mt-4">
        <span
          className="
            inline-flex
            items-center
            rounded-full
            border
            border-white/10
            bg-white/5
            px-3
            py-1.5
            text-xs
            font-medium
            text-slate-300
          "
        >
          <Bot
            size={13}
            className="mr-2 text-cyan-400"
          />

          {config.label}
        </span>
      </div>

      {/* Statistics */}
      <div
        className="
          relative
          mt-auto
          flex
          items-center
          justify-between
          border-t
          border-white/10
          pt-5
        "
      >
        {/* Tasks */}
        <div>
          <p className="text-xs text-slate-500">
            Tasks Completed
          </p>

          <p className="mt-1 text-lg font-semibold text-white">
            {tasksCompleted}
          </p>
        </div>

        {/* Divider */}
        <div className="h-8 w-px bg-white/10" />

        {/* Agent Type */}
        <div className="text-right">
          <p className="text-xs text-slate-500">
            Agent Type
          </p>

          <p className="mt-1 text-sm font-medium text-slate-300">
            AI Powered
          </p>
        </div>
      </div>

      {/* Open Agent Button */}
      <button
        type="button"
        onClick={onOpen}
        className="
          relative
          mt-5
          flex
          w-full
          shrink-0
          items-center
          justify-center
          gap-2
          rounded-xl
          bg-cyan-500
          px-5
          py-3
          font-semibold
          text-black
          transition-all
          duration-200
          hover:bg-cyan-400
          active:scale-[0.98]
        "
      >
        <Play size={17} />

        Open Agent
      </button>
    </div>
  );
}