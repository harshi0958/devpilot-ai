"use client";

import { X } from "lucide-react";
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
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm"
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
            onClick={onClose}
            className="
              rounded-xl
              p-2
              transition
              hover:bg-white/10
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
               onChange={(e) => setName(e.target.value)}
              placeholder="Enter project name"
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
  onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe your project..."
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
  onChange={(e) => setTech(e.target.value)}
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
              "
            >
              <option>Private</option>
              <option>Team</option>
              <option>Public</option>
            </select>
          </div>

        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 border-t border-white/10 p-6">

          <button
            onClick={onClose}
            className="
              rounded-xl
              border
              border-white/10
              px-5
              py-3
              text-white
              transition
              hover:bg-white/10
            "
          >
            Cancel
          </button>

          <button
  onClick={() => {
    if (!name.trim()) return;

    onCreate({
  id: name.toLowerCase().replace(/\s+/g, "-"),

  name,

  description,

  status: "Building",

  progress: 0,

  members: 1,

  agents: 1,

  github: "",

  deployment: "",

  techStack: [tech],

  agentsActive: 1,

  membersOnline: 1,

  files: 0,

  tasks: 0,

  pendingTasks: 0,
  archived: false,
});

    setName("");
    setDescription("");
    setTech("Next.js");

    onClose();
  }}
  className="
    rounded-xl
    bg-cyan-500
    px-5
    py-3
    font-semibold
    text-black
    transition
    hover:bg-cyan-400
  "
>
  Create Project
</button>

        </div>

      </div>
    </>
  );
}