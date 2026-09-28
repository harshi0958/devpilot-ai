"use client";

import { useEffect, useState } from "react";
import {
  Activity,
  Bot,
  Loader2,
  Send,
  Sparkles,
  X,
} from "lucide-react";

import type {
  AgentStatus,
  AgentType,
} from "./AgentCard";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface AgentWorkspaceProps {
  agentId: string;
  name: string;
  description: string;
  type: AgentType;
  status: AgentStatus;
  onClose: () => void;
}

interface AgentHistoryItem {
  id: string;
  agentId: string;
  agentName: string;
  agentType: AgentType;
  prompt: string;
  response: string;
  projectContext: string;
  createdAt: string;
}

// ============================================================
// AGENT INSTRUCTIONS
// ============================================================

const agentInstructions: Record<AgentType, string> = {
  architect:
    "You are a senior software architect. Analyze the user's software project and provide a practical architecture, modules, database design, APIs, technology recommendations, and development plan.",

  developer:
    "You are an expert software developer. Analyze the user's development request and provide practical implementation guidance, code structure, algorithms, APIs, and code examples when appropriate.",

  uiux:
    "You are a senior UI/UX designer. Analyze the user's project and provide modern interface structure, user flows, component ideas, accessibility recommendations, and responsive design guidance.",

  debugger:
    "You are an expert debugging agent. Analyze the user's error, code, or technical problem, identify the likely root cause, and provide clear step-by-step fixes.",

  testing:
    "You are a senior software testing engineer. Analyze the user's project and generate practical test scenarios, test cases, edge cases, validation strategies, and quality recommendations.",

  documentation:
    "You are a technical documentation expert. Analyze the user's project and create clear technical documentation, README sections, API documentation, setup instructions, and usage guidance.",
};

// ============================================================
// PROJECT CONTEXT EXAMPLES
// ============================================================

const projectExamples = {
  none: "",

  webapp: `Project Type: Full-stack Web Application
Frontend: Next.js / React / TypeScript
Backend: Node.js / API
Database: PostgreSQL
Authentication: JWT
Deployment: Vercel`,

  java: `Project Type: Java Full-Stack Application
Frontend: HTML / CSS / JavaScript
Backend: Java / Spring Boot
Database: MySQL
Authentication: JWT
Architecture: REST API`,

  blockchain: `Project Type: Blockchain Application
Frontend: React / Next.js
Backend: Node.js
Blockchain: Ethereum-compatible network
Smart Contracts: Solidity
Wallet: MetaMask
Database: MongoDB`,

  custom: "",
};

// ============================================================
// COMPONENT
// ============================================================

