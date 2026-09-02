"use client";

import { useEffect, useState } from "react";

import Sidebar from "@/components/dashboard/Sidebar";
import TopNavbar from "@/components/dashboard/TopNavbar";

import { type Project } from "@/data/projects";

export default function ArchivedProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("projects");

    if (saved) {
      const allProjects: Project[] = JSON.parse(saved);

      setProjects(
        allProjects.filter((project) => project.archived)
      );
    }

    setIsLoaded(true);
  }, []);

  const restoreProject = (id: string) => {
    const saved = localStorage.getItem("projects");

    if (!saved) return;

    const allProjects: Project[] = JSON.parse(saved);

    const updatedProjects = allProjects.map((project) =>
      project.id === id
        ? {
            ...project,
            archived: false,
          }
        : project
    );

    localStorage.setItem(
      "projects",
      JSON.stringify(updatedProjects)
    );

    setProjects(
      updatedProjects.filter((project) => project.archived)
    );
  };

  const deleteProject = (id: string) => {
    const saved = localStorage.getItem("projects");

    if (!saved) return;

    const allProjects: Project[] = JSON.parse(saved);

    const updatedProjects = allProjects.filter(
      (project) => project.id !== id
    );

    localStorage.setItem(
      "projects",
      JSON.stringify(updatedProjects)
    );

    setProjects(
      updatedProjects.filter((project) => project.archived)
    );
  };

  if (!isLoaded) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#070B14] text-white">
        Loading...
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#070B14]">
      <Sidebar />

      <div className="flex-1">
        <TopNavbar />

        <main className="p-8">
          <h1 className="mb-2 text-4xl font-bold text-white">
            Archived Projects
          </h1>

          <p className="mb-8 text-slate-400">
            Restore or permanently delete archived projects.
          </p>

          {projects.length === 0 ? (
            <div className="rounded-2xl border border-white/10 bg-[#111827] p-12 text-center text-slate-400">
              📦 No archived projects found.
            </div>
          ) : (
            <div className="grid gap-6 lg:grid-cols-2">
              {projects.map((project) => (
                <div
                  key={project.id}
                  className="rounded-2xl border border-white/10 bg-[#111827] p-6"
                >
                  <h2 className="text-2xl font-bold text-white">
                    {project.name}
                  </h2>

                  <p className="mt-2 text-slate-400">
                    {project.description}
                  </p>

                  <div className="mt-4">
                    <span className="rounded-full bg-slate-700 px-3 py-1 text-xs text-white">
                      {project.status}
                    </span>
                  </div>

                  <div className="mt-6 flex gap-3">
                    <button
                      onClick={() => restoreProject(project.id)}
                      className="rounded-xl bg-cyan-500 px-5 py-3 font-semibold text-black transition hover:bg-cyan-400"
                    >
                      Restore
                    </button>

                    <button
                      onClick={() => {
                        if (
                          confirm(
                            `Delete "${project.name}" permanently?`
                          )
                        ) {
                          deleteProject(project.id);
                        }
                      }}
                      className="rounded-xl bg-red-500 px-5 py-3 font-semibold text-white transition hover:bg-red-600"
                    >
                      Delete Permanently
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}