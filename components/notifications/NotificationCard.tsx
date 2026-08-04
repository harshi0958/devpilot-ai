"use client";

import { Bell, Trash2, CheckCircle, Clock } from "lucide-react";

interface NotificationCardProps {
  title: string;
  description: string;
  time: string;
  isRead: boolean;
  onDelete?: () => void;
  onMarkRead?: () => void;
}

export default function NotificationCard({
  title,
  description,
  time,
  isRead,
  onDelete,
  onMarkRead,
}: NotificationCardProps) {
  return (
    <div
      className="
        rounded-2xl
        border
        border-white/10
        bg-[#111827]
        p-5
        transition-all
        duration-300
        hover:border-cyan-500/40
        hover:bg-[#131d2d]
      "
    >
      <div className="flex items-start justify-between">

        {/* Left */}
        <div className="flex gap-4">

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
            <Bell size={22} />
          </div>

          <div>

            <h3 className="font-semibold text-white">
              {title}
            </h3>

            <p className="mt-1 text-sm text-slate-400">
              {description}
            </p>

            <div className="mt-3 flex items-center gap-3">

              <span className="flex items-center gap-1 text-xs text-slate-500">
                <Clock size={14} />
                {time}
              </span>

              {isRead ? (
                <span className="rounded-full bg-green-500/10 px-3 py-1 text-xs font-medium text-green-400">
                  Read
                </span>
              ) : (
                <span className="rounded-full bg-cyan-500/10 px-3 py-1 text-xs font-medium text-cyan-400">
                  Unread
                </span>
              )}

            </div>

          </div>

        </div>

        {/* Right */}
        <div className="flex items-center gap-2">

          {!isRead && (
            <button
              onClick={onMarkRead}
              className="
                rounded-lg
                p-2
                text-cyan-400
                transition
                hover:bg-cyan-500/10
              "
              title="Mark as Read"
            >
              <CheckCircle size={18} />
            </button>
          )}

          <button
            onClick={onDelete}
            className="
              rounded-lg
              p-2
              text-red-400
              transition
              hover:bg-red-500/10
            "
            title="Delete"
          >
            <Trash2 size={18} />
          </button>

        </div>

      </div>
    </div>
  );
}