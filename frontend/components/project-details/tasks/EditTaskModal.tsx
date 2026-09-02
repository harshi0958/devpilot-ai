"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { Task } from "@/data/tasks";

interface EditTaskModalProps {
  open: boolean;
  task: Task | null;
  onClose: () => void;
  onSave: (task: Task) => void;
}

export default function EditTaskModal({
  open,
  task,
  onClose,
  onSave,
}: EditTaskModalProps) {
  const [form, setForm] = useState<Task | null>(null);

  useEffect(() => {
    if (task) {
      setForm({
        ...task,
        id: task.id ?? "",
        title: task.title ?? "",
        description: task.description ?? "",
        priority: task.priority ?? "Medium",
        assignee: task.assignee ?? "",
        status: task.status ?? "Todo",
        dueDate: task.dueDate ?? "",
      });
    } else {
      setForm(null);
    }
  }, [task]);

  if (!open || !form) return null;

  const saveChanges = () => {
    if (!form.title.trim()) {
      return;
    }

    if (!form.assignee.trim()) {
      return;
    }

    if (!form.dueDate) {
      return;
    }

    onSave({
      ...form,
      title: form.title.trim(),
      description: form.description.trim(),
      assignee: form.assignee.trim(),
      dueDate: form.dueDate,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">

      <div className="w-full max-w-2xl rounded-3xl border border-white/10 bg-[#111827] p-8 shadow-2xl">

        {/* Header */}

        <div className="mb-6 flex items-center justify-between">

          <h2 className="text-2xl font-bold text-white">
            Edit Task
          </h2>

          <button
            type="button"
            onClick={onClose}
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

        {/* Form */}

        <div className="space-y-5">

          {/* Title */}

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-300">
              Task Title
            </label>

            <input
              type="text"
              value={form.title ?? ""}
              onChange={(e) =>
                setForm((prev) =>
                  prev
                    ? {
                        ...prev,
                        title: e.target.value,
                      }
                    : prev
                )
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
              value={form.description ?? ""}
              onChange={(e) =>
                setForm((prev) =>
                  prev
                    ? {
                        ...prev,
                        description: e.target.value,
                      }
                    : prev
                )
              }
              placeholder="Describe the task"
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

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Priority
              </label>

              <select
                value={form.priority ?? "Medium"}
                onChange={(e) =>
                  setForm((prev) =>
                    prev
                      ? {
                          ...prev,
                          priority:
                            e.target
                              .value as Task["priority"],
                        }
                      : prev
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

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Status
              </label>

              <select
                value={form.status ?? "Todo"}
                onChange={(e) =>
                  setForm((prev) =>
                    prev
                      ? {
                          ...prev,
                          status:
                            e.target
                              .value as Task["status"],
                        }
                      : prev
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

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Assignee
              </label>

              <input
                type="text"
                value={form.assignee ?? ""}
                onChange={(e) =>
                  setForm((prev) =>
                    prev
                      ? {
                          ...prev,
                          assignee:
                            e.target.value,
                        }
                      : prev
                  )
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

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Due Date
              </label>

              <input
                type="date"
                value={form.dueDate ?? ""}
                onChange={(e) =>
                  setForm((prev) =>
                    prev
                      ? {
                          ...prev,
                          dueDate:
                            e.target.value,
                        }
                      : prev
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
                  transition
                  focus:border-cyan-500
                "
              />
            </div>

          </div>

        </div>

        {/* Footer */}

        <div className="mt-8 flex justify-end gap-3">

          <button
            type="button"
            onClick={onClose}
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
            onClick={saveChanges}
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
            Save Changes
          </button>

        </div>

      </div>

    </div>
  );
}