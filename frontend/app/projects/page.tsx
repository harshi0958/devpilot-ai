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
    useState<Project[]>([]);

  const [isLoaded, setIsLoaded] = useState(false);

  const [loadingError, setLoadingError] = useState("");

  /*
  |--------------------------------------------------------------------------
  | Convert Backend Project → Frontend Project
  |--------------------------------------------------------------------------
  */

  const mapBackendProject = (backendProject: any): Project => {
    return {
      id: backendProject.id,

      name: backendProject.name,

      description:
        backendProject.description || "",

      status: "Building",

      progress: 0,

      members:
        backendProject._count?.members ?? 1,

      agents: 1,

      github: "",

      deployment: "",

      techStack: ["Next.js"],

      agentsActive: 1,

      membersOnline: 1,

      files:
        backendProject._count?.files ?? 0,

      tasks: 0,

      pendingTasks: 0,

      archived: false,
    };
  };

  /*
  |--------------------------------------------------------------------------
  | Load Projects From PostgreSQL
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    const loadProjects = async () => {
      try {
        setLoadingError("");

        const response = await fetch(
          "http://localhost:5000/api/projects",
          {
            method: "GET",
            credentials: "include",
          }
        );

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(
            data.message || "Failed to fetch projects."
          );
        }

        const backendProjects = Array.isArray(data.projects)
          ? data.projects
          : [];

        const mappedProjects =
          backendProjects.map(mapBackendProject);

        setProjectList(mappedProjects);
      } catch (error) {
        console.error(
          "Load Projects Error:",
          error
        );

        setLoadingError(
          error instanceof Error
            ? error.message
            : "Failed to load projects."
        );

        /*
        |--------------------------------------------------------------------------
        | Fallback
        |--------------------------------------------------------------------------
        |
        | We don't use localStorage anymore.
        | If API fails, show empty list instead of fake data.
        |
        */

        setProjectList([]);
      } finally {
        setIsLoaded(true);
      }
    };

    loadProjects();
  }, []);

  /*
  |--------------------------------------------------------------------------
  | Delete
  |--------------------------------------------------------------------------
  */

  const deleteProject = async (id: string) => {
    const deletedProject = projectList.find(
      (p) => p.id === id
    );

    if (!deletedProject) return;

    try {
      const response = await fetch(
        `http://localhost:5000/api/projects/${id}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Failed to delete project."
        );
      }

      setProjectList((prev) =>
        prev.filter(
          (project) => project.id !== id
        )
      );

      toast.success("Project deleted", {
        description: deletedProject.name,
      });
    } catch (error) {
      console.error(
        "Delete Project Error:",
        error
      );

      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to delete project."
      );
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Archive
  |--------------------------------------------------------------------------
  */

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
      description:
        "Project moved to Archived Projects",
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

  /*
  |--------------------------------------------------------------------------
  | Duplicate
  |--------------------------------------------------------------------------
  */

  const duplicateProject = async (id: string) => {
    const project = projectList.find(
      (p) => p.id === id
    );

    if (!project) return;

    try {
      const response = await fetch(
        "http://localhost:5000/api/projects",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            name: `${project.name} Copy`,
            description: project.description,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Failed to duplicate project."
        );
      }

      const copy = mapBackendProject(
        data.project
      );

      setProjectList((prev) => [
        copy,
        ...prev,
      ]);

      toast.success("Project duplicated", {
        description: copy.name,
      });
    } catch (error) {
      console.error(
        "Duplicate Project Error:",
        error
      );

      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to duplicate project."
      );
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Edit
  |--------------------------------------------------------------------------
  */

  const updateProject = async (
    updatedProject: Project
  ) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/projects/${updatedProject.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            name: updatedProject.name,
            description:
              updatedProject.description,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Failed to update project."
        );
      }

      const updatedBackendProject =
        mapBackendProject(data.project);

      setProjectList((prev) =>
        prev.map((project) =>
          project.id === updatedProject.id
            ? {
                ...project,
                ...updatedBackendProject,
              }
            : project
        )
      );

      setEditOpen(false);

      toast.success("Project updated", {
        description:
          updatedBackendProject.name,
      });
    } catch (error) {
      console.error(
        "Update Project Error:",
        error
      );

      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to update project."
      );
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Loading State
  |--------------------------------------------------------------------------
  */

  if (!isLoaded) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#070B14] text-white">
        <div className="text-center">
          <div className="text-lg font-semibold">
            Loading projects...
          </div>

          <div className="mt-2 text-sm text-slate-400">
            Connecting to DevPilot backend
          </div>
        </div>
      </div>
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Filter + Sort
  |--------------------------------------------------------------------------
  */

  const filteredProjects = projectList
    .filter((project) => {
      const matchesSearch =
        project.name
          .toLowerCase()
          .includes(
            search.toLowerCase()
          );

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
          return a.name.localeCompare(
            b.name
          );

        case "za":
          return b.name.localeCompare(
            a.name
          );

        case "progress-high":
          return (
            b.progress - a.progress
          );

        case "progress-low":
          return (
            a.progress - b.progress
          );

        case "members-high":
          return (
            b.members - a.members
          );

        case "members-low":
          return (
            a.members - b.members
          );

        default:
          return 0;
      }
    });

  /*
  |--------------------------------------------------------------------------
  | Page
  |--------------------------------------------------------------------------
  */

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

          {/* API Error */}
          {loadingError && (
            <div
              className="
                mb-6
                rounded-xl
                border
                border-red-500/20
                bg-red-500/10
                px-4
                py-3
                text-sm
                text-red-400
              "
            >
              {loadingError}
            </div>
          )}

          {/* Live Stats */}
          <ProjectStats
            projects={projectList}
          />

          {/* Grid */}
          <ProjectGrid
            projects={filteredProjects}
            onDelete={deleteProject}
            onArchive={archiveProject}
            onDuplicate={duplicateProject}
            onEdit={(project) => {
              const fullProject =
                projectList.find(
                  (p) =>
                    p.id === project.id
                ) ?? null;

              setSelectedProject(
                fullProject
              );

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
              setProjectList((prev) => [
                newProject,
                ...prev,
              ]);

              setOpenModal(false);

              toast.success(
                "Project created successfully 🚀"
              );
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