"use client";

import { useEffect, useState } from "react";
import {
  Bot,
  Send,
  Loader2,
  Sparkles,
  User,
  Trash2,
} from "lucide-react";

import Sidebar from "@/components/dashboard/Sidebar";
import TopNavbar from "@/components/dashboard/TopNavbar";

type Agent = {
  id: string;
  type: string;
  name: string;
  description?: string | null;
  isActive: boolean;
};

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

const API_URL = "http://localhost:5000";

const agentColors: Record<string, string> = {
  ARCHITECT: "text-purple-400",
  DEVELOPER: "text-cyan-400",
  UIUX: "text-pink-400",
  DEBUGGER: "text-red-400",
  TESTING: "text-emerald-400",
  DOCUMENTATION: "text-yellow-400",
};

export default function AIChatPage() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [selectedAgent, setSelectedAgent] =
    useState<Agent | null>(null);

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");

  const [loadingAgents, setLoadingAgents] =
    useState(true);

  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  // ==========================================================
  // LOAD AGENTS
  // ==========================================================

  useEffect(() => {
    const loadAgents = async () => {
      try {
        setLoadingAgents(true);
        setError("");

        const response = await fetch(
          `${API_URL}/api/agents`
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data?.message ||
              "Failed to load AI agents."
          );
        }

        const loadedAgents: Agent[] =
          data?.agents || [];

        setAgents(loadedAgents);

        // Select Developer Agent by default
        const defaultAgent =
          loadedAgents.find(
            (agent) =>
              agent.type === "DEVELOPER"
          ) || loadedAgents[0];

        if (defaultAgent) {
          setSelectedAgent(defaultAgent);
        }
      } catch (err) {
        console.error(
          "Load agents error:",
          err
        );

        setError(
          err instanceof Error
            ? err.message
            : "Failed to load AI agents."
        );
      } finally {
        setLoadingAgents(false);
      }
    };

    loadAgents();
  }, []);

  // ==========================================================
  // SEND MESSAGE
  // ==========================================================

  const sendMessage = async () => {
    const message = input.trim();

    if (
      !message ||
      !selectedAgent ||
      sending
    ) {
      return;
    }

    setError("");
    setSending(true);

    const userMessage: Message = {
      id: `${Date.now()}-user`,
      role: "user",
      content: message,
    };

    setMessages((previous) => [
      ...previous,
      userMessage,
    ]);

    setInput("");

    try {
      const response = await fetch(
        `${API_URL}/api/agents/${selectedAgent.id}/execute`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          credentials: "include",

          body: JSON.stringify({
            prompt: message,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.message ||
            "Failed to get AI response."
        );
      }

      const aiResponse =
        data?.result?.response;

      if (
        typeof aiResponse !== "string" ||
        !aiResponse.trim()
      ) {
        throw new Error(
          "AI returned an empty response."
        );
      }

      const assistantMessage: Message = {
        id: `${Date.now()}-assistant`,
        role: "assistant",
        content: aiResponse,
      };

      setMessages((previous) => [
        ...previous,
        assistantMessage,
      ]);
    } catch (err) {
      console.error(
        "AI Chat error:",
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : "Failed to get AI response."
      );
    } finally {
      setSending(false);
    }
  };

  // ==========================================================
  // ENTER TO SEND
  // ==========================================================

  const handleKeyDown = (
    event: React.KeyboardEvent<HTMLTextAreaElement>
  ) => {
    if (
      event.key === "Enter" &&
      !event.shiftKey
    ) {
      event.preventDefault();
      sendMessage();
    }
  };

  // ==========================================================
  // CLEAR CHAT
  // ==========================================================

  const clearChat = () => {
    if (sending) {
      return;
    }

    setMessages([]);
    setError("");
  };

  // ==========================================================
  // LOADING
  // ==========================================================

  if (loadingAgents) {
    return (
      <div className="flex min-h-screen bg-[#070B14]">
        <Sidebar />

        <div className="flex flex-1 flex-col">
          <TopNavbar />

          <main className="flex flex-1 items-center justify-center">
            <div className="flex items-center gap-3 text-slate-400">
              <Loader2
                size={22}
                className="animate-spin text-cyan-400"
              />

              Loading AI Chat...
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#070B14]">
      <Sidebar />

      <div className="flex min-w-0 flex-1 flex-col">
        <TopNavbar />

        <main className="flex min-h-0 flex-1 flex-col p-6 lg:p-8">
          {/* ================================================= */}
          {/* HEADER */}
          {/* ================================================= */}

          <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-cyan-500/20 bg-cyan-500/10">
                  <Sparkles
                    size={22}
                    className="text-cyan-400"
                  />
                </div>

                <div>
                  <h1 className="text-3xl font-bold text-white">
                    AI Chat
                  </h1>

                  <p className="mt-1 text-sm text-slate-400">
                    Collaborate with your AI
                    assistants in real time.
                  </p>
                </div>
              </div>
            </div>

            {/* Clear */}
            {messages.length > 0 && (
              <button
                type="button"
                onClick={clearChat}
                disabled={sending}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-medium text-slate-300 transition hover:border-red-500/30 hover:bg-red-500/10 hover:text-red-300 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <Trash2 size={16} />
                Clear Chat
              </button>
            )}
          </div>

          {/* ================================================= */}
          {/* CHAT CONTAINER */}
          {/* ================================================= */}

          <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/3">
            {/* ================================================= */}
            {/* AGENT SELECTOR */}
            {/* ================================================= */}

            <div className="border-b border-white/10 p-4">
              <div className="mb-3 flex items-center gap-2 text-sm font-medium text-slate-300">
                <Bot
                  size={17}
                  className="text-cyan-400"
                />

                Select AI Agent
              </div>

              <div className="flex gap-2 overflow-x-auto pb-1">
                {agents.map((agent) => {
                  const selected =
                    selectedAgent?.id ===
                    agent.id;

                  return (
                    <button
                      key={agent.id}
                      type="button"
                      onClick={() => {
                        if (!sending) {
                          setSelectedAgent(
                            agent
                          );
                        }
                      }}
                      disabled={sending}
                      className={`flex shrink-0 items-center gap-2 rounded-xl border px-4 py-2.5 text-sm transition ${
                        selected
                          ? "border-cyan-500/40 bg-cyan-500/10 text-cyan-300"
                          : "border-white/10 bg-white/3 text-slate-400 hover:border-white/20 hover:text-white"
                      } disabled:cursor-not-allowed disabled:opacity-50`}
                    >
                      <Bot
                        size={16}
                        className={
                          agentColors[
                            agent.type
                          ] ||
                          "text-cyan-400"
                        }
                      />

                      {agent.name.replace(
                        " Agent",
                        ""
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* ================================================= */}
            {/* MESSAGES */}
            {/* ================================================= */}

            <div className="min-h-0 flex-1 overflow-y-auto p-5">
              {messages.length === 0 ? (
                <div className="flex h-full min-h-100 flex-col items-center justify-center text-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-cyan-500/20 bg-cyan-500/10">
                    <Bot
                      size={30}
                      className="text-cyan-400"
                    />
                  </div>

                  <h2 className="mt-5 text-xl font-semibold text-white">
                    Start a conversation
                  </h2>

                  <p className="mt-2 max-w-md text-sm leading-6 text-slate-400">
                    Ask your selected AI agent about
                    architecture, development,
                    debugging, testing, UI/UX or
                    documentation.
                  </p>

                  {selectedAgent && (
                    <div className="mt-5 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-400">
                      Current agent:{" "}
                      <span className="font-medium text-cyan-300">
                        {selectedAgent.name}
                      </span>
                    </div>
                  )}
                </div>
              ) : (
                <div className="mx-auto max-w-4xl space-y-5">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex gap-3 ${
                        message.role ===
                        "user"
                          ? "justify-end"
                          : "justify-start"
                      }`}
                    >
                      {message.role ===
                        "assistant" && (
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-cyan-500/10">
                          <Bot
                            size={18}
                            className="text-cyan-400"
                          />
                        </div>
                      )}

                      <div
                        className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                          message.role ===
                          "user"
                            ? "bg-cyan-500 text-black"
                            : "border border-white/10 bg-white/5 text-slate-200"
                        }`}
                      >
                        <p className="whitespace-pre-wrap text-sm leading-6">
                          {message.content}
                        </p>
                      </div>

                      {message.role ===
                        "user" && (
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/10">
                          <User
                            size={18}
                            className="text-slate-300"
                          />
                        </div>
                      )}
                    </div>
                  ))}

                  {sending && (
                    <div className="flex gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-cyan-500/10">
                        <Bot
                          size={18}
                          className="text-cyan-400"
                        />
                      </div>

                      <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-400">
                        <Loader2
                          size={16}
                          className="animate-spin text-cyan-400"
                        />

                        {selectedAgent?.name ||
                          "AI Agent"}{" "}
                        is thinking...
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* ================================================= */}
            {/* ERROR */}
            {/* ================================================= */}

            {error && (
              <div className="mx-5 mb-3 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                {error}
              </div>
            )}

            {/* ================================================= */}
            {/* INPUT */}
            {/* ================================================= */}

            <div className="border-t border-white/10 p-4">
              <div className="mx-auto flex max-w-4xl items-end gap-3 rounded-2xl border border-white/10 bg-black/20 p-2">
                <textarea
                  value={input}
                  onChange={(event) =>
                    setInput(
                      event.target.value
                    )
                  }
                  onKeyDown={handleKeyDown}
                  disabled={
                    sending ||
                    !selectedAgent
                  }
                  placeholder={
                    selectedAgent
                      ? `Ask ${selectedAgent.name}...`
                      : "Select an AI agent..."
                  }
                  rows={2}
                  className="min-h-12 flex-1 resize-none bg-transparent px-3 py-2.5 text-sm text-white outline-none placeholder:text-slate-600 disabled:cursor-not-allowed"
                />

                <button
                  type="button"
                  onClick={sendMessage}
                  disabled={
                    sending ||
                    !input.trim() ||
                    !selectedAgent
                  }
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-cyan-500 text-black transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {sending ? (
                    <Loader2
                      size={18}
                      className="animate-spin"
                    />
                  ) : (
                    <Send size={18} />
                  )}
                </button>
              </div>

              <p className="mt-2 text-center text-xs text-slate-600">
                Press Enter to send • Shift + Enter
                for a new line
              </p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}