"use client";

import { useEffect, useMemo, useState } from "react";
import Sidebar from "@/components/dashboard/Sidebar";
import TopNavbar from "@/components/dashboard/TopNavbar";
import Link from "next/link";
import {
  FileCode2,
  FileJson,
  FileText,
  File,
  Folder,
  Search,
  Download,
  Eye,
  Loader2,
  AlertCircle,
} from "lucide-react";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

type Project = {
  id: string;
  name: string;
  slug: string;
};

type ProjectFile = {
  id: string;
  projectId: string;
  name: string;
  path: string;
  type: "FILE" | "FOLDER";
  mimeType: string | null;
  size: string | null;
  content: string | null;
  parentPath: string | null;
  createdAt: string;
  updatedAt: string;
};

function getFileIcon(file: ProjectFile) {
  if (file.type === "FOLDER") {
    return Folder;
  }

  const extension = file.name.split(".").pop()?.toLowerCase();

  if (extension === "json") {
    return FileJson;
  }

  if (
    extension === "ts" ||
    extension === "tsx" ||
    extension === "js" ||
    extension === "jsx" ||
    extension === "css" ||
    extension === "html"
  ) {
    return FileCode2;
  }

  if (
    extension === "md" ||
    extension === "txt"
  ) {
    return FileText;
  }

  return File;
}

function formatUpdated(date: string) {
  const updated = new Date(date);
  const now = new Date();

  const diffMs = now.getTime() - updated.getTime();
  const diffMinutes = Math.floor(diffMs / 60000);

  if (diffMinutes < 1) {
    return "Just now";
  }

  if (diffMinutes < 60) {
    return `${diffMinutes} min ago`;
  }

  const diffHours = Math.floor(diffMinutes / 60);

  if (diffHours < 24) {
    return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
  }

  const diffDays = Math.floor(diffHours / 24);

  if (diffDays === 1) {
    return "Yesterday";
  }

  return `${diffDays} days ago`;
}

function formatFileType(file: ProjectFile) {
  if (file.type === "FOLDER") {
    return "Folder";
  }

  const extension = file.name.split(".").pop();

  if (!extension) {
    return "File";
  }

  return extension.toUpperCase();
}

