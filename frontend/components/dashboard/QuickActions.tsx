"use client";

import {
  FolderPlus,
  GitBranch,
  Users,
  Rocket,
  Bot,
  BookOpen,
} from "lucide-react";

import QuickActionCard from "./QuickActionCard";

const actions = [
  {
    title: "New Project",
    description: "Create a fresh AI project",
    icon: <FolderPlus size={22} />,
    href: "/projects",
  },
  {
    title: "Import GitHub",
    description: "Import an existing repository",
    icon: <GitBranch size={22} />,
    href: "/projects",
  },
  {
    title: "Invite Team",
    description: "Add collaborators",
    icon: <Users size={22} />,
    href: "/settings",
  },
  {
    title: "Deploy Project",
    description: "Deploy to production",
    icon: <Rocket size={22} />,
    href: "/projects",
  },
  {
    title: "Create AI Agent",
    description: "Add a custom AI agent",
    icon: <Bot size={22} />,
    href: "/agents",
  },
  {
    title: "Documentation",
    description: "Read guides & API docs",
    icon: <BookOpen size={22} />,
    href: "/docs",
  },
];

export default function QuickActions() {
  return (
    <section>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white">
          Quick Actions
        </h2>

        <p className="mt-1 text-slate-400">
          Frequently used workspace shortcuts.
        </p>
      </div>

      <div className="space-y-4">
        {actions.map((action) => (
          <QuickActionCard
            key={action.title}
            {...action}
          />
        ))}
      </div>
    </section>
  );
}