"use client";

import Link from "next/link";
import ProjectCard from "./ProjectCard";

const projects = [
  {
    name: "E-Commerce Platform",
    status: "Running",
    progress: 82,
    updated: "2 min ago",
    color: "bg-emerald-400",
  },
  {
    name: "CRM Dashboard",
    status: "Building",
    progress: 45,
    updated: "18 min ago",
    color: "bg-yellow-400",
  },
  {
    name: "Portfolio Website",
    status: "Testing",
    progress: 94,
    updated: "1 hour ago",
    color: "bg-cyan-400",
  },
  {
    name: "Mobile Banking App",
    status: "Deploying",
    progress: 68,
    updated: "Today",
    color: "bg-purple-400",
  },
];

export default function RecentProjects() {
  return (
    <section className="mt-10">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">
            Recent Projects
          </h2>

          <p className="mt-1 text-slate-400">
            Continue working on your latest AI projects.
          </p>
        </div>

        <Link
          href="/projects"
          className="rounded-xl border border-cyan-500/30 px-5 py-2 text-cyan-400 transition hover:bg-cyan-500 hover:text-black"
        >
          View All
        </Link>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {projects.map((project) => (
          <Link
            key={project.name}
            href="/projects"
            className="block"
          >
            <ProjectCard {...project} />
          </Link>
        ))}
      </div>
    </section>
  );
}