export default function FilesPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] =
    useState<Project | null>(null);

  const [files, setFiles] = useState<ProjectFile[]>([]);
  const [search, setSearch] = useState("");

  const [loadingProjects, setLoadingProjects] =
    useState(true);

  const [loadingFiles, setLoadingFiles] =
    useState(false);

  const [error, setError] = useState("");

  const [selectedFile, setSelectedFile] =
    useState<ProjectFile | null>(null);

  /*
  |--------------------------------------------------------------------------
  | Load Projects
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    const loadProjects = async () => {
      try {
        setLoadingProjects(true);
        setError("");

        const response = await fetch(
          `${API_URL}/api/projects`,
          {
            method: "GET",
            credentials: "include",
          }
        );

        const result = await response.json();

        if (!response.ok || !result.success) {
          throw new Error(
            result.message || "Failed to load projects"
          );
        }

        const projectList: Project[] =
          result.projects || [];

        setProjects(projectList);

        if (projectList.length > 0) {
          setSelectedProject(projectList[0]);
        }
      } catch (err) {
        console.error("Load projects error:", err);

        setError(
          err instanceof Error
            ? err.message
            : "Failed to load projects"
        );
      } finally {
        setLoadingProjects(false);
      }
    };

    loadProjects();
  }, []);

  /*
  |--------------------------------------------------------------------------
  | Load Files
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    if (!selectedProject) {
      setFiles([]);
      return;
    }

    const loadFiles = async () => {
      try {
        setLoadingFiles(true);
        setError("");

        const response = await fetch(
          `${API_URL}/api/files?projectId=${encodeURIComponent(
            selectedProject.id
          )}`,
          {
            method: "GET",
            credentials: "include",
          }
        );

        const result = await response.json();

        if (!response.ok || !result.success) {
          throw new Error(
            result.message || "Failed to load files"
          );
        }

        setFiles(result.data || []);
      } catch (err) {
        console.error("Load files error:", err);

        setError(
          err instanceof Error
            ? err.message
            : "Failed to load files"
        );

        setFiles([]);
      } finally {
        setLoadingFiles(false);
      }
    };

    loadFiles();
  }, [selectedProject]);

  /*
  |--------------------------------------------------------------------------
  | Search
  |--------------------------------------------------------------------------
  */

  const filteredFiles = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return files;
    }

    return files.filter(
      (file) =>
        file.name.toLowerCase().includes(query) ||
        file.path.toLowerCase().includes(query)
    );
  }, [files, search]);

  /*
  |--------------------------------------------------------------------------
  | Download File
  |--------------------------------------------------------------------------
  */

  const handleDownload = (file: ProjectFile) => {
    if (file.type === "FOLDER") {
      return;
    }

    const blob = new Blob(
      [file.content || ""],
      {
        type:
          file.mimeType ||
          "text/plain;charset=utf-8",
      }
    );

    const url = URL.createObjectURL(blob);

    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = file.name;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();

    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex min-h-screen bg-[#070B14]">
      <Sidebar />

      <div className="flex-1">
        <TopNavbar />

        <main className="p-8">

          {/* Header */}

          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

            <div>
              <h1 className="text-4xl font-bold text-white">
                Files
              </h1>

              <p className="mt-2 text-slate-400">
                Browse and manage project files.
              </p>
            </div>

            <Link
              href="/dashboard"
              className="w-fit rounded-xl border border-cyan-500/30 px-5 py-2 text-cyan-400 transition hover:bg-cyan-500 hover:text-black"
            >
              Back to Dashboard
            </Link>

          </div>

          {/* Project Selector */}

          <div className="mt-8 max-w-lg">
            <label className="mb-2 block text-sm font-medium text-slate-300">
              Project
            </label>

            {loadingProjects ? (
              <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-[#101827] px-4 py-3 text-slate-400">
                <Loader2
                  size={18}
                  className="animate-spin"
                />
                Loading projects...
              </div>
            ) : projects.length === 0 ? (
              <div className="rounded-xl border border-yellow-500/20 bg-yellow-500/5 px-4 py-3 text-sm text-yellow-400">
                No projects found.
              </div>
            ) : (
              <select
                value={selectedProject?.id || ""}
                onChange={(event) => {
                  const project = projects.find(
                    (item) =>
                      item.id === event.target.value
                  );

                  setSelectedProject(project || null);
                }}
                className="w-full rounded-xl border border-white/10 bg-[#101827] px-4 py-3 text-white outline-none focus:border-cyan-500"
              >
                {projects.map((project) => (
                  <option
                    key={project.id}
                    value={project.id}
                    className="bg-[#101827]"
                  >
                    {project.name}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Search */}

          <div className="relative mt-6 max-w-lg">

            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
              size={18}
            />

            <input
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              placeholder="Search files..."
              className="w-full rounded-xl border border-white/10 bg-[#101827] py-3 pl-11 pr-4 text-white outline-none focus:border-cyan-500"
            />

          </div>

          {/* Error */}

          {error && (
            <div className="mt-6 flex items-center gap-3 rounded-xl border border-red-500/20 bg-red-500/5 p-4 text-red-400">
              <AlertCircle size={20} />
              <span>{error}</span>
            </div>
          )}

          {/* File Count */}

          {selectedProject && !loadingFiles && (
            <div className="mt-6 text-sm text-slate-500">
              {filteredFiles.length} file
              {filteredFiles.length !== 1
                ? "s"
                : ""}{" "}
              found in{" "}
              <span className="text-slate-300">
                {selectedProject.name}
              </span>
            </div>
          )}

          {/* File List */}

          <div className="mt-4 space-y-4">

            {loadingFiles ? (
              <div className="flex items-center justify-center rounded-2xl border border-white/10 bg-[#101827] p-12 text-slate-400">
                <Loader2
                  size={22}
                  className="mr-3 animate-spin"
                />
                Loading project files...
              </div>
            ) : filteredFiles.length === 0 ? (
              <div className="rounded-2xl border border-white/10 bg-[#101827] p-12 text-center">
                <File
                  className="mx-auto text-slate-600"
                  size={42}
                />

                <h3 className="mt-4 text-lg font-semibold text-white">
                  No files yet
                </h3>

                <p className="mt-2 text-sm text-slate-500">
                  Generated project files will appear here.
                </p>
              </div>
            ) : (
              filteredFiles.map((file) => {
                const Icon = getFileIcon(file);

                return (
                  <div
                    key={file.id}
                    className="flex items-center justify-between rounded-2xl border border-white/10 bg-[#101827] p-5 transition hover:border-cyan-500/30"
                  >

                    <div className="flex min-w-0 items-center gap-4">

                      <div className="rounded-xl bg-cyan-500/10 p-3">
                        <Icon
                          className="text-cyan-400"
                          size={22}
                        />
                      </div>

                      <div className="min-w-0">
                        <h3 className="truncate font-semibold text-white">
                          {file.name}
                        </h3>

                        <p className="mt-1 truncate text-sm text-slate-400">
                          {formatFileType(file)}{" "}
                          •{" "}
                          {formatUpdated(
                            file.updatedAt
                          )}
                        </p>

                        <p className="mt-1 truncate text-xs text-slate-600">
                          {file.path}
                        </p>
                      </div>

                    </div>

                    <div className="ml-4 flex shrink-0 gap-3">

                      <button
                        onClick={() =>
                          setSelectedFile(file)
                        }
                        className="rounded-lg border border-white/10 p-2 transition hover:border-cyan-500 hover:bg-cyan-500/10"
                        title="View file"
                      >
                        <Eye
                          className="text-white"
                          size={18}
                        />
                      </button>

                      <button
                        onClick={() =>
                          handleDownload(file)
                        }
                        disabled={
                          file.type === "FOLDER"
                        }
                        className="rounded-lg border border-white/10 p-2 transition hover:border-cyan-500 hover:bg-cyan-500/10 disabled:cursor-not-allowed disabled:opacity-30"
                        title="Download file"
                      >
                        <Download
                          className="text-white"
                          size={18}
                        />
                      </button>

                    </div>

                  </div>
                );
              })
            )}

          </div>

        </main>
      </div>

      {/* File Preview */}

      {selectedFile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-6">

          <div className="flex max-h-[85vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#0B1220]">

            <div className="flex items-center justify-between border-b border-white/10 p-5">

              <div>
                <h2 className="font-semibold text-white">
                  {selectedFile.name}
                </h2>

                <p className="mt-1 text-xs text-slate-500">
                  {selectedFile.path}
                </p>
              </div>

              <button
                onClick={() =>
                  setSelectedFile(null)
                }
                className="rounded-lg border border-white/10 px-3 py-2 text-sm text-slate-300 hover:border-cyan-500 hover:text-white"
              >
                Close
              </button>

            </div>

            <pre className="overflow-auto p-6 text-sm leading-6 text-slate-300">
              {selectedFile.content ||
                "No content available for this file."}
            </pre>

          </div>

        </div>
      )}
    </div>
  );
}