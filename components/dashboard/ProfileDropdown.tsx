"use client";

import Link from "next/link";
import {
  User,
  Settings,
  Moon,
  FileText,
  LogOut,
} from "lucide-react";

interface Props {
  isOpen: boolean;
}

export default function ProfileDropdown({ isOpen }: Props) {
  if (!isOpen) return null;

  return (
    <div
      className="
        absolute
        right-0
        top-16
        w-64
        rounded-2xl
        border
        border-white/10
        bg-[#111827]
        p-2
        shadow-2xl
        shadow-black/40
        animate-in
        fade-in
        zoom-in-95
        duration-200
      "
    >
      <div className="border-b border-white/10 p-3">
        <h3 className="font-semibold text-white">
          Harshit
        </h3>

        <p className="text-sm text-slate-400">
          Administrator
        </p>
      </div>

      <div className="mt-2 space-y-1">

        <Link
          href="/profile"
          className="flex items-center gap-3 rounded-xl px-3 py-3 text-slate-300 transition hover:bg-cyan-500/10 hover:text-cyan-400"
        >
          <User size={18} />
          My Profile
        </Link>

        <Link
          href="/settings"
          className="flex items-center gap-3 rounded-xl px-3 py-3 text-slate-300 transition hover:bg-cyan-500/10 hover:text-cyan-400"
        >
          <Settings size={18} />
          Account Settings
        </Link>

        <button
          className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-slate-300 transition hover:bg-cyan-500/10 hover:text-cyan-400"
        >
          <Moon size={18} />
          Appearance
        </button>

        <Link
          href="/docs"
          className="flex items-center gap-3 rounded-xl px-3 py-3 text-slate-300 transition hover:bg-cyan-500/10 hover:text-cyan-400"
        >
          <FileText size={18} />
          Documentation
        </Link>

        <button
          className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-red-400 transition hover:bg-red-500/10"
        >
          <LogOut size={18} />
          Logout
        </button>

      </div>
    </div>
  );
}