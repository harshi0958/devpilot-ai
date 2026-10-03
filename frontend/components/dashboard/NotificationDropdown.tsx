"use client";

import Link from "next/link";
import { Bell, CheckCheck } from "lucide-react";

interface Notification {
  title: string;
  time: string;
}

interface Props {
  isOpen: boolean;
  notifications: Notification[];
  onMarkAll: () => void;
}

export default function NotificationDropdown({
  isOpen,
  notifications,
  onMarkAll,
}: Props) {
  if (!isOpen) return null;

  return (
    <div
      className="
        absolute
        right-0
        top-16
        w-96
        rounded-2xl
        border
        border-white/10
        bg-[#111827]
        p-2
        shadow-2xl
        shadow-black/40
      "
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/10 p-3">

        <div className="flex items-center gap-2">
          <Bell size={18} className="text-cyan-400" />

          <h3 className="font-semibold text-white">
            Notifications
          </h3>
        </div>

        {notifications.length > 0 && (
          <button
            onClick={onMarkAll}
            className="flex items-center gap-1 text-xs text-cyan-400 transition hover:text-cyan-300"
          >
            <CheckCheck size={14} />
            Mark all
          </button>
        )}

      </div>

      {/* Notification List */}
      {/* Notification List */}
<div className="max-h-80 overflow-y-auto">
  {notifications.length > 0 ? (
    notifications.map((item, index) => (
      <Link
        key={`${item.title}-${item.time}-${index}`}
        href="/notifications"
        className="
          block
          border-b
          border-white/5
          p-4
          transition
          hover:bg-cyan-500/5
        "
      >
        <p className="text-sm font-medium text-white">
          {item.title}
        </p>

        <p className="mt-1 text-xs text-slate-400">
          {item.time}
        </p>
      </Link>
    ))
  ) : (
    <div className="py-10 text-center">
      <Bell
        size={32}
        className="mx-auto mb-3 text-slate-500"
      />

      <h3 className="font-medium text-white">
        No Notifications
      </h3>

      <p className="mt-2 text-sm text-slate-400">
        You're all caught up 🎉
      </p>
    </div>
  )}
</div>

      {/* Footer */}

      <Link
        href="/notifications"
        className="
          mt-2
          block
          rounded-xl
          p-3
          text-center
          text-sm
          font-medium
          text-cyan-400
          transition
          hover:bg-cyan-500/10
        "
      >
        View All Notifications
      </Link>

    </div>
  );
}