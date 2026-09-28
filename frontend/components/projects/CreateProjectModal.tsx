"use client";

import { X, Loader2 } from "lucide-react";
import { useState } from "react";

import { type Project } from "@/data/projects";

interface CreateProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (project: Project) => void;
}

export default function CreateProjectModal({
  isOpen,
  onClose,
  onCreate,
}: CreateProjectModalProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [tech, setTech] = useState("Next.js");

  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  /*
  |--------------------------------------------------------------------------
  | Create Project
  |--------------------------------------------------------------------------
  */

  const handleCreateProject = async () => {
    if (!name.trim()) {
      setError("Project name is required.");
      return;
    }

    setIsCreating(true);
    setError("");

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
            name: name.trim(),
            description: description.trim(),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Failed to create project."
        );
      }

      /*
      |--------------------------------------------------------------------------
      | Convert Backend Project → Frontend Project
      |--------------------------------------------------------------------------
      */

      const backendProject = data.project;

      const newProject: Project = {
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

        techStack: [tech],

        agentsActive: 1,

        membersOnline: 1,

        files:
          backendProject._count?.files ?? 0,

        tasks: 0,

        pendingTasks: 0,

        archived: false,
      };

      /*
      |--------------------------------------------------------------------------
      | Send Created Project to Parent
      |--------------------------------------------------------------------------
      */

      onCreate(newProject);

      /*
      |--------------------------------------------------------------------------
      | Reset Form
      |--------------------------------------------------------------------------
      */

      setName("");
      setDescription("");
      setTech("Next.js");
      setError("");
    } catch (error) {
      console.error("Create Project Error:", error);

      setError(
        error instanceof Error
          ? error.message
          : "Failed to create project."
      );
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={() => {
          if (!isCreating) {
            onClose();
          }
        }}
        className="
          fixed
          inset-0
          z-50
          bg-black/70
          backdrop-blur-sm
        "
      />

      {/* Modal */}
      <div
        className="
          fixed
          left-1/2
          top-1/2
          z-50
          w-full
          max-w-2xl
          -translate-x-1/2
          -translate-y-1/2
          rounded-3xl
          border
          border-white/10
          bg-[#111827]
          shadow-2xl
        "
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 p-6">
          <div>
            <h2 className="text-2xl font-bold text-white">
              Create New Project
            </h2>

            <p className="mt-1 text-slate-400">
              Start building your next AI powered application.
            </p>
          </div>

          <button
            onClick={() => {
              if (!isCreating) {
                onClose();
              }
            }}
            disabled={isCreating}
            className="
              rounded-xl
              p-2
              transition
              hover:bg-white/10
              disabled:cursor-not-allowed
              disabled:opacity-50
            "
          >
            <X className="text-white" />
          </button>
        </div>

        {/* Body */}
        <div className="space-y-6 p-6">
          {/* Project Name */}
          <div>
            <label className="mb-2 block text-sm font-medium text-white">
              Project Name
            </label>

            <input
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setError("");
              }}
              placeholder="Enter project name"
              disabled={isCreating}
              className="
                w-full
                rounded-xl
                border
                border-white/10
                bg-[#0F172A]
                px-4
                py-3
                text-white
                outline-none
                transition
                focus:border-cyan-500
                disabled:cursor-not-allowed
                disabled:opacity-60
              "
            />
          </div>

          {/* Description */}
          <div>
            <label className="mb-2 block text-sm font-medium text-white">
              Description
            </label>

            <textarea
              rows={4}
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
                setError("");
              }}
              placeholder="Describe your project..."
              disabled={isCreating}
              className="
                w-full
                rounded-xl
                border
                border-white/10
                bg-[#0F172A]
                px-4
                py-3
                text-white
                outline-none
                transition
                focus:border-cyan-500
                disabled:cursor-not-allowed
                disabled:opacity-60
              "
            />
          </div>

          {/* Tech Stack */}
          <div>
            <label className="mb-2 block text-sm font-medium text-white">
              Tech Stack
            </label>

            <select
              value={tech}
              onChange={(e) =>
                setTech(e.target.value)
              }
              disabled={isCreating}
              className="
                w-full
                rounded-xl
                border
                border-white/10
                bg-[#0F172A]
                px-4
                py-3
                text-white
                outline-none
                focus:border-cyan-500
                disabled:cursor-not-allowed
                disabled:opacity-60
              "
            >
              <option>Next.js</option>
              <option>React</option>
              <option>Node.js</option>
              <option>Python</option>
              <option>Java</option>
              <option>Blockchain</option>
            </select>
          </div>

          {/* Visibility */}
          <div>
            <label className="mb-2 block text-sm font-medium text-white">
              Visibility
            </label>

            <select
              disabled={isCreating}
              className="
                w-full
                rounded-xl
                border
                border-white/10
                bg-[#0F172A]
                px-4
                py-3
                text-white
                outline-none
                focus:border-cyan-500
                disabled:cursor-not-allowed
                disabled:opacity-60
              "
            >
              <option>Private</option>
              <option>Team</option>
              <option>Public</option>
            </select>
          </div>

          {/* Error */}
          {error && (
            <div
              className="
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
              {error}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 border-t border-white/10 p-6">
          <button
            onClick={onClose}
            disabled={isCreating}
            className="
              rounded-xl
              border
              border-white/10
              px-5
              py-3
              text-white
              transition
              hover:bg-white/10
              disabled:cursor-not-allowed
              disabled:opacity-50
            "
          >
            Cancel
          </button>

          <button
            onClick={handleCreateProject}
            disabled={isCreating}
            className="
              flex
              items-center
              gap-2
              rounded-xl
              bg-cyan-500
              px-5
              py-3
              font-semibold
              text-black
              transition
              hover:bg-cyan-400
              disabled:cursor-not-allowed
              disabled:opacity-60
            "
          >
            {isCreating && (
              <Loader2 className="h-4 w-4 animate-spin" />
            )}

            {isCreating
              ? "Creating..."
              : "Create Project"}
          </button>
        </div>
      </div>
    </>
  );
}