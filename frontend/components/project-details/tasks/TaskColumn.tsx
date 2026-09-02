"use client";

import { useDroppable } from "@dnd-kit/core";

import { Task } from "@/data/tasks";
import TaskCard from "./TaskCard";

interface TaskColumnProps {
  title: Task["status"];
  tasks: Task[];

  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
}

export default function TaskColumn({
  title,
  tasks,
  onEdit,
  onDelete,
}: TaskColumnProps) {
  const {
    setNodeRef,
    isOver,
  } = useDroppable({
    id: title,
  });

  return (
    <div
      ref={setNodeRef}
      className={`
        rounded-3xl
        border
        p-5
        transition-all
        duration-300
        min-h-125

        ${
          isOver
            ? "border-cyan-400 bg-cyan-500/10"
            : "border-white/10 bg-[#0F172A]"
        }
      `}
    >
      {/* Header */}

      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-lg font-bold text-white">
          {title}
        </h2>

        <span
          className="
            rounded-full
            bg-cyan-500/20
            px-3
            py-1
            text-sm
            font-semibold
            text-cyan-400
          "
        >
          {tasks.length}
        </span>
      </div>

      {/* Tasks */}

      <div className="space-y-4">
        {tasks.length === 0 ? (
          <div
            className="
              flex
              h-40
              items-center
              justify-center
              rounded-xl
              border
              border-dashed
              border-white/10
              text-sm
              text-slate-500
            "
          >
            Drop Task Here
          </div>
        ) : (
          tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))
        )}
      </div>
    </div>
  );
}