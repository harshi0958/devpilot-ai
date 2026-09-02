"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { Task } from "@/data/tasks";

interface Props {
  open: boolean;
  onClose: () => void;
  onCreate: (task: Task) => void;
}

export default function AddTaskModal({
  open,
  onClose,
  onCreate,
}: Props) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const [priority, setPriority] =
    useState<Task["priority"]>("Medium");

  const [status, setStatus] =
    useState<Task["status"]>("Todo");

  const [assignee, setAssignee] =
    useState("Harshit");

  const [dueDate, setDueDate] = useState("");

  // -----------------------------
  // Reset Form
  // -----------------------------

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setPriority("Medium");
    setStatus("Todo");
    setAssignee("Harshit");
    setDueDate("");
  };

  // -----------------------------
  // Close Modal
  // -----------------------------

  const closeModal = () => {
    resetForm();
    onClose();
  };

  // -----------------------------
  // Create Task
  // -----------------------------

  const createTask = () => {
    const cleanTitle = title.trim();
    const cleanDescription = description.trim();
    const cleanAssignee = assignee.trim();

    // Validation
    if (!cleanTitle) {
      return;
    }

    if (!cleanAssignee) {
      return;
    }

    if (!dueDate) {
      return;
    }

    const newTask: Task = {
      id: Date.now().toString(),
      title: cleanTitle,
      description: cleanDescription,
      priority,
      status,
      assignee: cleanAssignee,
      dueDate,
    };

    onCreate(newTask);

    resetForm();
    onClose();
  };

  if (!open) {
    return null;
  }

  return (
    <div
      className="
        fixed
        inset-0
        z-50
        flex
        items-center
        justify-center
        bg-black/60
        p-4
        backdrop-blur-sm
      "
    >
      <div
        className="
          w-full
          max-w-2xl
          rounded-3xl
          border
          border-white/10
          bg-[#111827]
          p-8
          shadow-2xl
        "
      >

        {/* ================= HEADER ================= */}

        <div className="mb-6 flex items-center justify-between">

          <div>
            <h2 className="text-2xl font-bold text-white">
              Create Task
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Add a new task to your project workflow.
            </p>
          </div>

          <button
            type="button"
            onClick={closeModal}
            className="
              rounded-lg
              p-2
              text-slate-400
              transition
              hover:bg-white/10
              hover:text-white
            "
          >
            <X size={20} />
          </button>

        </div>

        {/* ================= FORM ================= */}

        <div className="space-y-5">

          {/* Task Title */}

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-300">
              Task Title
            </label>

            <input
              type="text"
              value={title}
              onChange={(e) =>
                setTitle(e.target.value)
              }
              placeholder="Enter task title"
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
                placeholder:text-slate-600
                focus:border-cyan-500
              "
            />
          </div>

          {/* Description */}

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-300">
              Description
            </label>

            <textarea
              rows={4}
              value={description}
              onChange={(e) =>
                setDescription(e.target.value)
              }
              placeholder="Describe what needs to be done..."
              className="
                w-full
                resize-none
                rounded-xl
                border
                border-white/10
                bg-[#0F172A]
                px-4
                py-3
                text-white
                outline-none
                transition
                placeholder:text-slate-600
                focus:border-cyan-500
              "
            />
          </div>

          {/* Priority + Status */}

          <div className="grid gap-4 md:grid-cols-2">

            {/* Priority */}

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Priority
              </label>

              <select
                value={priority}
                onChange={(e) =>
                  setPriority(
                    e.target.value as Task["priority"]
                  )
                }
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
                <option value="High">
                  High
                </option>

                <option value="Medium">
                  Medium
                </option>

                <option value="Low">
                  Low
                </option>
              </select>
            </div>

            {/* Status */}

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Status
              </label>

              <select
                value={status}
                onChange={(e) =>
                  setStatus(
                    e.target.value as Task["status"]
                  )
                }
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
                <option value="Todo">
                  Todo
                </option>

                <option value="In Progress">
                  In Progress
                </option>

                <option value="Review">
                  Review
                </option>

                <option value="Done">
                  Done
                </option>
              </select>
            </div>

          </div>

          {/* Assignee + Due Date */}

          <div className="grid gap-4 md:grid-cols-2">

            {/* Assignee */}

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Assignee
              </label>

              <input
                type="text"
                value={assignee}
                onChange={(e) =>
                  setAssignee(e.target.value)
                }
                placeholder="Enter assignee"
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
                  placeholder:text-slate-600
                  focus:border-cyan-500
                "
              />
            </div>

            {/* Due Date */}

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Due Date
              </label>

              <input
                type="date"
                value={dueDate}
                onChange={(e) =>
                  setDueDate(e.target.value)
                }
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

          </div>

        </div>

        {/* ================= FOOTER ================= */}

        <div className="mt-8 flex justify-end gap-3">

          <button
            type="button"
            onClick={closeModal}
            className="
              rounded-xl
              border
              border-white/10
              px-5
              py-3
              text-white
              transition
              hover:bg-white/5
            "
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={createTask}
            className="
              rounded-xl
              bg-cyan-500
              px-6
              py-3
              font-semibold
              text-black
              transition
              hover:bg-cyan-400
            "
          >
            Create Task
          </button>

        </div>

      </div>
    </div>
  );
}