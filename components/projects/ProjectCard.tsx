"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

import {
  ArrowUpRight,
  Bot,
  Clock3,
  FolderKanban,
  MoreVertical,
  Star,
  Users,
} from "lucide-react";

interface ProjectCardProps {
  projectId: string;
  name: string;
  description: string;
  status: "Running" | "Testing" | "Completed" | "Building";
  progress: number;
  updated: string;
  members: number;
  agents: number;
}

export default function ProjectCard({
  projectId,
  name,
  description,
  status,
  progress,
  updated,
  members,
  agents,
}: ProjectCardProps) {
  const [favorite, setFavorite] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
const menuRef = useRef<HTMLDivElement>(null);

useEffect(() => {
  function handleClickOutside(event: MouseEvent) {
    if (
      menuRef.current &&
      !menuRef.current.contains(event.target as Node)
    ) {
      setMenuOpen(false);
    }
  }

  document.addEventListener("mousedown", handleClickOutside);

  return () => {
    document.removeEventListener(
      "mousedown",
      handleClickOutside
    );
  };
}, []);

  const statusColor = {
    Running: "bg-emerald-500/15 text-emerald-400",
    Testing: "bg-yellow-500/15 text-yellow-400",
    Completed: "bg-cyan-500/15 text-cyan-400",
    Building: "bg-purple-500/15 text-purple-400",
  };

  return (
    <div
      className="
        group
        rounded-3xl
        border
        border-white/10
        bg-[#111827]
        p-6
        transition-all
        duration-300
        hover:-translate-y-1
        hover:border-cyan-500/40
        hover:shadow-xl
        hover:shadow-cyan-500/10
      "
    >
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex gap-4">
          <div
            className="
              flex
              h-14
              w-14
              items-center
              justify-center
              rounded-2xl
              bg-cyan-500/10
              text-cyan-400
            "
          >
            <FolderKanban size={26} />
          </div>

          <div>
            <h3 className="text-xl font-bold text-white">
              {name}
            </h3>

            <p className="mt-1 text-sm text-slate-400">
              {description}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {/* Favorite */}
          <button
            onClick={() => setFavorite(!favorite)}
            className="
              rounded-lg
              p-2
              transition-all
              hover:bg-white/5
              hover:scale-110
            "
          >
            <Star
              size={18}
              className={`transition-all ${
                favorite
                  ? "fill-yellow-400 text-yellow-400"
                  : "text-slate-500 hover:text-yellow-400"
              }`}
            />
          </button>

          {/* Menu */}
          <div className="relative" ref={menuRef}>
  <button
    onClick={() => setMenuOpen(!menuOpen)}
    className="
      rounded-lg
      p-2
      text-slate-500
      transition-all
      hover:bg-white/5
      hover:text-white
    "
  >
    <MoreVertical size={18} />
  </button>

  {menuOpen && (
    <div
      className="
        absolute
        right-0
        top-11
        z-50
        w-52
        overflow-hidden
        rounded-2xl
        border
        border-white/10
        bg-[#0F172A]
        shadow-2xl
      "
    >
      <Link
        href={`/projects/${projectId}`}
        className="block px-4 py-3 text-sm text-white hover:bg-cyan-500/10"
      >
        📂 Open Project
      </Link>

      <button
        onClick={() => {
          alert("Edit Project - Coming Soon");
          setMenuOpen(false);
        }}
        className="block w-full px-4 py-3 text-left text-sm text-white hover:bg-white/5"
      >
        ✏️ Edit Project
      </button>

      <button
        onClick={() => {
          alert("Duplicate - Coming Soon");
          setMenuOpen(false);
        }}
        className="block w-full px-4 py-3 text-left text-sm text-white hover:bg-white/5"
      >
        📄 Duplicate
      </button>

      <button
        onClick={() => {
          alert("Archive - Coming Soon");
          setMenuOpen(false);
        }}
        className="block w-full px-4 py-3 text-left text-sm text-white hover:bg-white/5"
      >
        📦 Archive
      </button>

      <button
        onClick={() => {
          const ok = confirm(
            "Are you sure you want to delete this project?"
          );

          if (ok) {
            alert("Delete API coming soon");
          }

          setMenuOpen(false);
        }}
        className="block w-full px-4 py-3 text-left text-sm text-red-400 hover:bg-red-500/10"
      >
        🗑 Delete
      </button>
    </div>
  )}
</div>
        </div>
      </div>

      {/* Status */}
      <div className="mt-6 flex items-center justify-between">
        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold ${statusColor[status]}`}
        >
          {status}
        </span>

        <span className="text-sm font-semibold text-cyan-400">
          {progress}%
        </span>
      </div>

      {/* Progress */}
      <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/10">
        <div
          style={{ width: `${progress}%` }}
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

      {/* Stats */}
      <div className="mt-6 grid grid-cols-3 gap-4">
        <div className="flex items-center gap-2 text-slate-400">
          <Users size={16} />
          <span className="text-sm">{members} Members</span>
        </div>

        <div className="flex items-center gap-2 text-slate-400">
          <Bot size={16} />
          <span className="text-sm">{agents} AI Agents</span>
        </div>

        <div className="flex items-center gap-2 text-slate-400">
          <Clock3 size={16} />
          <span className="text-sm">{updated}</span>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-8 flex items-center justify-between border-t border-white/10 pt-5">
        <p className="text-xs text-slate-500">
          AI Workspace Project
        </p>

        <Link
          href={`/projects/${projectId}`}
          className="flex items-center gap-2 font-medium text-cyan-400 transition hover:text-cyan-300"
        >
          Open Project

          <ArrowUpRight
            size={18}
            className="transition group-hover:translate-x-1 group-hover:-translate-y-1"
          />
        </Link>
      </div>
    </div>
  );
}