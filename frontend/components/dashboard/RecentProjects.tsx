"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  FolderKanban,
  Loader2,
  ArrowRight,
  CalendarDays,
} from "lucide-react";

type Project = {
  id: string;
  name: string;
  description?: string | null;
  slug: string;
  createdAt: string;
  updatedAt: string;
};

type ProjectsResponse = {
  success: boolean;
  count: number;
  projects: Project[];
};

export default function RecentProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);

        const response = await fetch(
          "http://localhost:5000/api/projects",
          {
            method: "GET",
            credentials: "include",
          }
        );

        const data: ProjectsResponse = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(
            "Failed to fetch projects"
          );
        }

        // Backend returns: { success, count, projects }
        const projectList = Array.isArray(data.projects)
          ? data.projects
          : [];

        const sortedProjects = [...projectList]
          .sort(
            (a, b) =>
              new Date(b.updatedAt).getTime() -
              new Date(a.updatedAt).getTime()
          )
          .slice(0, 4);

        setProjects(sortedProjects);
      } catch (error) {
        console.error(
          "Failed to load recent projects:",
          error
        );

        setProjects([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const formatDate = (date: string) => {
    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "Unknown";
    }

    return parsedDate.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <section className="mt-10">
      {/* Header */}
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

      {/* Loading */}
      {loading && (
        <div className="flex min-h-45 items-center justify-center rounded-2xl border border-white/10 bg-[#0B1220]">
          <div className="flex items-center gap-3 text-slate-400">
            <Loader2
              size={20}
              className="animate-spin text-cyan-400"
            />

            Loading projects...
          </div>
        </div>
      )}

      {/* Empty */}
      {!loading && projects.length === 0 && (
        <div className="flex min-h-45 flex-col items-center justify-center rounded-2xl border border-white/10 bg-[#0B1220] text-center">
          <FolderKanban
            size={32}
            className="text-slate-600"
          />

          <h3 className="mt-3 font-semibold text-white">
            No projects yet
          </h3>

          <p className="mt-1 text-sm text-slate-500">
            Create your first project to get started.
          </p>

          <Link
            href="/projects"
            className="mt-4 rounded-xl bg-cyan-500 px-4 py-2 text-sm font-semibold text-black transition hover:bg-cyan-400"
          >
            Create Project
          </Link>
        </div>
      )}

      {/* Projects */}
      {!loading && projects.length > 0 && (
        <div className="grid gap-6 lg:grid-cols-2">
          {projects.map((project) => (
            <Link
              key={project.id}
              href={`/projects/${project.id}`}
              className="
                group
                rounded-2xl
                border
                border-white/10
                bg-[#0B1220]
                p-6
                transition-all
                duration-300
                hover:-translate-y-1
                hover:border-cyan-500/30
                hover:bg-[#0D1626]
              "
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-cyan-500/10">
                    <FolderKanban
                      size={21}
                      className="text-cyan-400"
                    />
                  </div>

                  <div className="min-w-0">
                    <h3 className="truncate font-semibold text-white">
                      {project.name}
                    </h3>

                    <p className="mt-1 text-xs text-emerald-400">
                      Active Project
                    </p>
                  </div>
                </div>

                <ArrowRight
                  size={18}
                  className="shrink-0 text-slate-600 transition group-hover:translate-x-1 group-hover:text-cyan-400"
                />
              </div>

              <p className="mt-5 line-clamp-2 text-sm leading-6 text-slate-400">
                {project.description ||
                  "No project description provided."}
              </p>

              <div className="mt-5 flex items-center gap-2 text-xs text-slate-500">
                <CalendarDays size={14} />

                <span>
                  Updated {formatDate(project.updatedAt)}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}