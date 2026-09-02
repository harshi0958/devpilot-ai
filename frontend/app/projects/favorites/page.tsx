"use client";

import { useEffect, useState } from "react";

import Sidebar from "@/components/dashboard/Sidebar";
import TopNavbar from "@/components/dashboard/TopNavbar";

import { type Project } from "@/data/projects";

export default function FavoriteProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const savedProjects = localStorage.getItem("projects");
    const favorites = JSON.parse(
      localStorage.getItem("favoriteProjects") || "[]"
    );

    if (savedProjects) {
      const allProjects: Project[] = JSON.parse(savedProjects);

      setProjects(
        allProjects.filter((project) =>
          favorites.includes(project.id)
        )
      );
    }

    setIsLoaded(true);
  }, []);

  const removeFavorite = (id: string) => {
    const favorites = JSON.parse(
      localStorage.getItem("favoriteProjects") || "[]"
    );

    const updatedFavorites = favorites.filter(
      (projectId: string) => projectId !== id
    );

    localStorage.setItem(
      "favoriteProjects",
      JSON.stringify(updatedFavorites)
    );

    setProjects((prev) =>
      prev.filter((project) => project.id !== id)
    );
  };

  if (!isLoaded) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#070B14] text-white">
        Loading...
      </div>
    );
  }

  const filteredProjects = projects.filter((project) =>
    project.name
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div className="flex min-h-screen bg-[#070B14]">
      <Sidebar />

      <div className="flex-1">
        <TopNavbar />

        <main className="p-8">

          <div className="mb-8">
            <h1 className="text-4xl font-bold text-white">
              ⭐ Favorite Projects
            </h1>

            <p className="mt-2 text-slate-400">
              Quickly access your starred projects.
            </p>
          </div>

          <input
            placeholder="Search favorite projects..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="
              mb-8
              w-full
              rounded-2xl
              border
              border-white/10
              bg-[#111827]
              px-5
              py-4
              text-white
              outline-none
            "
          />

          <div className="mb-6 text-slate-400">
            Total Favorites:
            <span className="ml-2 font-bold text-cyan-400">
              {filteredProjects.length}
            </span>
          </div>

          {filteredProjects.length === 0 ? (
            <div className="rounded-2xl border border-white/10 bg-[#111827] p-12 text-center text-slate-400">
              ⭐ No favorite projects.
            </div>
          ) : (
            <div className="grid gap-6 lg:grid-cols-2">
              {filteredProjects.map((project) => (
                <div
                  key={project.id}
                  className="
                    rounded-2xl
                    border
                    border-white/10
                    bg-[#111827]
                    p-6
                  "
                >
                  <h2 className="text-2xl font-bold text-white">
                    {project.name}
                  </h2>

                  <p className="mt-2 text-slate-400">
                    {project.description}
                  </p>

                  <div className="mt-4">
                    <span className="rounded-full bg-cyan-500/20 px-3 py-1 text-xs text-cyan-400">
                      {project.status}
                    </span>
                  </div>

                  <div className="mt-6 flex gap-3">

                    <button
                      onClick={() =>
                        window.location.href = `/projects/${project.id}`
                      }
                      className="rounded-xl bg-cyan-500 px-5 py-3 font-semibold text-black"
                    >
                      Open Project
                    </button>

                    <button
                      onClick={() =>
                        removeFavorite(project.id)
                      }
                      className="rounded-xl bg-yellow-500 px-5 py-3 font-semibold text-black"
                    >
                      Remove Favorite
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