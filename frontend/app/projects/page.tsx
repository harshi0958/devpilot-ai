"use client";

import { useEffect, useState } from "react";

import Sidebar from "@/components/dashboard/Sidebar";
import TopNavbar from "@/components/dashboard/TopNavbar";

import { projects, type Project } from "@/data/projects";
import { toast } from "sonner";
import ProjectsHeader from "@/components/projects/ProjectsHeader";
import ProjectsToolbar from "@/components/projects/ProjectsToolbar";
import ProjectStats from "@/components/projects/ProjectStats";
import ProjectGrid from "@/components/projects/ProjectGrid";
import CreateProjectModal from "@/components/projects/CreateProjectModal";
import EditProjectModal from "@/components/projects/EditProjectModal";

export default function ProjectsPage() {
  const [openModal, setOpenModal] = useState(false);

  const [editOpen, setEditOpen] = useState(false);
  const [selectedProject, setSelectedProject] =
    useState<Project | null>(null);

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [sort, setSort] = useState("default");

  const [projectList, setProjectList] =
    useState<Project[]>(projects);

  const [isLoaded, setIsLoaded] = useState(false);

  // Load from LocalStorage
  useEffect(() => {
    const saved = localStorage.getItem("projects");

    if (saved) {
      setProjectList(JSON.parse(saved));
    }

    setIsLoaded(true);
  }, []);

  // Save to LocalStorage
  useEffect(() => {
    if (!isLoaded) return;

    localStorage.setItem(
      "projects",
      JSON.stringify(projectList)
    );
  }, [projectList, isLoaded]);

  // Delete
  const deleteProject = (id: string) => {
  const deletedProject = projectList.find(
    (p) => p.id === id
  );

  if (!deletedProject) return;

  setProjectList((prev) =>
    prev.filter((project) => project.id !== id)
  );

  toast.error("Project deleted", {
    description: deletedProject.name,
    action: {
      label: "Undo",
      onClick: () => {
        setProjectList((prev) => [
          deletedProject,
          ...prev,
        ]);

        toast.success("Project restored");
      },
    },
  });
};
  // Archive
  const archiveProject = (id: string) => {
  setProjectList((prev) =>
    prev.map((project) =>
      project.id === id
        ? {
            ...project,
            archived: true,
          }
        : project
    )
  );

  toast("📦 Project archived", {
    description: "Project moved to Archived Projects",
    action: {
      label: "Undo",
      onClick: () => {
        setProjectList((prev) =>
          prev.map((project) =>
            project.id === id
              ? {
                  ...project,
                  archived: false,
                }
              : project
          )
        );

        toast.success("Project restored");
      },
    },
  });
};

  // Duplicate
  const duplicateProject = (id: string) => {
  const project = projectList.find(
    (p) => p.id === id
  );

  if (!project) return;

  const copy: Project = {
    ...project,
    id: `${project.id}-${Date.now()}`,
    name: `${project.name} Copy`,
    archived: false,
  };

  setProjectList((prev) => [copy, ...prev]);

  toast.success("Project duplicated", {
    description: copy.name,
  });
};

  // Edit
  const updateProject = (updatedProject: Project) => {
  setProjectList((prev) =>
    prev.map((project) =>
      project.id === updatedProject.id
        ? {
            ...project,
            ...updatedProject,
          }
        : project
    )
  );

  toast.success("Project updated", {
    description: updatedProject.name,
  });
};

  if (!isLoaded) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#070B14] text-white">
        Loading...
      </div>
    );
  }

  const filteredProjects = projectList
    .filter((project) => {
      const matchesSearch = project.name
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchesFilter =
        filter === "All" ||
        project.status === filter;

      return (
        matchesSearch &&
        matchesFilter &&
        !project.archived
      );
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
            onNewProject={() =>
              setOpenModal(true)
            }
          />

          <ProjectsToolbar
            search={search}
            setSearch={setSearch}
            filter={filter}
            setFilter={setFilter}
            sort={sort}
            setSort={setSort}
          />

          {/* Live Stats */}
          <ProjectStats projects={projectList} />

          {/* Grid */}
          <ProjectGrid
            projects={filteredProjects}
            onDelete={deleteProject}
            onArchive={archiveProject}
            onDuplicate={duplicateProject}
            onEdit={(project) => {
              const fullProject = projectList.find(
                (p) => p.id === project.id
              ) ?? null;

              setSelectedProject(fullProject);
              setEditOpen(true);
            }}
          />

          {/* Create */}
          <CreateProjectModal
            isOpen={openModal}
            onClose={() =>
              setOpenModal(false)
            }
            onCreate={(newProject) => {
  setProjectList((prev) => [newProject, ...prev]);
  setOpenModal(false);

  toast.success("Project created successfully 🚀");
}}
          />

          {/* Edit */}
          <EditProjectModal
            isOpen={editOpen}
            project={selectedProject}
            onClose={() =>
              setEditOpen(false)
            }
            onSave={updateProject}
          />
        </main>
      </div>
    </div>
  );
}