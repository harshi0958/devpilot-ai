"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
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
  Sparkles,
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
    title: "Favorite Projects",
    href: "/projects/favorites",
    icon: Star,
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
];

export default function Sidebar() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/dashboard") {
      return pathname === "/dashboard";
    }

    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <aside className="sticky top-0 flex h-screen w-72 shrink-0 flex-col border-r border-white/10 bg-[#0B1220]">
      {/* Logo */}
      <div className="border-b border-white/10 px-6 py-6">
        <Link href="/dashboard" className="group block">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400 transition-all duration-300 group-hover:bg-cyan-500/20 group-hover:shadow-lg group-hover:shadow-cyan-500/10">
              <Sparkles size={20} />
            </div>

            <div>
              <h2 className="text-xl font-bold tracking-tight text-white">
                DevPilot <span className="text-cyan-400">AI</span>
              </h2>

              <p className="mt-0.5 text-xs text-slate-500">
                Autonomous Workspace
              </p>
            </div>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 overflow-y-auto px-4 py-6">
        <p className="mb-3 px-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
          Workspace
        </p>

        {menuItems.slice(0, 7).map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);

          return (
            <Link
              key={item.title}
              href={item.href}
              className={`group relative flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 ${
                active
                  ? "bg-cyan-500/10 text-cyan-400 shadow-sm shadow-cyan-500/5"
                  : "text-slate-400 hover:bg-white/5 hover:text-white"
              }`}
            >
              {active && (
                <span className="absolute left-0 h-6 w-1 rounded-r-full bg-cyan-400" />
              )}

              <Icon
                size={19}
                className={`shrink-0 transition-transform duration-200 ${
                  active
                    ? "text-cyan-400"
                    : "text-slate-500 group-hover:scale-110 group-hover:text-cyan-400"
                }`}
              />

              <span>{item.title}</span>
            </Link>
          );
        })}

        <p className="mb-3 mt-8 px-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
          Account
        </p>

        {menuItems.slice(7).map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);

          return (
            <Link
              key={item.title}
              href={item.href}
              className={`group relative flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 ${
                active
                  ? "bg-cyan-500/10 text-cyan-400 shadow-sm shadow-cyan-500/5"
                  : "text-slate-400 hover:bg-white/5 hover:text-white"
              }`}
            >
              {active && (
                <span className="absolute left-0 h-6 w-1 rounded-r-full bg-cyan-400" />
              )}

              <Icon
                size={19}
                className={`shrink-0 transition-transform duration-200 ${
                  active
                    ? "text-cyan-400"
                    : "text-slate-500 group-hover:scale-110 group-hover:text-cyan-400"
                }`}
              />

              <span>{item.title}</span>
            </Link>
          );
        })}
      </nav>

      {/* Workspace Status */}
      <div className="border-t border-white/10 p-4">
        <div className="rounded-2xl border border-emerald-500/10 bg-emerald-500/5 p-4">
          <div className="flex items-center gap-3">
            <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/10">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
              <span className="absolute h-2.5 w-2.5 animate-ping rounded-full bg-emerald-400 opacity-40" />
            </div>

            <div>
              <p className="text-sm font-medium text-white">
                Workspace Online
              </p>
              <p className="mt-0.5 text-xs text-emerald-400">
                All systems operational
              </p>
            </div>
          </div>
        </div>

        <p className="mt-4 text-center text-[11px] text-slate-600">
          DevPilot AI • Autonomous Engineering
        </p>
      </div>
    </aside>
  );
}