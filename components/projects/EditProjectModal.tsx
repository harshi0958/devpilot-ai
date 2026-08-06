"use client";

import { useEffect, useState } from "react";
import { type Project } from "@/data/projects";

interface EditProjectModalProps {
  isOpen: boolean;
  project: Project | null;
  onClose: () => void;
  onSave: (project: Project) => void;
}

export default function EditProjectModal({
  isOpen,
  project,
  onClose,
  onSave,
}: EditProjectModalProps) {
  const [formData, setFormData] = useState<Project | null>(null);

  useEffect(() => {
    if (project) {
      setFormData(project);
    }
  }, [project]);

  if (!isOpen || !formData) return null;

  return (
    <>
      <div
        onClick={onClose}
        className="fixed inset-0 z-50 bg-black/70"
      />

      <div className="fixed left-1/2 top-1/2 z-50 w-full max-w-xl -translate-x-1/2 -translate-y-1/2 rounded-3xl border border-white/10 bg-[#111827] p-6">

        <h2 className="mb-6 text-2xl font-bold text-white">
          Edit Project
        </h2>

        <div className="space-y-5">

          <input
            value={formData.name}
            onChange={(e) =>
              setFormData({
                ...formData,
                name: e.target.value,
              })
            }
            className="w-full rounded-xl bg-[#0F172A] p-3 text-white"
          />

          <textarea
            rows={4}
            value={formData.description}
            onChange={(e) =>
              setFormData({
                ...formData,
                description: e.target.value,
              })
            }
            className="w-full rounded-xl bg-[#0F172A] p-3 text-white"
          />

          <select
            value={formData.status}
            onChange={(e) =>
              setFormData({
                ...formData,
                status: e.target.value as Project["status"],
              })
            }
            className="w-full rounded-xl bg-[#0F172A] p-3 text-white"
          >
            <option>Running</option>
            <option>Building</option>
            <option>Testing</option>
            <option>Completed</option>
          </select>

          <input
            type="range"
            min={0}
            max={100}
            value={formData.progress}
            onChange={(e) =>
              setFormData({
                ...formData,
                progress: Number(e.target.value),
              })
            }
            className="w-full"
          />

          <p className="text-cyan-400">
            {formData.progress}%
          </p>

        </div>

        <div className="mt-8 flex justify-end gap-3">

          <button
            onClick={onClose}
            className="rounded-xl border border-white/10 px-5 py-3 text-white"
          >
            Cancel
          </button>

          <button
            onClick={() => {
              onSave(formData);
              onClose();
            }}
            className="rounded-xl bg-cyan-500 px-5 py-3 font-semibold text-black"
          >
            Save
          </button>

        </div>

      </div>
    </>
  );
}