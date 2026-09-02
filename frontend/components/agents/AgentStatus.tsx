"use client";

import {
  Activity,
  Circle,
  Loader2,
  PauseCircle,
} from "lucide-react";

import type { AgentStatus as AgentStatusType } from "./AgentCard";

interface AgentStatusProps {
  status: AgentStatusType;
  showLabel?: boolean;
  size?: "sm" | "md";
}

const statusConfig = {
  Active: {
    label: "Active",
    description: "Ready to receive tasks",
    icon: Activity,
    textClass: "text-emerald-400",
    bgClass: "bg-emerald-500/10",
    borderClass: "border-emerald-500/20",
    dotClass: "bg-emerald-400",
  },

  Busy: {
    label: "Busy",
    description: "Currently processing a task",
    icon: Loader2,
    textClass: "text-cyan-400",
    bgClass: "bg-cyan-500/10",
    borderClass: "border-cyan-500/20",
    dotClass: "bg-cyan-400",
  },

  Idle: {
    label: "Idle",
    description: "Waiting for a task",
    icon: PauseCircle,
    textClass: "text-slate-400",
    bgClass: "bg-slate-500/10",
    borderClass: "border-slate-500/20",
    dotClass: "bg-slate-400",
  },
};

export default function AgentStatus({
  status,
  showLabel = true,
  size = "md",
}: AgentStatusProps) {
  const config = statusConfig[status];

  const Icon = config.icon;

  const isSmall = size === "sm";

  return (
    <div
      title={config.description}
      className={`
        inline-flex
        items-center
        gap-2
        rounded-full
        border
        ${config.borderClass}
        ${config.bgClass}
        ${isSmall ? "px-2.5 py-1" : "px-3 py-1.5"}
      `}
    >
      {/* Status Indicator */}

      <span className="relative flex items-center justify-center">

        {/* Animated ring for active/busy */}

        {(status === "Active" ||
          status === "Busy") && (
          <span
            className={`
              absolute
              h-2
              w-2
              rounded-full
              ${config.dotClass}
              animate-ping
              opacity-50
            `}
          />
        )}

        <Circle
          size={isSmall ? 7 : 8}
          fill="currentColor"
          className={`
            relative
            ${config.textClass}
          `}
        />

      </span>

      {/* Icon */}

      {!isSmall && (
        <Icon
          size={14}
          className={`
            ${config.textClass}
            ${status === "Busy" ? "animate-spin" : ""}
          `}
        />
      )}

      {/* Label */}

      {showLabel && (
        <span
          className={`
            text-xs
            font-semibold
            ${config.textClass}
          `}
        >
          {config.label}
        </span>
      )}

    </div>
  );
}