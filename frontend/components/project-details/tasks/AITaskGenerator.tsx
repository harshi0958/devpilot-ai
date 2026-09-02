"use client";

import { useState } from "react";
import {
  X,
  Sparkles,
  Plus,
  Trash2,
  Loader2,
} from "lucide-react";

import { Task } from "@/data/tasks";

interface AITaskGeneratorProps {
  open: boolean;
  onClose: () => void;
  onAddTasks: (tasks: Task[]) => void;
}

type GeneratedTask = {
  title: string;
  description: string;
  priority: "Low" | "Medium" | "High";
  status: Task["status"];
  assignee: string;
  dueDate: string;
};

export default function AITaskGenerator({
  open,
  onClose,
  onAddTasks,
}: AITaskGeneratorProps) {
  const [prompt, setPrompt] = useState("");

  const [generatedTasks, setGeneratedTasks] =
    useState<GeneratedTask[]>([]);

  const [generating, setGenerating] =
    useState(false);

  const [error, setError] =
    useState("");

  // =================================
  // Generate Tasks using Gemini AI
  // =================================

  const generateTasks = async () => {
    if (!prompt.trim() || generating) return;

    setGenerating(true);
    setError("");
    setGeneratedTasks([]);

    try {
      const response = await fetch(
        "/api/ai-tasks",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            prompt: prompt.trim(),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.error ||
            "Failed to generate tasks."
        );
      }

      if (
        !data.tasks ||
        !Array.isArray(data.tasks)
      ) {
        throw new Error(
          "Invalid response received from AI."
        );
      }

      // =================================
      // Convert Gemini dueDays to dueDate
      // =================================

      const today = new Date();

      const formattedTasks: GeneratedTask[] =
        data.tasks.map(
          (task: {
            title: string;
            description: string;
            priority:
              | "Low"
              | "Medium"
              | "High";
            status: Task["status"];
            assignee: string;
            dueDays: number;
          }) => {
            const dueDate = new Date(today);

            dueDate.setDate(
              dueDate.getDate() +
                task.dueDays
            );

            return {
              title: task.title,

              description:
                task.description,

              priority:
                task.priority,

              status:
                task.status,

              assignee:
                task.assignee?.trim() ||
                "Harshit",

              dueDate: dueDate
                .toISOString()
                .split("T")[0],
            };
          }
        );

      setGeneratedTasks(
        formattedTasks
      );
    } catch (error) {
      console.error(
        "AI Task Generation Error:",
        error
      );

      setError(
        error instanceof Error
          ? error.message
          : "Something went wrong while generating tasks."
      );
    } finally {
      setGenerating(false);
    }
  };

  // =================================
  // Remove Generated Task
  // =================================

  const removeTask = (
    index: number
  ) => {
    setGeneratedTasks((prev) =>
      prev.filter(
        (_, taskIndex) =>
          taskIndex !== index
      )
    );
  };

  // =================================
  // Add Tasks to Kanban Board
  // =================================

  const addTasksToBoard = () => {
    if (
      generatedTasks.length === 0
    ) {
      return;
    }

    const tasks: Task[] =
      generatedTasks.map(
        (task) => ({
          id: `${Date.now()}-${Math.random()
            .toString(36)
            .substring(2, 9)}`,

          title: task.title,

          description:
            task.description,

          priority:
            task.priority,

          status:
            task.status,

          assignee:
            task.assignee,

          dueDate:
            task.dueDate,
        })
      );

    onAddTasks(tasks);

    setGeneratedTasks([]);
    setPrompt("");
    setError("");

    onClose();
  };

  // =================================
  // Close Modal
  // =================================

  const handleClose = () => {
    if (generating) return;

    setGeneratedTasks([]);
    setPrompt("");
    setError("");

    onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">

      <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-3xl border border-white/10 bg-[#111827] shadow-2xl">

        {/* ================================= */}
        {/* Header */}
        {/* ================================= */}

        <div className="flex items-center justify-between border-b border-white/10 px-6 py-5">

          <div className="flex items-center gap-3">

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-cyan-500/10">

              <Sparkles
                size={22}
                className="text-cyan-400"
              />

            </div>

            <div>

              <h2 className="text-xl font-bold text-white">
                AI Task Generator
              </h2>

              <p className="text-sm text-slate-400">
                Generate project tasks using Gemini AI
              </p>

            </div>

          </div>

          <button
            onClick={handleClose}
            disabled={generating}
            className="rounded-xl p-2 text-slate-400 transition hover:bg-white/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            <X size={20} />
          </button>

        </div>

        {/* ================================= */}
        {/* Content */}
        {/* ================================= */}

        <div className="space-y-6 p-6">

          {/* Prompt */}

          <div>

            <label className="mb-2 block text-sm font-medium text-slate-300">
              Describe what you want to build
            </label>

            <textarea
              rows={4}
              value={prompt}
              onChange={(e) =>
                setPrompt(
                  e.target.value
                )
              }
              disabled={generating}
              placeholder="Example: Build an e-commerce website with authentication, products, cart, payments and admin dashboard..."
              className="w-full resize-none rounded-2xl border border-white/10 bg-[#0F172A] px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-500 disabled:cursor-not-allowed disabled:opacity-60"
            />

          </div>

          {/* Error */}

          {error && (
            <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
              {error}
            </div>
          )}

          {/* Generate Button */}

          <button
            onClick={generateTasks}
            disabled={
              !prompt.trim() ||
              generating
            }
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-cyan-500 px-5 py-3 font-semibold text-black transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-50"
          >

            {generating ? (
              <>
                <Loader2
                  size={18}
                  className="animate-spin"
                />

                Generating Tasks...
              </>
            ) : (
              <>
                <Sparkles size={18} />

                Generate Tasks
              </>
            )}

          </button>

          {/* ================================= */}
          {/* Generated Tasks */}
          {/* ================================= */}

          {generatedTasks.length > 0 && (

            <div className="space-y-4">

              {/* Generated Tasks Header */}

              <div className="flex items-center justify-between">

                <div>

                  <h3 className="font-semibold text-white">
                    Generated Tasks
                  </h3>

                  <p className="text-sm text-slate-400">
                    Review the AI-generated tasks before adding them.
                  </p>

                </div>

                <span className="rounded-full bg-cyan-500/20 px-3 py-1 text-xs font-semibold text-cyan-400">
                  {generatedTasks.length} Tasks
                </span>

              </div>

              {/* Task List */}

              <div className="space-y-3">

                {generatedTasks.map(
                  (task, index) => (

                    <div
                      key={`${task.title}-${index}`}
                      className="rounded-2xl border border-white/10 bg-[#0F172A] p-4 transition hover:border-cyan-500/20"
                    >

                      <div className="flex items-start justify-between gap-4">

                        <div className="flex-1">

                          <h4 className="font-semibold text-white">
                            {task.title}
                          </h4>

                          <p className="mt-1 text-sm leading-6 text-slate-400">
                            {task.description}
                          </p>

                          <div className="mt-3 flex flex-wrap items-center gap-2">

                            {/* Priority */}

                            <span
                              className={`rounded-full px-3 py-1 text-xs font-semibold ${
                                task.priority ===
                                "High"
                                  ? "bg-red-500/20 text-red-400"
                                  : task.priority ===
                                      "Medium"
                                    ? "bg-yellow-500/20 text-yellow-400"
                                    : "bg-emerald-500/20 text-emerald-400"
                              }`}
                            >
                              {task.priority}
                            </span>

                            {/* Status */}

                            <span className="rounded-full bg-cyan-500/10 px-3 py-1 text-xs font-medium text-cyan-400">
                              {task.status}
                            </span>

                            {/* Assignee */}

                            <span className="rounded-full bg-white/5 px-3 py-1 text-xs text-slate-400">
                              {task.assignee}
                            </span>

                            {/* Due Date */}

                            <span className="rounded-full bg-white/5 px-3 py-1 text-xs text-slate-400">
                              Due:{" "}
                              {task.dueDate}
                            </span>

                          </div>

                        </div>

                        {/* Remove */}

                        <button
                          onClick={() =>
                            removeTask(index)
                          }
                          className="rounded-lg p-2 text-slate-500 transition hover:bg-red-500/10 hover:text-red-400"
                          title="Remove task"
                        >
                          <Trash2 size={17} />
                        </button>

                      </div>

                    </div>

                  )
                )}

              </div>

              {/* Add Tasks */}

              <button
                onClick={
                  addTasksToBoard
                }
                disabled={
                  generatedTasks.length ===
                  0
                }
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-500 px-5 py-3 font-semibold text-black transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-50"
              >

                <Plus size={18} />

                Add Tasks to Board

              </button>

            </div>

          )}

        </div>

      </div>

    </div>
  );
}