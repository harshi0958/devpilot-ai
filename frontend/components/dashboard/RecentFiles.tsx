"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  FileCode2,
  ArrowRight,
  Loader2,
  FolderKanban,
} from "lucide-react";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

type Project = {
  id: string;
  name: string;
};

type ProjectFile = {
  id: string;
  name?: string;
  path: string;
  updatedAt?: string;
  createdAt?: string;
};

type FilesResponse = {
  success?: boolean;
  files?: ProjectFile[];
  data?: ProjectFile[];
};

type RecentFile = ProjectFile & {
  projectId: string;
  projectName: string;
};

export default function RecentFiles() {
  const [files, setFiles] = useState<RecentFile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const fetchRecentFiles = async () => {
      try {
        setLoading(true);

        // Get the user's active projects first
        const projectsResponse = await fetch(
          `${API_URL}/api/projects`,
          {
            method: "GET",
            credentials: "include",
          }
        );

        if (!projectsResponse.ok) {
          throw new Error("Failed to fetch projects");
        }

        const projectsData = await projectsResponse.json();

        const projects: Project[] = Array.isArray(
          projectsData?.projects
        )
          ? projectsData.projects
          : [];

        // Fetch files for each project
        const fileResponses = await Promise.all(
          projects.map(async (project) => {
            try {
              const response = await fetch(
                `${API_URL}/api/files?projectId=${encodeURIComponent(
                  project.id
                )}`,
                {
                  method: "GET",
                  credentials: "include",
                }
              );

              if (!response.ok) {
                return [];
              }

              const data: FilesResponse =
                await response.json();

              const projectFiles = Array.isArray(data.files)
                ? data.files
                : Array.isArray(data.data)
                  ? data.data
                  : [];

              return projectFiles.map((file) => ({
                ...file,
                projectId: project.id,
                projectName: project.name,
              }));
            } catch {
              return [];
            }
          })
        );

        if (cancelled) return;

        const allFiles = fileResponses.flat();

        const sortedFiles = allFiles
          .sort((a, b) => {
            const dateA = new Date(
              a.updatedAt || a.createdAt || 0
            ).getTime();

            const dateB = new Date(
              b.updatedAt || b.createdAt || 0
            ).getTime();

            return dateB - dateA;
          })
          .slice(0, 4);

        setFiles(sortedFiles);
      } catch (error) {
        if (!cancelled) {
          console.error(
            "Failed to load recent files:",
            error
          );

          setFiles([]);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchRecentFiles();

    return () => {
      cancelled = true;
    };
  }, []);

  const getFileName = (file: ProjectFile) => {
    if (file.name?.trim()) {
      return file.name;
    }

    const parts = file.path.split("/");
    return parts[parts.length - 1] || file.path;
  };

  const getFileExtension = (path: string) => {
    const parts = path.split(".");
    return parts.length > 1
      ? parts[parts.length - 1].toUpperCase()
      : "FILE";
  };

  return (
    <section className="mt-12">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-white">
            Recent Files
          </h2>

          <p className="mt-2 text-slate-400">
            Recently generated and updated project files.
          </p>
        </div>

        <Link
          href="/files"
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

            Loading recent files...
          </div>
        </div>
      )}

      {/* Empty */}
      {!loading && files.length === 0 && (
        <div className="flex min-h-45 flex-col items-center justify-center rounded-2xl border border-white/10 bg-[#0B1220] text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-cyan-500/10">
            <FileCode2
              size={28}
              className="text-cyan-400"
            />
          </div>

          <h3 className="mt-4 text-lg font-semibold text-white">
            No project files found
          </h3>

          <p className="mt-2 max-w-md text-sm text-slate-500">
            Generated project files will appear here.
          </p>

          <Link
            href="/files"
            className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-cyan-400 transition hover:text-cyan-300"
          >
            Open Files
            <ArrowRight size={16} />
          </Link>
        </div>
      )}

      {/* Recent Files */}
      {!loading && files.length > 0 && (
        <div className="grid gap-4 lg:grid-cols-2">
          {files.map((file) => (
            <Link
              key={`${file.projectId}-${file.id}`}
              href="/files"
              className="
                group
                rounded-2xl
                border
                border-white/10
                bg-[#0B1220]
                p-5
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
                    <FileCode2
                      size={21}
                      className="text-cyan-400"
                    />
                  </div>

                  <div className="min-w-0">
                    <h3 className="truncate font-semibold text-white">
                      {getFileName(file)}
                    </h3>

                    <p className="mt-1 truncate text-xs text-slate-500">
                      {file.path}
                    </p>
                  </div>
                </div>

                <ArrowRight
                  size={18}
                  className="shrink-0 text-slate-600 transition group-hover:translate-x-1 group-hover:text-cyan-400"
                />
              </div>

              <div className="mt-4 flex items-center gap-2 text-xs">
                <FolderKanban
                  size={14}
                  className="text-violet-400"
                />

                <span className="truncate text-slate-400">
                  {file.projectName}
                </span>

                <span className="ml-auto rounded-md bg-white/5 px-2 py-1 text-[10px] text-slate-500">
                  {getFileExtension(file.path)}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}