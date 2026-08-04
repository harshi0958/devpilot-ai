"use client";

import { Bell } from "lucide-react";

export default function NotificationHeader() {
  return (
    <div className="mb-8 flex items-center justify-between">

      <div>

        <h1 className="text-4xl font-bold text-white">
          Notifications
        </h1>

        <p className="mt-2 text-slate-400">
          Stay updated with your AI workspace activities.
        </p>

      </div>

      <div className="rounded-xl border border-cyan-500/20 bg-cyan-500/10 px-4 py-2 text-sm text-cyan-400">

        <div className="flex items-center gap-2">

          <Bell size={16} />

          Notification Center

        </div>

      </div>

    </div>
  );
}