"use client";

import { useEffect, useState } from "react";
import { Plus, Sparkles } from "lucide-react";
import { toast } from "sonner";

import TaskStats from "../TaskStats";
import TaskToolbar from "./TaskToolbar";

import {
  DndContext,
  closestCenter,
  DragEndEvent,
} from "@dnd-kit/core";

import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

import TaskColumn from "./TaskColumn";
import AddTaskModal from "./AddTaskModal";
import EditTaskModal from "./EditTaskModal";
import AITaskGenerator from "./AITaskGenerator";

import {
  tasks as defaultTasks,
  type Task,
} from "@/data/tasks";

export default function TaskBoard() {
  // =============================
  // Search & Filters
  // =============================

  const [search, setSearch] = useState("");
  const [priority, setPriority] = useState("All");
  const [status, setStatus] = useState("All");

  // =============================
  // Tasks
  // =============================

  const [tasks, setTasks] =
    useState<Task[]>(defaultTasks);

  // =============================
  // Mounted
  // =============================

  const [mounted, setMounted] =
    useState(false);

  // =============================
  // Add Task Modal
  // =============================

  const [open, setOpen] =
    useState(false);

  // =============================
  // Edit Task Modal
  // =============================

  const [editOpen, setEditOpen] =
    useState(false);

  const [selectedTask, setSelectedTask] =
    useState<Task | null>(null);

  // =============================
  // AI Task Generator
  // =============================

  const [aiOpen, setAiOpen] =
    useState(false);

  // =============================
  // Load Tasks
  // =============================

  useEffect(() => {
    setMounted(true);

    const saved =
      localStorage.getItem("tasks");

    if (saved) {
      try {
        const parsedTasks =
          JSON.parse(saved);

        if (Array.isArray(parsedTasks)) {
          setTasks(parsedTasks);
        }
      } catch (error) {
        console.error(
          "Failed to load tasks:",
          error
        );
      }
    }
  }, []);

  // =============================
  // Save Tasks
  // =============================

  useEffect(() => {
    if (!mounted) return;

    localStorage.setItem(
      "tasks",
      JSON.stringify(tasks)
    );
  }, [tasks, mounted]);

  // =============================
  // Prevent Hydration Error
  // =============================

  if (!mounted) {
    return null;
  }

  // =============================
  // Create Single Task
  // =============================

  const createTask = (task: Task) => {
    setTasks((prev) => [
      task,
      ...prev,
    ]);

    toast.success(
      "Task created 🚀"
    );
  };

  // =============================
  // Add AI Generated Tasks
  // =============================

  const addAITasks = (
    generatedTasks: Task[]
  ) => {
    if (
      generatedTasks.length === 0
    ) {
      return;
    }

    setTasks((prev) => [
      ...generatedTasks,
      ...prev,
    ]);

    toast.success(
      `${generatedTasks.length} AI tasks added 🚀`
    );
  };

  // =============================
  // Delete Task
  // =============================

  const deleteTask = (
    id: string
  ) => {
    setTasks((prev) =>
      prev.filter(
        (task) =>
          task.id !== id
      )
    );

    toast.error(
      "Task deleted 🗑"
    );
  };

  // =============================
  // Update Task
  // =============================

  const updateTask = (
    updatedTask: Task
  ) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id ===
        updatedTask.id
          ? updatedTask
          : task
      )
    );

    toast.success(
      "Task updated ✨"
    );
  };

  // =============================
  // Drag & Drop
  // =============================

  const handleDragEnd = (
    event: DragEndEvent
  ) => {
    const {
      active,
      over,
    } = event;

    if (!over) {
      return;
    }

    const taskId =
      active.id as string;

    const newStatus =
      over.id as Task["status"];

    const validStatuses:
      Task["status"][] = [
        "Todo",
        "In Progress",
        "Review",
        "Done",
      ];

    if (
      !validStatuses.includes(
        newStatus
      )
    ) {
      return;
    }

    setTasks((prev) =>
      prev.map((task) =>
        task.id === taskId
          ? {
              ...task,
              status:
                newStatus,
            }
          : task
      )
    );

    toast.success(
      `Moved to ${newStatus} 🚀`
    );
  };

  // =============================
  // Search + Filters
  // =============================

  const filteredTasks =
    tasks.filter((task) => {
      const matchesSearch =
        task.title
          .toLowerCase()
          .includes(
            search.toLowerCase()
          );

      const matchesPriority =
        priority === "All" ||
        task.priority ===
          priority;

      const matchesStatus =
        status === "All" ||
        task.status ===
          status;

      return (
        matchesSearch &&
        matchesPriority &&
        matchesStatus
      );
    });

  // =============================
  // Columns
  // =============================

  const todo =
    filteredTasks.filter(
      (task) =>
        task.status ===
        "Todo"
    );

  const progress =
    filteredTasks.filter(
      (task) =>
        task.status ===
        "In Progress"
    );

  const review =
    filteredTasks.filter(
      (task) =>
        task.status ===
        "Review"
    );

  const done =
    filteredTasks.filter(
      (task) =>
        task.status ===
        "Done"
    );

  // =============================
  // Open Edit Modal
  // =============================

  const openEditModal = (
    task: Task
  ) => {
    setSelectedTask(task);
    setEditOpen(true);
  };

  // =============================
  // Render
  // =============================

  return (
    <section className="mt-10">

      {/* =============================
          HEADER
      ============================= */}

      <div
        className="
          mb-8
          flex
          flex-col
          gap-5
          lg:flex-row
          lg:items-center
          lg:justify-between
        "
      >

        <div>
          <h2 className="text-3xl font-bold text-white">
            Project Tasks
          </h2>

          <p className="mt-2 text-slate-400">
            Manage project workflow
            using Kanban Board.
          </p>
        </div>

        {/* Buttons */}

        <div
          className="
            flex
            flex-col
            gap-3
            sm:flex-row
          "
        >

          {/* AI Generator */}

          <button
            type="button"
            onClick={() =>
              setAiOpen(true)
            }
            className="
              flex
              items-center
              justify-center
              gap-2
              rounded-xl
              border
              border-cyan-500/30
              bg-cyan-500/10
              px-5
              py-3
              font-semibold
              text-cyan-400
              transition
              hover:border-cyan-400/50
              hover:bg-cyan-500/20
              hover:text-cyan-300
            "
          >
            <Sparkles size={18} />

            AI Generate
          </button>

          {/* Add Task */}

          <button
            type="button"
            onClick={() =>
              setOpen(true)
            }
            className="
              flex
              items-center
              justify-center
              gap-2
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
            <Plus size={18} />

            Add Task
          </button>

        </div>
      </div>

      {/* =============================
          TASK STATISTICS
      ============================= */}

      <TaskStats
        tasks={tasks}
      />

      {/* =============================
          TOOLBAR
      ============================= */}

      <TaskToolbar
        search={search}
        setSearch={setSearch}
        priority={priority}
        setPriority={setPriority}
        status={status}
        setStatus={setStatus}
      />

      {/* =============================
          KANBAN BOARD
      ============================= */}

      <DndContext
        collisionDetection={
          closestCenter
        }
        onDragEnd={
          handleDragEnd
        }
      >

        <div
          className="
            grid
            gap-6
            md:grid-cols-2
            xl:grid-cols-4
          "
        >

          {/* TODO */}

          <SortableContext
            items={todo.map(
              (task) =>
                task.id
            )}
            strategy={
              verticalListSortingStrategy
            }
          >
            <TaskColumn
              title="Todo"
              tasks={todo}
              onEdit={
                openEditModal
              }
              onDelete={
                deleteTask
              }
            />
          </SortableContext>

          {/* IN PROGRESS */}

          <SortableContext
            items={progress.map(
              (task) =>
                task.id
            )}
            strategy={
              verticalListSortingStrategy
            }
          >
            <TaskColumn
              title="In Progress"
              tasks={progress}
              onEdit={
                openEditModal
              }
              onDelete={
                deleteTask
              }
            />
          </SortableContext>

          {/* REVIEW */}

          <SortableContext
            items={review.map(
              (task) =>
                task.id
            )}
            strategy={
              verticalListSortingStrategy
            }
          >
            <TaskColumn
              title="Review"
              tasks={review}
              onEdit={
                openEditModal
              }
              onDelete={
                deleteTask
              }
            />
          </SortableContext>

          {/* DONE */}

          <SortableContext
            items={done.map(
              (task) =>
                task.id
            )}
            strategy={
              verticalListSortingStrategy
            }
          >
            <TaskColumn
              title="Done"
              tasks={done}
              onEdit={
                openEditModal
              }
              onDelete={
                deleteTask
              }
            />
          </SortableContext>

        </div>

      </DndContext>

      {/* =============================
          ADD TASK MODAL
      ============================= */}

      <AddTaskModal
        open={open}
        onClose={() =>
          setOpen(false)
        }
        onCreate={
          createTask
        }
      />

      {/* =============================
          EDIT TASK MODAL
      ============================= */}

      <EditTaskModal
        open={editOpen}
        task={selectedTask}
        onClose={() => {
          setEditOpen(false);
          setSelectedTask(null);
        }}
        onSave={
          updateTask
        }
      />

      {/* =============================
          AI TASK GENERATOR
      ============================= */}

      <AITaskGenerator
        open={aiOpen}
        onClose={() =>
          setAiOpen(false)
        }
        onAddTasks={
          addAITasks
        }
      />

    </section>
  );
}