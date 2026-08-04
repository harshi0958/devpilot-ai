"use client";

import { useState } from "react";

import Sidebar from "@/components/dashboard/Sidebar";
import TopNavbar from "@/components/dashboard/TopNavbar";
import { projects } from "@/data/projects";
import ProjectsHeader from "@/components/projects/ProjectsHeader";
import ProjectsToolbar from "@/components/projects/ProjectsToolbar";
import ProjectStats from "@/components/projects/ProjectStats";
import ProjectGrid from "@/components/projects/ProjectGrid";
import CreateProjectModal from "@/components/projects/CreateProjectModal";

export default function ProjectsPage() {
  const [openModal, setOpenModal] = useState(false);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [sort, setSort] = useState("default");

const filteredProjects = projects
  .filter((project) => {
    const matchesSearch =
      project.name
        .toLowerCase()
        .includes(search.toLowerCase());

    const matchesFilter =
      filter === "All" ||
      project.status === filter;

    return matchesSearch && matchesFilter;
  })
  .sort((a, b) => {
    switch (sort) {
      case "az":
        return a.name.localeCompare(b.name);

      case "za":
        return b.name.localeCompare(a.name);

      case "progress-high":
        return b.progress - a.progress;

      case "progress-low":
        return a.progress - b.progress;

      case "members-high":
        return b.members - a.members;

      case "members-low":
        return a.members - b.members;

      default:
        return 0;
    }
  });

  return (
    <div className="flex min-h-screen bg-[#070B14]">

      <Sidebar />

      <div className="flex-1">

        <TopNavbar />

        <main className="p-8">

          <ProjectsHeader
            onNewProject={() => setOpenModal(true)}
          />

          <ProjectsToolbar
  search={search}
  setSearch={setSearch}
  filter={filter}
  setFilter={setFilter}
  sort={sort}
  setSort={setSort}
/>

          <ProjectStats />

          <ProjectGrid
  projects={filteredProjects}
/>

          <CreateProjectModal
            isOpen={openModal}
            onClose={() => setOpenModal(false)}
          />

        </main>

      </div>

    </div>
  );
}