export default function AgentWorkspace({
  agentId,
  name,
  description,
  type,
  status,
  onClose,
}: AgentWorkspaceProps) {
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ==========================================================
  // TASK HISTORY
  // ==========================================================

  const [history, setHistory] =
    useState<AgentHistoryItem[]>([]);

  const [showHistory, setShowHistory] =
    useState(false);

  const historyStorageKey =
    "devpilot-agent-history";

  // ==========================================================
  // PROJECT CONTEXT
  // ==========================================================

  const [projectContext, setProjectContext] =
    useState("");

  const [contextType, setContextType] =
    useState<keyof typeof projectExamples>("none");

  // ==========================================================
  // LOAD TASK HISTORY
  // ==========================================================

  useEffect(() => {
    try {
      const savedHistory =
        localStorage.getItem(historyStorageKey);

      if (!savedHistory) {
        return;
      }

      const parsedHistory =
        JSON.parse(savedHistory);

      if (Array.isArray(parsedHistory)) {
        setHistory(parsedHistory);
      }
    } catch (error) {
      console.error(
        "Failed to load task history:",
        error
      );
    }
  }, []);

  // ==========================================================
  // HANDLE CONTEXT TYPE
  // ==========================================================

  const handleContextTypeChange = (
    value: keyof typeof projectExamples
  ) => {
    setContextType(value);

    if (value === "custom") {
      setProjectContext("");
      return;
    }

    setProjectContext(
      projectExamples[value]
    );
  };

  // ==========================================================
  // SAVE TASK TO HISTORY
  // ==========================================================

  const saveToHistory = (
    taskPrompt: string,
    taskResponse: string,
    context: string
  ) => {
    if (!taskResponse.trim()) {
      return;
    }

    const newHistoryItem: AgentHistoryItem = {
      id: `${Date.now()}-${Math.random()
        .toString(36)
        .substring(2, 9)}`,

      agentId,

      agentName: name,

      agentType: type,

      prompt: taskPrompt,

      response: taskResponse,

      projectContext: context,

      createdAt:
        new Date().toISOString(),
    };

    setHistory((previousHistory) => {
      const updatedHistory = [
        newHistoryItem,
        ...previousHistory,
      ].slice(0, 50);

      try {
        localStorage.setItem(
          historyStorageKey,
          JSON.stringify(updatedHistory)
        );
      } catch (error) {
        console.error(
          "Failed to save task history:",
          error
        );
      }

      return updatedHistory;
    });
  };

  // ==========================================================
  // LOAD HISTORY ITEM
  // ==========================================================

  const loadHistoryItem = (
    item: AgentHistoryItem
  ) => {
    setPrompt(item.prompt);

    setResponse(item.response);

    setProjectContext(
      item.projectContext || ""
    );

    if (item.projectContext) {
      setContextType("custom");
    } else {
      setContextType("none");
    }

    setError("");

    setShowHistory(false);
  };

  // ==========================================================
  // DELETE HISTORY ITEM
  // ==========================================================

  const deleteHistoryItem = (
    id: string
  ) => {
    setHistory((previousHistory) => {
      const updatedHistory =
        previousHistory.filter(
          (item) => item.id !== id
        );

      localStorage.setItem(
        historyStorageKey,
        JSON.stringify(updatedHistory)
      );

      return updatedHistory;
    });
  };

  // ==========================================================
  // CLEAR ALL HISTORY
  // ==========================================================

  const clearHistory = () => {
    setHistory([]);

    localStorage.removeItem(
      historyStorageKey
    );
  };

  // ==========================================================
  // RUN AGENT
  // ==========================================================

  const runAgent = async () => {
    if (!prompt.trim() || loading) {
      return;
    }

    setLoading(true);
    setError("");
    setResponse("");

    try {
      const context =
        projectContext.trim();

      /*
      |--------------------------------------------------------------------------
      | Combine project context with user prompt
      |--------------------------------------------------------------------------
      | Backend currently accepts a single "prompt" field.
      | Therefore project context is included inside the final prompt.
      |--------------------------------------------------------------------------
      */

      const finalPrompt = context
        ? `
Project Context:
${context}

Agent Role:
${agentInstructions[type]}

User Task:
${prompt.trim()}
`
        : `
Agent Role:
${agentInstructions[type]}

User Task:
${prompt.trim()}
`;

      /*
      |--------------------------------------------------------------------------
      | REAL BACKEND API
      |--------------------------------------------------------------------------
      */
      console.log("🚀 RUN AGENT STARTED");
console.log("Agent ID:", agentId);
console.log("API URL:", `http://localhost:5000/api/agents/${agentId}/execute`);
      const apiResponse = await fetch(`http://localhost:5000/api/agents/${agentId}/execute`, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  credentials: "include",
  body: JSON.stringify({
    prompt: finalPrompt,
  }),
});

      /*
      |--------------------------------------------------------------------------
      | HANDLE HTTP ERRORS
      |--------------------------------------------------------------------------
      */

      if (!apiResponse.ok) {
        let errorMessage =
          "Failed to execute AI agent.";

        try {
          const errorData =
            await apiResponse.json();

          errorMessage =
            errorData?.message ||
            errorData?.error ||
            errorMessage;
        } catch {
          // Ignore JSON parsing failure
        }

        throw new Error(errorMessage);
      }

      /*
      |--------------------------------------------------------------------------
      | PARSE BACKEND RESPONSE
      |--------------------------------------------------------------------------
      */

      const data =
        await apiResponse.json();

      if (!data?.success) {
        throw new Error(
          data?.message ||
            "AI agent execution failed."
        );
      }

      const generatedResponse =
        data?.result?.response?.trim();

      if (!generatedResponse) {
        throw new Error(
          "AI agent returned an empty response."
        );
      }

      /*
      |--------------------------------------------------------------------------
      | DISPLAY RESPONSE
      |--------------------------------------------------------------------------
      */

      setResponse(generatedResponse);

      /*
      |--------------------------------------------------------------------------
      | SAVE HISTORY
      |--------------------------------------------------------------------------
      */

      saveToHistory(
        prompt.trim(),
        generatedResponse,
        context
      );
    } catch (error) {
      console.error(
        "AI Agent Error:",
        error
      );

      setError(
        error instanceof Error
          ? error.message
          : "Something went wrong while running the agent."
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================================
  // CLOSE
  // ==========================================================

  const handleClose = () => {
    if (loading) {
      return;
    }

    setPrompt("");
    setResponse("");
    setError("");
    setProjectContext("");
    setContextType("none");

    onClose();
  };

  // ==========================================================
  // NEW CHAT
  // ==========================================================

  const handleNewChat = () => {
    if (loading) {
      return;
    }

    setPrompt("");
    setResponse("");
    setError("");
    setProjectContext("");
    setContextType("none");
    setShowHistory(false);
  };

  // ==========================================================
  // KEYBOARD SHORTCUT
  // ==========================================================

  const handlePromptKeyDown = (
    e: React.KeyboardEvent<HTMLTextAreaElement>
  ) => {
    if (
      e.key === "Enter" &&
      !e.shiftKey
    ) {
      e.preventDefault();

      if (
        prompt.trim() &&
        !loading
      ) {
        runAgent();
      }
    }
  };

  // ==========================================================
  // UI
  // ==========================================================

  return (
    <div className="rounded-3xl border border-cyan-500/20 bg-[#111827] shadow-2xl shadow-cyan-500/5">

      {/* ================================================== */}
      {/* HEADER */}
      {/* ================================================== */}

      <div className="flex items-center justify-between border-b border-white/10 p-6">

        <div className="flex items-center gap-4">

          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-500/10">
            <Bot
              size={24}
              className="text-cyan-400"
            />
          </div>

          <div>

            <div className="flex items-center gap-3">

              <h2 className="text-xl font-bold text-white">
                {name}
              </h2>

              <span className="flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-medium text-emerald-400">

                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />

                {status}

              </span>

            </div>

            <p className="mt-1 text-sm text-slate-400">
              {description}
            </p>

          </div>

        </div>

        <button
          onClick={handleClose}
          disabled={loading}
          className="rounded-xl p-2 text-slate-400 transition hover:bg-white/10 hover:text-white disabled:opacity-50"
        >
          <X size={20} />
        </button>

      </div>

      {/* ================================================== */}
      {/* BODY */}
      {/* ================================================== */}

      <div className="p-6">

        {/* ================================================= */}
        {/* WORKSPACE TOP BAR */}
        {/* ================================================= */}

        <div className="mb-6 flex items-center justify-between">

          <div>

            <h3 className="text-lg font-semibold text-white">
              Agent Workspace
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              Give the agent a software-development task or question.
            </p>

          </div>

          <div className="flex items-center gap-2 shrink-0">

            <button
              type="button"
              onClick={() =>
                setShowHistory(
                  (prev) => !prev
                )
              }
              disabled={loading}
              className="inline-flex items-center justify-center rounded-xl border border-cyan-500/30 bg-cyan-500/10 px-4 py-2 text-sm font-medium text-cyan-300 transition hover:bg-cyan-500/20 hover:text-cyan-200 disabled:cursor-not-allowed disabled:opacity-50"
            >
              History
            </button>

            <button
              type="button"
              onClick={handleNewChat}
              disabled={loading}
              className="inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-slate-300 transition hover:bg-white/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
            >
              + New Chat
            </button>

          </div>

        </div>

        {/* ================================================= */}
        {/* HISTORY */}
        {/* ================================================= */}

        {showHistory && (
          <div className="mb-6 rounded-2xl border border-white/10 bg-[#0F172A] p-4">

            <div className="mb-3 flex items-center justify-between">

              <h4 className="font-semibold text-white">
                Task History
              </h4>

              {history.length > 0 && (
                <button
                  onClick={clearHistory}
                  className="text-xs text-red-400 hover:text-red-300"
                >
                  Clear All
                </button>
              )}

            </div>

            {history.length === 0 ? (
              <p className="text-sm text-slate-500">
                No previous tasks found.
              </p>
            ) : (
              <div className="max-h-64 space-y-2 overflow-y-auto">

                {history.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-2 rounded-xl border border-white/5 bg-white/5 p-3"
                  >

                    <button
                      onClick={() =>
                        loadHistoryItem(item)
                      }
                      className="min-w-0 flex-1 text-left"
                    >

                      <p className="truncate text-sm font-medium text-slate-200">
                        {item.prompt}
                      </p>

                      <p className="mt-1 text-[11px] text-slate-500">
                        {new Date(
                          item.createdAt
                        ).toLocaleString()}
                      </p>

                    </button>

                    <button
                      onClick={() =>
                        deleteHistoryItem(
                          item.id
                        )
                      }
                      className="rounded-lg p-2 text-slate-500 hover:bg-red-500/10 hover:text-red-400"
                    >
                      <X size={14} />
                    </button>

                  </div>
                ))}

              </div>
            )}

          </div>
        )}

        {/* ================================================= */}
        {/* CONVERSATION CONTEXT */}
        {/* ================================================= */}

        {history.length > 0 && (
          <div className="mb-6 flex items-center justify-between rounded-xl border border-cyan-500/20 bg-cyan-500/5 px-4 py-3">

            <div className="flex items-center gap-2">

              <Bot
                size={16}
                className="text-cyan-400"
              />

              <span className="text-sm font-medium text-cyan-300">
                Conversation context active
              </span>

            </div>

            <span className="text-xs text-slate-500">
              {history.length} saved tasks
            </span>

          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">

          {/* ================================================= */}
          {/* INPUT PANEL */}
          {/* ================================================= */}

          <div className="space-y-5">

            {/* PROJECT CONTEXT */}

            <div className="rounded-2xl border border-cyan-500/20 bg-cyan-500/5 p-4">

              <div className="mb-3 flex items-center gap-2">

                <Sparkles
                  size={16}
                  className="text-cyan-400"
                />

                <span className="text-sm font-semibold text-white">
                  Project Context
                </span>

                <span className="rounded-full bg-cyan-500/10 px-2 py-0.5 text-[10px] font-medium text-cyan-400">
                  Optional
                </span>

              </div>

              <p className="mb-3 text-xs leading-5 text-slate-500">
                Add your project's technology stack,
                architecture, database, or important
                requirements so the agent can give
                project-specific answers.
              </p>

              <select
                value={contextType}
                onChange={(e) =>
                  handleContextTypeChange(
                    e.target.value as keyof typeof projectExamples
                  )
                }
                disabled={loading}
                className="mb-3 w-full rounded-xl border border-white/10 bg-[#0F172A] px-3 py-2.5 text-sm text-white outline-none focus:border-cyan-500 disabled:opacity-60"
              >

                <option value="none">
                  No Project Context
                </option>

                <option value="webapp">
                  Full-Stack Web Application
                </option>

                <option value="java">
                  Java Application
                </option>

                <option value="blockchain">
                  Blockchain Application
                </option>

                <option value="custom">
                  Custom Project Context
                </option>

              </select>

              <textarea
                rows={5}
                value={projectContext}
                onChange={(e) =>
                  setProjectContext(
                    e.target.value
                  )
                }
                disabled={
                  loading ||
                  contextType === "none"
                }
                placeholder={
                  contextType === "custom"
                    ? "Example:\nProject: Student Management System\nFrontend: Next.js\nBackend: Node.js\nDatabase: PostgreSQL\nAuthentication: JWT"
                    : "Select a project context above..."
                }
                className="w-full resize-none rounded-xl border border-white/10 bg-[#0F172A] px-3 py-2.5 text-xs leading-5 text-white outline-none placeholder:text-slate-600 focus:border-cyan-500 disabled:cursor-not-allowed disabled:opacity-50"
              />

              {projectContext.trim() && (
                <div className="mt-2 flex items-center gap-2 text-[11px] text-emerald-400">

                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />

                  Project context will be sent to the agent

                </div>
              )}

            </div>

            {/* TASK INPUT */}

            <div>

              <div className="mb-2 flex items-center gap-2">

                <Activity
                  size={16}
                  className="text-cyan-400"
                />

                <label className="text-sm font-semibold text-white">
                  Give the agent a task
                </label>

              </div>

              <p className="mb-3 text-xs leading-5 text-slate-500">
                Describe what you want this agent
                to analyze, create, debug, test,
                or document.
              </p>

              <textarea
                rows={10}
                value={prompt}
                onChange={(e) =>
                  setPrompt(
                    e.target.value
                  )
                }
                onKeyDown={
                  handlePromptKeyDown
                }
                disabled={loading}
                placeholder={
                  type === "architect"
                    ? "Example: Design the architecture for a student management system..."
                    : type === "developer"
                      ? "Example: Create the API structure for student registration and login..."
                      : type === "uiux"
                        ? "Example: Design the dashboard layout for a student management system..."
                        : type === "debugger"
                          ? "Example: My Next.js application shows a hydration error. Analyze the problem..."
                          : type === "testing"
                            ? "Example: Generate test cases for student registration and authentication..."
                            : "Example: Create a professional README structure for my project..."
                }
                className="w-full resize-none rounded-2xl border border-white/10 bg-[#0F172A] px-4 py-3 text-sm leading-6 text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-500 disabled:cursor-not-allowed disabled:opacity-60"
              />

              <p className="mt-2 text-[11px] text-slate-600">
                Enter to run • Shift + Enter for new line
              </p>

            </div>

            {/* AGENT CAPABILITY */}

            <div className="rounded-2xl border border-white/10 bg-white/2 p-4">

              <div className="flex items-center gap-2">

                <Activity
                  size={15}
                  className="text-cyan-400"
                />

                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Agent Capability
                </span>

              </div>

              <p className="mt-2 text-sm leading-6 text-slate-300">
                {agentInstructions[type]}
              </p>

            </div>

            {/* RUN AGENT */}

            <button
              onClick={runAgent}
              disabled={
                !prompt.trim() ||
                loading
              }
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-cyan-500 px-5 py-3.5 font-semibold text-black transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-50"
            >

              {loading ? (
                <>
                  <Loader2
                    size={18}
                    className="animate-spin"
                  />

                  Agent is thinking...
                </>
              ) : (
                <>
                  <Send size={18} />

                  Run Agent
                </>
              )}

            </button>

          </div>

          {/* ================================================= */}
          {/* OUTPUT PANEL */}
          {/* ================================================= */}

          <div className="flex min-h-105 flex-col rounded-2xl border border-white/10 bg-[#0F172A]">

            {/* OUTPUT HEADER */}

            <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">

              <div>

                <h3 className="font-semibold text-white">
                  Agent Output
                </h3>

                <p className="mt-0.5 text-xs text-slate-500">
                  Gemini-powered response
                </p>

              </div>

              {response && !loading && (
                <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-400">
                  Completed
                </span>
              )}

            </div>

            {/* OUTPUT */}

            <div className="flex-1 p-5">

              {/* LOADING */}

              {loading && !response && (
                <div className="flex h-full min-h-82.5 flex-col items-center justify-center">

                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-500/10">

                    <Sparkles
                      size={25}
                      className="animate-pulse text-cyan-400"
                    />

                  </div>

                  <p className="mt-4 font-medium text-white">
                    {name} is analyzing...
                  </p>

                  <p className="mt-1 text-sm text-slate-500">
                    Gemini AI is processing your request.
                  </p>

                  {projectContext.trim() && (
                    <p className="mt-2 text-xs text-cyan-500/70">
                      Using project context
                    </p>
                  )}

                </div>
              )}

              {/* EMPTY */}

              {!loading &&
                !response &&
                !error && (
                  <div className="flex h-full min-h-82.5 flex-col items-center justify-center text-center">

                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/5">

                      <Bot
                        size={25}
                        className="text-slate-500"
                      />

                    </div>

                    <h4 className="mt-4 font-semibold text-slate-300">
                      Ready for your instruction
                    </h4>

                    <p className="mt-2 max-w-sm text-sm leading-6 text-slate-500">
                      Add project context if needed,
                      then give the {name} a task.
                    </p>

                  </div>
                )}

              {/* ERROR */}

              {error && (
                <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-4">

                  <p className="text-sm font-semibold text-red-400">
                    Agent Error
                  </p>

                  <p className="mt-2 text-sm leading-6 text-red-300/80">
                    {error}
                  </p>

                </div>
              )}

              {/* FINAL RESPONSE */}

              {!loading && response && (
  <div className="prose prose-invert max-w-none text-sm leading-7">
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        h1: ({ children }) => (
          <h1 className="mb-4 mt-2 text-2xl font-bold text-white">
            {children}
          </h1>
        ),

        h2: ({ children }) => (
          <h2 className="mb-3 mt-6 text-xl font-bold text-white">
            {children}
          </h2>
        ),

        h3: ({ children }) => (
          <h3 className="mb-2 mt-5 text-lg font-semibold text-cyan-300">
            {children}
          </h3>
        ),

        h4: ({ children }) => (
          <h4 className="mb-2 mt-4 text-base font-semibold text-slate-200">
            {children}
          </h4>
        ),

        p: ({ children }) => (
          <p className="mb-4 leading-7 text-slate-300">
            {children}
          </p>
        ),

        ul: ({ children }) => (
          <ul className="mb-4 ml-5 list-disc space-y-2 text-slate-300">
            {children}
          </ul>
        ),

        ol: ({ children }) => (
          <ol className="mb-4 ml-5 list-decimal space-y-2 text-slate-300">
            {children}
          </ol>
        ),

        li: ({ children }) => (
          <li className="pl-1 leading-6">
            {children}
          </li>
        ),

        strong: ({ children }) => (
          <strong className="font-semibold text-white">
            {children}
          </strong>
        ),

        em: ({ children }) => (
          <em className="text-slate-200">
            {children}
          </em>
        ),

        blockquote: ({ children }) => (
          <blockquote className="my-4 border-l-2 border-cyan-500/50 bg-cyan-500/5 px-4 py-2 text-slate-400">
            {children}
          </blockquote>
        ),

        code: ({ children, className }) => {
          const isBlock =
            className?.includes("language-");

          if (isBlock) {
            return (
              <code className="block overflow-x-auto rounded-xl border border-white/10 bg-black/30 p-4 font-mono text-xs leading-6 text-cyan-300">
                {children}
              </code>
            );
          }

          return (
            <code className="rounded-md border border-white/10 bg-white/5 px-1.5 py-0.5 font-mono text-xs text-cyan-300">
              {children}
            </code>
          );
        },

        pre: ({ children }) => (
          <pre className="mb-5 overflow-x-auto rounded-xl border border-white/10 bg-[#020617] p-0">
            {children}
          </pre>
        ),

        table: ({ children }) => (
          <div className="mb-5 overflow-x-auto rounded-xl border border-white/10">
            <table className="w-full border-collapse text-sm">
              {children}
            </table>
          </div>
        ),

        th: ({ children }) => (
          <th className="border-b border-white/10 bg-white/5 px-4 py-3 text-left font-semibold text-white">
            {children}
          </th>
        ),

        td: ({ children }) => (
          <td className="border-b border-white/5 px-4 py-3 text-slate-300">
            {children}
          </td>
        ),

        hr: () => (
          <hr className="my-6 border-white/10" />
        ),

        a: ({ href, children }) => (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-cyan-400 underline underline-offset-2 hover:text-cyan-300"
          >
            {children}
          </a>
        ),
      }}
    >
      {response}
    </ReactMarkdown>
  </div>
)}

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}