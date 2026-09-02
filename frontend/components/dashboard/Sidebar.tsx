"use client";

import Link from "next/link";
import {
  LayoutDashboard,
  FolderKanban,
  Bot,
  MessageSquare,
  History,
  User,
  Settings,
  Archive,
  Star,
} from "lucide-react";

const menuItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Projects",
    href: "/projects",
    icon: FolderKanban,
  },
  {
    title: "AI Agents",
    href: "/agents",
    icon: Bot,
  },
  {
    title: "AI Chat",
    href: "/chat",
    icon: MessageSquare,
  },
  {
    title: "History",
    href: "/history",
    icon: History,
  },
  {
    title: "Archived Projects",
    href: "/projects/archived",
    icon: Archive,
  },
  {
    title: "Profile",
    href: "/profile",
    icon: User,
  },
  {
    title: "Settings",
    href: "/settings",
    icon: Settings,
  },
  {
  title: "Favorite Projects",
  href: "/projects/favorites",
  icon: Star,
},
];

export default function Sidebar() {
  return (
    <aside className="w-72 min-h-screen border-r border-white/10 bg-[#0B1220]">
      <div className="p-6">
        <h2 className="text-2xl font-bold text-cyan-400">
          DevPilot AI
        </h2>

        <p className="mt-1 text-sm text-slate-400">
          Autonomous Workspace
        </p>
      </div>

      <nav className="px-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;

          return (
            <Link
              key={item.title}
              href={item.href}
              className="
                flex
                items-center
                gap-3
                rounded-xl
                px-4
                py-3
                text-slate-300
                transition-all
                duration-300
                hover:bg-cyan-500/10
                hover:text-cyan-400
              "
            >
              <Icon size={20} />

              <span>{item.title}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}