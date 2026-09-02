"use client";

import { useMemo, useState } from "react";

import {
  User,
  MoreVertical,
  Pencil,
  Trash2,
  GripVertical,
  CalendarDays,
} from "lucide-react";

import { CSS } from "@dnd-kit/utilities";
import { useSortable } from "@dnd-kit/sortable";

import { Task } from "@/data/tasks";

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
}

export default function TaskCard({
  task,
  onEdit,
  onDelete,
}: TaskCardProps) {
  const [menuOpen, setMenuOpen] =
    useState(false);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
  });

  const style = {
    transform:
      CSS.Transform.toString(transform),
    transition,
  };

  const priorityColor = {
    High:
      "bg-red-500/20 text-red-400",
    Medium:
      "bg-yellow-500/20 text-yellow-400",
    Low:
      "bg-emerald-500/20 text-emerald-400",
  };

  const dueInfo = useMemo(() => {
    if (!task.dueDate) {
      return {
        text: "No Due Date",
        color: "text-slate-400",
      };
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const due = new Date(task.dueDate);
    due.setHours(0, 0, 0, 0);

    const diff = Math.ceil(
      (due.getTime() -
        today.getTime()) /
        (1000 * 60 * 60 * 24)
    );

    if (diff < 0) {
      return {
        text: `Overdue by ${Math.abs(
          diff
        )} day${Math.abs(diff) > 1 ? "s" : ""}`,
        color: "text-red-400",
      };
    }

    if (diff === 0) {
      return {
        text: "Due Today",
        color: "text-yellow-400",
      };
    }

    return {
      text: `${diff} day${
        diff > 1 ? "s" : ""
      } left`,
      color: "text-emerald-400",
    };
  }, [task.dueDate]);

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`
        relative
        rounded-2xl
        border
        border-white/10
        bg-[#111827]
        p-4
        transition-all
        duration-300
        hover:border-cyan-500/30
        hover:-translate-y-1
        hover:shadow-xl
        ${
          isDragging
            ? "scale-95 opacity-60"
            : ""
        }
      `}
    >
      {/* Header */}

      <div className="flex items-start justify-between">

        <div className="flex items-start gap-3">

          {/* Drag Handle */}

          <button
            {...attributes}
            {...listeners}
            className="
              mt-1
              cursor-grab
              rounded-lg
              p-1
              text-slate-500
              transition
              hover:bg-white/5
              hover:text-cyan-400
              active:cursor-grabbing
            "
          >
            <GripVertical size={18} />
          </button>

          <div>

            <h3 className="text-lg font-semibold text-white">
              {task.title}
            </h3>

            <p className="mt-2 text-sm text-slate-400">
              {task.description}
            </p>

          </div>

        </div>

        {/* Menu */}

        <button
          onClick={(e) => {
            e.stopPropagation();
            setMenuOpen(!menuOpen);
          }}
          className="
            rounded-lg
            p-2
            text-slate-400
            transition
            hover:bg-white/5
            hover:text-white
          "
        >
          <MoreVertical size={18} />
        </button>

      </div>

      {/* Dropdown */}

      {menuOpen && (
        <div
          className="
            absolute
            right-3
            top-12
            z-50
            w-44
            overflow-hidden
            rounded-xl
            border
            border-white/10
            bg-[#0F172A]
            shadow-xl
          "
        >
          <button
            onClick={() => {
              onEdit(task);
              setMenuOpen(false);
            }}
            className="
              flex
              w-full
              items-center
              gap-3
              px-4
              py-3
              text-left
              text-slate-300
              transition
              hover:bg-cyan-500/10
              hover:text-cyan-400
            "
          >
            <Pencil size={16} />
            Edit Task
          </button>

          <button
            onClick={() => {
              onDelete(task.id);
              setMenuOpen(false);
            }}
            className="
              flex
              w-full
              items-center
              gap-3
              px-4
              py-3
              text-left
              text-red-400
              transition
              hover:bg-red-500/10
            "
          >
            <Trash2 size={16} />
            Delete Task
          </button>
        </div>
      )}

      {/* Due Date */}

      <div className="mt-4 rounded-xl bg-[#0F172A] p-3">

        <div className="flex items-center gap-2 text-sm text-slate-300">
          <CalendarDays size={16} />

          <span>
            {task.dueDate
              ? new Date(
                  task.dueDate
                ).toLocaleDateString()
              : "No Due Date"}
          </span>
        </div>

        <p
          className={`mt-2 text-sm font-medium ${dueInfo.color}`}
        >
          {dueInfo.text}
        </p>

      </div>

      {/* Footer */}

      <div className="mt-5 flex items-center justify-between">

        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold ${
            priorityColor[task.priority]
          }`}
        >
          {task.priority}
        </span>

        <div className="flex items-center gap-2 text-slate-400">

          <User size={16} />

          <span className="text-sm">
            {task.assignee}
          </span>

        </div>

      </div>

    </div>
  );
}