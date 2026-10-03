
"use client";
import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

import Sidebar from "@/components/dashboard/Sidebar";
import TopNavbar from "@/components/dashboard/TopNavbar";
import { API_URL } from "@/lib/api";

import {
  Activity,
  ArrowLeft,
  Bot,
  Check,
  ChevronDown,
  Clock,
  Copy,
  History,
  Loader2,
  Plus,
  Send,
  Sparkles,
  Trash2,
  X,
} from "lucide-react";

import AgentCard, {
  AgentStatus,
  AgentType,
} from "@/components/agents/AgentCard";

// ============================================================
// TYPES
// ============================================================

type Agent = {
  id: string;
  name: string;
  description: string;
  type: AgentType;
  status: AgentStatus;
};

type Message = {
  role: "user" | "assistant";
  content: string;
};

type ConversationHistory = {
  id: string;
  agentId: AgentType;
  agentName: string;
  messages: Message[];
  createdAt: string;
};

type AutonomousStage =
  | "idle"
  | "architect"
  | "developer"
  | "completed"
  | "error";

type ValidationIssue = {
  severity: "HIGH" | "MEDIUM" | "LOW";
  file: string;
  problem: string;
  reason: string;
  recommendedFix: string;
};

type ValidationResult = {
  status: "PASS" | "FAIL";
  totalIssues: number;
  filesReviewed: number;
  issues: ValidationIssue[];
  summary: string;
};

// ============================================================
// AGENTS
// ============================================================

const agents: Agent[] = [
  {
    id: "architect",
    name: "Architect Agent",
    description:
      "Design system architecture, modules, APIs, databases and technical plans.",
    type: "architect",
    status: "Active",
  },
  {
    id: "developer",
    name: "Developer Agent",
    description:
      "Generate implementation guidance, code, APIs and development solutions.",
    type: "developer",
    status: "Active",
  },
  {
    id: "uiux",
    name: "UI/UX Agent",
    description:
      "Design user flows, interfaces, components and responsive experiences.",
    type: "uiux",
    status: "Active",
  },
  {
    id: "debugger",
    name: "Debugger Agent",
    description:
      "Find root causes of errors and provide practical debugging solutions.",
    type: "debugger",
    status: "Active",
  },
  {
    id: "testing",
    name: "Testing Agent",
    description:
      "Create test cases, edge cases, validation strategies and QA plans.",
    type: "testing",
    status: "Active",
  },
  {
    id: "documentation",
    name: "Documentation Agent",
    description:
      "Create README files, technical documentation, API docs and setup guides.",
    type: "documentation",
    status: "Active",
  },
];

// ============================================================
// PROJECT CONTEXT
// ============================================================

const projectContextExamples = {
  none: "",

  webapp: `Project Type: Full-stack Web Application
Frontend: Next.js / React / TypeScript
Backend: Node.js / Express / TypeScript
Database: PostgreSQL
ORM: Prisma
Authentication: JWT
AI: Gemini
Frontend Port: 3000
Backend Port: 5000`,

  java: `Project Type: Java Full-stack Application
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

type ProjectContextType = keyof typeof projectContextExamples;

// ============================================================
// AGENT INSTRUCTIONS
// ============================================================

const agentInstructions: Record<AgentType, string> = {
  architect: `
You are a senior software architect.

Focus on:
- System architecture
- Modules
- Database design
- APIs
- Authentication
- Security
- Scalability
- Technology choices

Give practical, structured and production-ready recommendations.
`,

  developer: `
You are an expert full-stack software developer.

Focus on:
- Clean implementation
- Project structure
- APIs
- Components
- Backend logic
- Database integration
- Error handling
- Practical code examples

Provide production-ready development guidance.
`,

  uiux: `
You are a senior UI/UX designer.

Focus on:
- User flows
- Page structure
- UI components
- Responsive design
- Accessibility
- Navigation
- Visual hierarchy
- Usability

Provide modern and practical UI/UX recommendations.
`,

  debugger: `
You are an expert software debugging engineer.

Find the root cause of technical problems.

Explain:
1. What is wrong
2. Why it is happening
3. Exact steps to fix it
4. Corrected code where useful
`,

  testing: `
You are a senior software testing engineer.

Focus on:
- Functional testing
- Unit testing
- Integration testing
- UI testing
- API testing
- Security testing
- Edge cases
- Regression testing

Provide practical test cases and QA strategies.
`,

  documentation: `
You are a professional technical documentation engineer.

Focus on:
- README files
- Installation
- Configuration
- Environment variables
- APIs
- Usage
- Deployment
- Folder structure
- Troubleshooting

Create clear professional technical documentation.
`,
};

// ============================================================
// STORAGE
// ============================================================

const HISTORY_STORAGE_KEY = "devpilot-conversation-history";

// ============================================================
// PAGE
// ============================================================

function AgentsPageContent()  {
  // ==========================================================
  // PROJECT ID FROM URL
  // ==========================================================

  const searchParams = useSearchParams();

  const projectId = searchParams.get("projectId");

  // ==========================================================
  // AGENT STATE
  // ==========================================================

  const [selectedAgent, setSelectedAgent] =
    useState<Agent | null>(null);

  // ==========================================================
  // CHAT STATE
  // ==========================================================

  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");
  const [history, setHistory] = useState<Message[]>([]);
  const [running, setRunning] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  // ==========================================================
  // AUTONOMOUS BUILD STATE
  // ==========================================================

  const [autonomousPrompt, setAutonomousPrompt] =
    useState("");

  const [autonomousRunning, setAutonomousRunning] =
    useState(false);

  const [autonomousStage, setAutonomousStage] =
    useState<AutonomousStage>("idle");

  const [autonomousError, setAutonomousError] =
    useState("");

  const [autonomousResult, setAutonomousResult] =
    useState<{
      projectName: string;
      architecture: string;
      development: string;
      generatedFileCount: number;
    } | null>(null);

  // ==========================================================
  // GENERATED PROJECT VALIDATION STATE
  // ==========================================================

  const [validationRunning, setValidationRunning] =
    useState(false);

  const [validationError, setValidationError] =
    useState("");

  const [validationResult, setValidationResult] =
    useState<ValidationResult | null>(null);

  const [repairRunning, setRepairRunning] =
    useState(false);

  const [repairError, setRepairError] =
    useState("");

  const [repairResult, setRepairResult] =
    useState<{
      generatedFileCount: number;
    } | null>(null);

  // ==========================================================
  // PROJECT CONTEXT
  // ==========================================================

  const [projectContext, setProjectContext] =
    useState("");

  const [contextType, setContextType] =
    useState<ProjectContextType>("none");

  // ==========================================================
  // SAVED CONVERSATIONS
  // ==========================================================

  const [savedConversations, setSavedConversations] =
    useState<ConversationHistory[]>([]);

  const [showHistory, setShowHistory] =
    useState(false);

  // ==========================================================
  // LOAD HISTORY
  // ==========================================================

  useEffect(() => {
    try {
      const saved = localStorage.getItem(
        HISTORY_STORAGE_KEY
      );

      if (!saved) {
        return;
      }

      const parsed = JSON.parse(saved);

      if (Array.isArray(parsed)) {
        setSavedConversations(parsed);
      }
    } catch (error) {
      console.error(
        "Failed to load conversation history:",
        error
      );
    }
  }, []);

  // ==========================================================
  // SELECT AGENT
  // ==========================================================

  const handleAgentSelect = (agent: Agent) => {
    if (running) {
      return;
    }

    setSelectedAgent(agent);

    setPrompt("");
    setResponse("");
    setHistory([]);
    setError("");
    setCopied(false);

    setProjectContext("");
    setContextType("none");

    setShowHistory(false);
  };

  // ==========================================================
  // PROJECT CONTEXT CHANGE
  // ==========================================================

  const handleContextChange = (
    value: ProjectContextType
  ) => {
    setContextType(value);

    if (value === "custom") {
      setProjectContext("");
      return;
    }

    setProjectContext(
      projectContextExamples[value]
    );
  };

  // ==========================================================
  // SAVE CURRENT CONVERSATION
  // ==========================================================

  const saveConversationMessages = (
    messages: Message[]
  ) => {
    if (!selectedAgent || messages.length === 0) {
      return;
    }

    const hasUserMessage = messages.some(
      (message) => message.role === "user"
    );

    const hasAssistantMessage = messages.some(
      (message) => message.role === "assistant"
    );

    if (!hasUserMessage || !hasAssistantMessage) {
      return;
    }

    const now = new Date().toISOString();

    setSavedConversations((previous) => {
      const existingIndex = previous.findIndex(
        (conversation) =>
          conversation.agentId === selectedAgent.type
      );

      let updated: ConversationHistory[];

      if (existingIndex >= 0) {
        const existing =
          previous[existingIndex];

        const updatedConversation: ConversationHistory = {
          ...existing,
          messages,
          createdAt:
            existing.createdAt || now,
        };

        updated = previous.map(
          (conversation, index) =>
            index === existingIndex
              ? updatedConversation
              : conversation
        );
      } else {
        const conversation: ConversationHistory = {
          id: `${Date.now()}-${Math.random()
            .toString(36)
            .substring(2, 9)}`,
          agentId: selectedAgent.type,
          agentName: selectedAgent.name,
          messages,
          createdAt: now,
        };

        updated = [
          conversation,
          ...previous,
        ].slice(0, 50);
      }

      try {
        localStorage.setItem(
          HISTORY_STORAGE_KEY,
          JSON.stringify(updated)
        );
      } catch (error) {
        console.error(
          "Failed to save conversation:",
          error
        );
      }

      return updated;
    });
  };

  const saveCurrentConversation = () => {
    saveConversationMessages(history);
  };

  // ==========================================================
  // NEW CHAT
  // ==========================================================

  const newConversation = () => {
    if (running) {
      return;
    }

    saveCurrentConversation();

    setPrompt("");
    setResponse("");
    setHistory([]);
    setError("");
    setCopied(false);

    setShowHistory(false);
  };

  // ==========================================================
  // LOAD CONVERSATION
  // ==========================================================

  const loadConversation = (
    conversation: ConversationHistory
  ) => {
    if (running) {
      return;
    }

    const agent = agents.find(
      (item) =>
        item.type === conversation.agentId
    );

    if (agent) {
      setSelectedAgent(agent);
    }

    setHistory(conversation.messages);

    const lastAssistantMessage =
      [...conversation.messages]
        .reverse()
        .find(
          (message) =>
            message.role === "assistant"
        );

    setResponse(
      lastAssistantMessage?.content || ""
    );

    setPrompt("");
    setError("");
    setCopied(false);

    setShowHistory(false);
  };

  // ==========================================================
  // DELETE ONE CONVERSATION
  // ==========================================================

  const deleteConversation = (
    id: string
  ) => {
    setSavedConversations(
      (previous) => {
        const updated =
          previous.filter(
            (conversation) =>
              conversation.id !== id
          );

        try {
          localStorage.setItem(
            HISTORY_STORAGE_KEY,
            JSON.stringify(updated)
          );
        } catch (error) {
          console.error(
            "Failed to delete conversation:",
            error
          );
        }

        return updated;
      }
    );
  };

  // ==========================================================
  // CLEAR ALL HISTORY
  // ==========================================================

  const clearAllHistory = () => {
    if (running) {
      return;
    }

    setSavedConversations([]);

    localStorage.removeItem(
      HISTORY_STORAGE_KEY
    );
  };

  // ==========================================================
  // RUN AGENT
  // ==========================================================

  const runAgent = async () => {
    if (
      !selectedAgent ||
      !prompt.trim() ||
      running
    ) {
      return;
    }

    const currentPrompt = prompt.trim();

    setRunning(true);
    setError("");
    setResponse("");
    setCopied(false);

    try {
      // ======================================================
      // 1. GET REAL AGENTS FROM BACKEND
      // ======================================================

      const agentsResponse = await fetch(
  `${API_URL}/api/agents`,
  {
    method: "GET",
    credentials: "include",
  }
);

      if (!agentsResponse.ok) {
        throw new Error(
          "Unable to connect to the AI agent backend."
        );
      }

      const agentsData =
        await agentsResponse.json();

      if (
        !agentsData?.success ||
        !Array.isArray(agentsData.agents)
      ) {
        throw new Error(
          "Invalid agent data received from backend."
        );
      }

      // ======================================================
      // 2. FIND DATABASE AGENT USING TYPE
      // ======================================================

      const backendAgent =
        agentsData.agents.find(
          (agent: {
            id: string;
            type: string;
            name: string;
            isActive: boolean;
          }) =>
            agent.type.toLowerCase() ===
            selectedAgent.type.toLowerCase()
        );

      if (!backendAgent) {
        throw new Error(
          `${selectedAgent.name} is not available on the backend.`
        );
      }

      if (!backendAgent.isActive) {
        throw new Error(
          `${selectedAgent.name} is currently inactive.`
        );
      }

      // ======================================================
      // 3. BUILD FINAL PROMPT
      // ======================================================

      const finalPrompt = `
Agent Role:
${agentInstructions[selectedAgent.type]}

Project Context:
${
  projectContext.trim() ||
  "No additional project context provided."
}

Connected Project ID:
${projectId || "No project selected"}

Important:
If a connected project ID is provided, use the project's
actual backend context as the source of truth.
Do not replace the existing project architecture with a
different framework, database, ORM, authentication system,
or infrastructure unless the user explicitly requests it.

User Task:
${currentPrompt}
`;

      // ======================================================
      // 4. EXECUTE REAL BACKEND AGENT
      // ======================================================

      const apiResponse = await fetch(
  `${API_URL}/api/agents/${backendAgent.id}/execute`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          credentials: "include",

          // IMPORTANT:
          // projectId is now sent to backend
          body: JSON.stringify({
            prompt: finalPrompt,
            projectId:
              projectId || undefined,
          }),
        }
      );

      // ======================================================
      // 5. HANDLE API ERROR
      // ======================================================

      const data =
        await apiResponse.json();

      if (
        !apiResponse.ok ||
        !data?.success
      ) {
        throw new Error(
          data?.message ||
            data?.error ||
            "Failed to execute AI agent."
        );
      }

      // ======================================================
      // 6. GET GEMINI RESPONSE
      // ======================================================

      const generatedResponse =
        data?.result?.response?.trim();

      if (!generatedResponse) {
        throw new Error(
          "AI agent returned an empty response."
        );
      }

      // ======================================================
      // 7. DISPLAY RESPONSE
      // ======================================================

      setResponse(generatedResponse);

      // ======================================================
      // 8. SAVE CONVERSATION
      // ======================================================

      setHistory((previousHistory) => {
        const updatedHistory: Message[] = [
          ...previousHistory,

          {
            role: "user",
            content: currentPrompt,
          },

          {
            role: "assistant",
            content: generatedResponse,
          },
        ];

        saveConversationMessages(
          updatedHistory
        );

        return updatedHistory;
      });

      // ======================================================
      // 9. LOG EXECUTION ID
      // ======================================================

      console.log(
        "AI Execution ID:",
        data?.result?.executionId
      );

      console.log(
        "Project ID:",
        projectId
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
      setRunning(false);
    }
  };

  // ==========================================================
  // AUTONOMOUS BUILD
  // ==========================================================

  const runAutonomousBuild = async () => {
    if (
      !projectId ||
      !autonomousPrompt.trim() ||
      autonomousRunning
    ) {
      return;
    }

    const currentPrompt = autonomousPrompt.trim();

    setAutonomousRunning(true);
    setAutonomousStage("architect");
    setAutonomousError("");
    setAutonomousResult(null);
    setValidationError("");
    setValidationResult(null);

    try {
      const response = await fetch(
        `${API_URL}/api/agents/workflow/build`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            prompt: currentPrompt,
            projectId,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data?.success) {
        throw new Error(
          data?.message ||
            "Autonomous build workflow failed."
        );
      }

      setAutonomousStage("developer");

      const architecture =
        data?.results?.architecture ||
        "Architecture plan completed.";

      const development =
        data?.results?.development ||
        "Developer implementation completed.";

      setAutonomousResult({
        projectName:
          data?.workflow?.projectName ||
          "Connected project",
        architecture,
        development,
        generatedFileCount:
          Number(
            data?.workflow?.developer?.generatedFileCount ??
              data?.generatedFileCount ??
              0
          ),
      });

      setAutonomousStage("completed");
      setAutonomousPrompt("");
    } catch (error) {
      console.error(
        "Autonomous Build Error:",
        error
      );

      setAutonomousStage("error");
      setAutonomousError(
        error instanceof Error
          ? error.message
          : "Autonomous build workflow failed."
      );
    } finally {
      setAutonomousRunning(false);
    }
  };

  // ==========================================================
  // VALIDATE GENERATED PROJECT
  // ==========================================================

  const validateGeneratedProject = async () => {
    if (!projectId || validationRunning || autonomousRunning) {
      return;
    }

    setValidationRunning(true);
    setValidationError("");
    setValidationResult(null);

    try {
      const response = await fetch(
        `${API_URL}/api/agents/workflow/test`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            projectId,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data?.success) {
        throw new Error(
          data?.message ||
            "Project validation failed."
        );
      }

      const rawResult =
        typeof data?.result === "string"
          ? data.result.trim()
          : "";

      let parsed: ValidationResult;

      try {
        const cleaned = rawResult
          .replace(/^```json\s*/i, "")
          .replace(/^```\s*/i, "")
          .replace(/\s*```$/i, "")
          .trim();

        parsed = JSON.parse(cleaned);
      } catch {
        parsed = {
          status: "FAIL",
          totalIssues: 1,
          filesReviewed:
            Number(
              data?.workflow?.testing?.filesReviewed ??
                0
            ),
          issues: [
            {
              severity: "HIGH",
              file: "Validation response",
              problem:
                "Testing Agent returned a response that could not be parsed as structured JSON.",
              reason:
                "The validation result was not returned in the expected machine-readable format.",
              recommendedFix:
                "Review the Testing Agent response and run validation again.",
            },
          ],
          summary:
            rawResult ||
            "Testing Agent returned an unreadable validation response.",
        };
      }

      const normalized: ValidationResult = {
        status:
          parsed.status === "PASS"
            ? "PASS"
            : "FAIL",
        totalIssues:
          Number(parsed.totalIssues) ||
          (Array.isArray(parsed.issues)
            ? parsed.issues.length
            : 0),
        filesReviewed:
          Number(parsed.filesReviewed) ||
          Number(
            data?.workflow?.testing?.filesReviewed ??
              0
          ),
        issues: Array.isArray(parsed.issues)
          ? parsed.issues.map((issue) => ({
              severity:
                issue?.severity === "HIGH" ||
                issue?.severity === "MEDIUM"
                  ? issue.severity
                  : "LOW",
              file: issue?.file || "Unknown file",
              problem:
                issue?.problem ||
                "Unspecified issue",
              reason:
                issue?.reason ||
                "No reason provided.",
              recommendedFix:
                issue?.recommendedFix ||
                "Review and correct the reported issue.",
            }))
          : [],
        summary:
          parsed.summary ||
          "Validation completed.",
      };

      setValidationResult(normalized);
    } catch (error) {
      console.error(
        "Project Validation Error:",
        error
      );

      setValidationError(
        error instanceof Error
          ? error.message
          : "Project validation failed."
      );
    } finally {
      setValidationRunning(false);
    }
  };

  // ==========================================================
  // AUTO-REPAIR GENERATED PROJECT
  // ==========================================================

  const repairGeneratedProject = async () => {
    if (
      !projectId ||
      !validationResult ||
      validationResult.issues.length === 0 ||
      repairRunning ||
      validationRunning ||
      autonomousRunning
    ) {
      return;
    }

    setRepairRunning(true);
    setRepairError("");
    setRepairResult(null);

    try {
      const response = await fetch(
        `${API_URL}/api/agents/workflow/fix`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            projectId,
            issues: validationResult.issues,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data?.success) {
        throw new Error(
          data?.message ||
            "Automatic project repair failed."
        );
      }

      const generatedFileCount = Number(
        data?.workflow?.repair?.generatedFileCount ??
          data?.generatedFileCount ??
          0
      );

      setRepairResult({
        generatedFileCount,
      });

      // The project changed, so the previous validation result is stale.
      setValidationResult(null);
    } catch (error) {
      console.error(
        "Project Repair Error:",
        error
      );

      setRepairError(
        error instanceof Error
          ? error.message
          : "Automatic project repair failed."
      );
    } finally {
      setRepairRunning(false);
    }
  };

  // ==========================================================
  // COPY RESPONSE
  // ==========================================================

  const copyResponse = async () => {
    if (!response) {
      return;
    }

    try {
      await navigator.clipboard.writeText(
        response
      );

      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 1500);
    } catch (error) {
      console.error(
        "Failed to copy response:",
        error
      );
    }
  };

  // ==========================================================
  // KEYBOARD
  // ==========================================================

  const handlePromptKeyDown = (
    event: React.KeyboardEvent<HTMLTextAreaElement>
  ) => {
    if (
      event.key === "Enter" &&
      !event.shiftKey
    ) {
      event.preventDefault();

      if (
        prompt.trim() &&
        !running
      ) {
        runAgent();
      }
    }
  };

  // ==========================================================
  // BACK
  // ==========================================================

  const handleBack = () => {
    if (running) {
      return;
    }

    setSelectedAgent(null);

    setPrompt("");
    setResponse("");
    setHistory([]);
    setError("");
    setCopied(false);

    setProjectContext("");
    setContextType("none");

    setShowHistory(false);
  };

  // ==========================================================
  // STATISTICS
  // ==========================================================

  const totalAgents = agents.length;

  const activeAgents = agents.filter(
    (agent) =>
      agent.status === "Active"
  ).length;

  const busyAgents = agents.filter(
    (agent) =>
      agent.status === "Busy"
  ).length;

  const tasksCompleted =
    agents.reduce(
      (total, agent) =>
        total +
        (agent.type === "architect"
          ? 8
          : 0),
      0
    );

  // ==========================================================
  // AGENT LIST
  // ==========================================================

  if (!selectedAgent) {
    return (
      <div className="flex min-h-screen bg-[#070B14] text-white">
        <Sidebar />

        <div className="flex min-w-0 flex-1 flex-col">
          <TopNavbar />

          <main className="flex-1 p-6 md:p-8">
            <div className="mb-10">
              <div className="mb-3 flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-cyan-500/10">
                  <Sparkles
                    size={22}
                    className="text-cyan-400"
                  />
                </div>

                <div>
                  <h1 className="text-3xl font-bold">
                    AI Agents
                  </h1>

                  <p className="mt-1 text-sm text-slate-500">
                    Choose an intelligent agent
                    for your software project.
                  </p>
                </div>
              </div>

              {projectId && (
                <div className="mt-4 inline-flex items-center gap-2 rounded-xl border border-cyan-500/20 bg-cyan-500/5 px-3 py-2 text-xs text-cyan-300">
                  <Activity size={13} />
                  Connected Project
                  <span className="font-mono text-cyan-400">
                    {projectId}
                  </span>
                </div>
              )}

              <div className="mt-6 flex flex-wrap gap-3">
                <div className="rounded-xl border border-white/10 bg-[#0F172A] px-4 py-3">
                  <p className="text-xs text-slate-500">
                    Total Agents
                  </p>

                  <p className="mt-1 text-lg font-semibold text-white">
                    {totalAgents}
                  </p>
                </div>

                <div className="rounded-xl border border-white/10 bg-[#0F172A] px-4 py-3">
                  <p className="text-xs text-slate-500">
                    Active Agents
                  </p>

                  <p className="mt-1 text-lg font-semibold text-emerald-400">
                    {activeAgents}
                  </p>
                </div>

                <div className="rounded-xl border border-white/10 bg-[#0F172A] px-4 py-3">
                  <p className="text-xs text-slate-500">
                    Busy Agents
                  </p>

                  <p className="mt-1 text-lg font-semibold text-cyan-400">
                    {busyAgents}
                  </p>
                </div>
              </div>
            </div>

            {/* AUTONOMOUS BUILD */}

            <div className="mb-8 overflow-hidden rounded-2xl border border-cyan-500/20 bg-gradient-to-br from-cyan-500/8 via-[#0B1220] to-[#0B1220]">
              <div className="border-b border-white/10 p-5">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-cyan-500/10">
                      <Sparkles size={21} className="text-cyan-400" />
                    </div>

                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h2 className="text-xl font-bold text-white">
                          Autonomous Build
                        </h2>
                        <span className="rounded-full bg-cyan-500/10 px-2.5 py-1 text-[10px] font-medium text-cyan-300">
                          Architect → Developer → Testing
                        </span>
                      </div>

                      <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-500">
                        Give DevPilot a software requirement and let the Architect and Developer agents plan and generate the implementation for your connected project.
                      </p>
                    </div>
                  </div>

                  {projectId ? (
                    <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 px-3 py-2 text-xs text-emerald-300">
                      Project connected
                    </div>
                  ) : (
                    <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 px-3 py-2 text-xs text-amber-300">
                      Open from a project
                    </div>
                  )}
                </div>
              </div>

              <div className="grid gap-5 p-5 lg:grid-cols-[1fr_280px]">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-white">
                    What do you want to build?
                  </label>

                  <textarea
                    rows={5}
                    value={autonomousPrompt}
                    onChange={(event) =>
                      setAutonomousPrompt(event.target.value)
                    }
                    disabled={!projectId || autonomousRunning}
                    placeholder={
                      projectId
                        ? "Example: Build a student management module with student CRUD, authentication, admin dashboard and REST APIs."
                        : "Open AI Workspace from a project to start an autonomous build."
                    }
                    className="w-full resize-none rounded-2xl border border-white/10 bg-[#080E19] px-4 py-3 text-sm leading-6 text-slate-300 outline-none placeholder:text-slate-700 focus:border-cyan-500/40 disabled:cursor-not-allowed disabled:opacity-50"
                  />

                  {autonomousError && (
                    <div className="mt-3 rounded-xl border border-red-500/20 bg-red-500/5 px-3 py-2.5 text-xs text-red-300">
                      {autonomousError}
                    </div>
                  )}

                  {autonomousResult && autonomousStage === "completed" && (
                    <div className="mt-3 rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4">
                      <div className="flex items-center gap-2 text-sm font-semibold text-emerald-300">
                        <Check size={15} />
                        Autonomous build completed
                      </div>
                      <p className="mt-1 text-xs text-slate-500">
                        Architect planning and Developer file generation completed for {autonomousResult.projectName}.
                      </p>

                      <div className="mt-3 flex flex-wrap items-center gap-2">
                        <span className="rounded-full border border-emerald-500/20 bg-emerald-500/5 px-2.5 py-1 text-[11px] text-emerald-300">
                          {autonomousResult.generatedFileCount} project file{autonomousResult.generatedFileCount === 1 ? "" : "s"} generated
                        </span>

                        {projectId && (
                          <Link
                            href={`/files?projectId=${encodeURIComponent(projectId)}`}
                            className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-[11px] font-medium text-slate-300 transition hover:bg-white/10 hover:text-white"
                          >
                            Open Project Files
                          </Link>
                        )}
                      </div>
                    </div>
                  )}

                  {autonomousResult && autonomousStage === "completed" && (
                    <div className="mt-3 rounded-xl border border-violet-500/20 bg-violet-500/5 p-4">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2 text-sm font-semibold text-violet-300">
                            <Activity size={15} />
                            Validate Generated Project
                          </div>
                          <p className="mt-1 text-xs text-slate-500">
                            Review generated files for TypeScript, imports, APIs, Prisma, security and integration issues.
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={validateGeneratedProject}
                          disabled={validationRunning}
                          className="inline-flex items-center gap-2 rounded-lg border border-violet-500/30 bg-violet-500/10 px-3 py-2 text-xs font-semibold text-violet-300 transition hover:bg-violet-500/15 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {validationRunning ? (
                            <>
                              <Loader2 size={14} className="animate-spin" />
                              Validating...
                            </>
                          ) : (
                            <>
                              <Check size={14} />
                              Validate Project
                            </>
                          )}
                        </button>
                      </div>

                      {validationError && (
                        <div className="mt-3 rounded-lg border border-red-500/20 bg-red-500/5 px-3 py-2 text-xs text-red-300">
                          {validationError}
                        </div>
                      )}

                      {validationResult && (
                        <div className="mt-4 rounded-xl border border-white/10 bg-[#080E19] p-4">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${validationResult.status === "PASS" ? "border border-emerald-500/20 bg-emerald-500/5 text-emerald-300" : "border border-amber-500/20 bg-amber-500/5 text-amber-300"}`}>
                              {validationResult.status === "PASS" ? "Validation Passed" : "Issues Found"}
                            </span>
                            <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] text-slate-400">
                              {validationResult.filesReviewed} files reviewed
                            </span>
                            <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] text-slate-400">
                              {validationResult.totalIssues} issue{validationResult.totalIssues === 1 ? "" : "s"}
                            </span>
                          </div>

                          <p className="mt-3 text-xs leading-5 text-slate-400">
                            {validationResult.summary}
                          </p>

                          {validationResult.issues.length > 0 && (
                            <div className="mt-4 space-y-2">
                              {validationResult.issues.slice(0, 5).map((issue, index) => (
                                <div key={`${issue.file}-${index}`} className="rounded-lg border border-white/5 bg-white/[0.02] p-3">
                                  <div className="flex flex-wrap items-center gap-2">
                                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${issue.severity === "HIGH" ? "bg-red-500/10 text-red-300" : issue.severity === "MEDIUM" ? "bg-amber-500/10 text-amber-300" : "bg-slate-500/10 text-slate-300"}`}>
                                      {issue.severity}
                                    </span>
                                    <span className="font-mono text-[10px] text-slate-500">
                                      {issue.file}
                                    </span>
                                  </div>
                                  <p className="mt-1 text-xs font-medium text-slate-300">
                                    {issue.problem}
                                  </p>
                                  <p className="mt-1 text-[11px] leading-5 text-slate-500">
                                    Fix: {issue.recommendedFix}
                                  </p>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}

                      {repairError && (
                        <div className="mt-3 rounded-lg border border-red-500/20 bg-red-500/5 px-3 py-2 text-xs text-red-300">
                          {repairError}
                        </div>
                      )}

                      {repairResult && (
                        <div className="mt-3 rounded-lg border border-cyan-500/20 bg-cyan-500/5 px-3 py-2 text-xs text-cyan-300">
                          <span className="font-semibold">AI Repair completed.</span>{" "}
                          {repairResult.generatedFileCount} project file{repairResult.generatedFileCount === 1 ? "" : "s"} updated.
                          Run validation again to verify the fixes.
                        </div>
                      )}

                      {validationResult &&
                        validationResult.status === "FAIL" &&
                        validationResult.issues.length > 0 && (
                          <div className="mt-3 flex justify-end">
                            <button
                              type="button"
                              onClick={repairGeneratedProject}
                              disabled={repairRunning}
                              className="inline-flex items-center gap-2 rounded-lg border border-cyan-500/30 bg-cyan-500/10 px-3 py-2 text-xs font-semibold text-cyan-300 transition hover:bg-cyan-500/15 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              {repairRunning ? (
                                <>
                                  <Loader2 size={14} className="animate-spin" />
                                  Repairing Project...
                                </>
                              ) : (
                                <>
                                  <Sparkles size={14} />
                                  Fix Issues Automatically
                                </>
                              )}
                            </button>
                          </div>
                        )}
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={runAutonomousBuild}
                    disabled={
                      !projectId ||
                      !autonomousPrompt.trim() ||
                      autonomousRunning
                    }
                    className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-cyan-500 px-5 py-3 font-semibold text-black transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    {autonomousRunning ? (
                      <>
                        <Loader2 size={17} className="animate-spin" />
                        {autonomousStage === "architect"
                          ? "Architect is planning..."
                          : "Developer is generating files..."}
                      </>
                    ) : (
                      <>
                        <Sparkles size={17} />
                        Start Autonomous Build
                      </>
                    )}
                  </button>
                </div>

                <div className="rounded-2xl border border-white/10 bg-[#080E19] p-4">
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Workflow
                  </p>

                  <div className="mt-4 space-y-3">
                    <div className={`flex items-center gap-3 rounded-xl border px-3 py-2.5 ${autonomousStage === "architect" ? "border-cyan-500/30 bg-cyan-500/5" : autonomousStage === "developer" || autonomousStage === "completed" ? "border-emerald-500/20 bg-emerald-500/5" : "border-white/5"}`}>
                      <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-cyan-500/10 text-xs font-bold text-cyan-400">
                        1
                      </div>
                      <span className="text-xs text-slate-300">Architect Agent</span>
                    </div>

                    <div className="ml-6 h-3 w-px bg-white/10" />

                    <div className={`flex items-center gap-3 rounded-xl border px-3 py-2.5 ${autonomousStage === "developer" ? "border-cyan-500/30 bg-cyan-500/5" : autonomousStage === "completed" ? "border-emerald-500/20 bg-emerald-500/5" : "border-white/5"}`}>
                      <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-violet-500/10 text-xs font-bold text-violet-400">
                        2
                      </div>
                      <span className="text-xs text-slate-300">Developer Agent</span>
                    </div>

                    <div className="ml-6 h-3 w-px bg-white/10" />

                    <div className={`flex items-center gap-3 rounded-xl border px-3 py-2.5 ${autonomousStage === "completed" ? "border-emerald-500/20 bg-emerald-500/5" : "border-white/5"}`}>
                      <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/10 text-xs font-bold text-emerald-400">
                        3
                      </div>
                      <span className="text-xs text-slate-300">Project Files</span>
                    </div>

                    {validationResult && (
                      <>
                        <div className="ml-6 h-3 w-px bg-white/10" />
                        <div className={`flex items-center gap-3 rounded-xl border px-3 py-2.5 ${validationResult.status === "PASS" ? "border-emerald-500/20 bg-emerald-500/5" : "border-amber-500/20 bg-amber-500/5"}`}>
                          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-violet-500/10 text-xs font-bold text-violet-400">
                            4
                          </div>
                          <span className="text-xs text-slate-300">Testing & Validation</span>
                        </div>
                      </>
                    )}
                  </div>

                  {!projectId && (
                    <p className="mt-4 text-[11px] leading-5 text-slate-600">
                      Go to Projects → open a project → Open AI Workspace.
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="mb-5 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-white">
                  Available Agents
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Select an agent to start a development task.
                </p>
              </div>

              <div className="hidden rounded-full border border-white/10 bg-white/3 px-3 py-1.5 text-xs text-slate-400 sm:block">
                {totalAgents} specialized agents
              </div>
            </div>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
 {agents.map((agent) => (
                <AgentCard
                  key={agent.id}
                  {...agent}
                  tasksCompleted={
                    agent.type === "architect"
                      ? 8
                      : agent.type === "developer"
                      ? 7
                      : agent.type === "uiux"
                      ? 4
                      : agent.type === "debugger"
                      ? 6
                      : agent.type === "testing"
                      ? 5
                      : 4
                  }
                  onOpen={() =>
                    handleAgentSelect(agent)
                  }
                />
              ))}
            </div>
          </main>
        </div>
      </div>
    );
  }

  // ==========================================================
  // CURRENT AGENT HISTORY
  // ==========================================================

  const agentHistory =
    savedConversations.filter(
      (conversation) =>
        conversation.agentId ===
        selectedAgent.type
    );

  // ==========================================================
  // AGENT WORKSPACE
  // ==========================================================

  return (
    <div className="flex min-h-screen bg-[#070B14] text-white">
      <Sidebar />

      <div className="flex min-w-0 flex-1 flex-col">
        <TopNavbar />

        <main className="flex-1 p-6 md:p-8">
          <div className="mx-auto max-w-7xl">

            {/* TOP NAVIGATION */}

            <div className="mb-5 flex items-center justify-between">
              <button
                type="button"
                onClick={handleBack}
                disabled={running}
                className="
                  flex
                  items-center
                  gap-2
                  rounded-xl
                  border
                  border-white/10
                  bg-white/3
                  px-3
                  py-2
                  text-sm
                  text-slate-400
                  transition
                  hover:bg-white/5
                  hover:text-white
                  disabled:cursor-not-allowed
                  disabled:opacity-40
                "
              >
                <ArrowLeft size={16} />
                Back to Agents
              </button>

              <div className="flex items-center gap-2">
                <div
                  className="
                    flex
                    items-center
                    gap-2
                    rounded-full
                    border
                    border-emerald-500/20
                    bg-emerald-500/5
                    px-3
                    py-1.5
                    text-xs
                    text-emerald-400
                  "
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  Agent Ready
                </div>
              </div>
            </div>

            {/* PROJECT CONNECTION */}

            {projectId && (
              <div className="mb-5 flex items-center gap-2 rounded-xl border border-cyan-500/20 bg-cyan-500/5 px-4 py-3 text-xs text-cyan-300">
                <Activity size={14} />

                <span>
                  This AI execution is connected to project:
                </span>

                <span className="font-mono font-semibold text-cyan-400">
                  {projectId}
                </span>
              </div>
            )}

            {/* AGENT HEADER */}

            <div
              className="
                mb-5
                rounded-2xl
                border
                border-white/10
                bg-[#0B1220]
                p-5
              "
            >
              <div className="flex items-center justify-between gap-4">
                <div className="flex min-w-0 items-center gap-4">
                  <div
                    className="
                      flex
                      h-12
                      w-12
                      shrink-0
                      items-center
                      justify-center
                      rounded-xl
                      bg-cyan-500/10
                    "
                  >
                    <Bot
                      size={24}
                      className="text-cyan-400"
                    />
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-3">
                      <h2
                        className="
                          truncate
                          text-xl
                          font-bold
                          text-white
                        "
                      >
                        {selectedAgent.name}
                      </h2>

                      <span
                        className="
                          rounded-full
                          bg-emerald-500/10
                          px-2.5
                          py-1
                          text-[10px]
                          font-medium
                          text-emerald-400
                        "
                      >
                        Ready
                      </span>
                    </div>

                    <p
                      className="
                        mt-1
                        truncate
                        text-sm
                        text-slate-500
                      "
                    >
                      {selectedAgent.description}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* WORKSPACE */}

            <div
              className="
                rounded-2xl
                border
                border-white/10
                bg-[#0B1220]
              "
            >
              {/* WORKSPACE HEADER */}

              <div
                className="
                  flex
                  items-center
                  justify-between
                  gap-4
                  border-b
                  border-white/10
                  p-5
                "
              >
                <div>
                  <h3
                    className="
                      text-lg
                      font-semibold
                      text-white
                    "
                  >
                    Agent Workspace
                  </h3>

                  <p
                    className="
                      mt-1
                      text-xs
                      text-slate-500
                    "
                  >
                    Give the agent a task or question.
                  </p>
                </div>

                <div
                  className="
                    flex
                    shrink-0
                    items-center
                    gap-2
                  "
                >
                  {/* HISTORY */}

                  <button
                    type="button"
                    onClick={() =>
                      setShowHistory(
                        (previous) =>
                          !previous
                      )
                    }
                    disabled={running}
                    className="
                      flex
                      items-center
                      gap-2
                      rounded-xl
                      border
                      border-cyan-500/20
                      bg-cyan-500/5
                      px-3
                      py-2
                      text-xs
                      font-medium
                      text-cyan-300
                      transition
                      hover:border-cyan-500/40
                      hover:bg-cyan-500/10
                      disabled:cursor-not-allowed
                      disabled:opacity-40
                    "
                  >
                    <History size={14} />

                    History

                    {agentHistory.length > 0 && (
                      <span
                        className="
                          rounded-full
                          bg-cyan-500/10
                          px-1.5
                          py-0.5
                          text-[10px]
                          text-cyan-300
                        "
                      >
                        {agentHistory.length}
                      </span>
                    )}
                  </button>

                  {/* NEW CHAT */}

                  {(history.length > 0 ||
                    response ||
                    prompt) && (
                    <button
                      type="button"
                      onClick={
                        newConversation
                      }
                      disabled={running}
                      className="
                        flex
                        items-center
                        gap-2
                        rounded-xl
                        border
                        border-white/10
                        bg-white/3
                        px-3
                        py-2
                        text-xs
                        font-medium
                        text-slate-300
                        transition
                        hover:bg-white/5
                        hover:text-white
                        disabled:cursor-not-allowed
                        disabled:opacity-40
                      "
                    >
                      <Plus size={14} />
                      New Chat
                    </button>
                  )}
                </div>
              </div>

              {/* HISTORY PANEL */}

              {showHistory && (
                <div
                  className="
                    border-b
                    border-white/10
                    bg-[#080E19]
                  "
                >
                  <div
                    className="
                      flex
                      items-center
                      justify-between
                      border-b
                      border-white/5
                      px-5
                      py-3
                    "
                  >
                    <div
                      className="
                        flex
                        items-center
                        gap-2
                      "
                    >
                      <History
                        size={15}
                        className="text-cyan-400"
                      />

                      <span
                        className="
                          text-sm
                          font-semibold
                          text-white
                        "
                      >
                        Conversation History
                      </span>
                    </div>

                    {agentHistory.length > 0 && (
                      <button
                        type="button"
                        onClick={
                          clearAllHistory
                        }
                        disabled={running}
                        className="
                          text-xs
                          text-red-400
                          transition
                          hover:text-red-300
                          disabled:opacity-40
                        "
                      >
                        Clear All
                      </button>
                    )}
                  </div>

                  {agentHistory.length === 0 ? (
                    <div
                      className="
                        px-5
                        py-8
                        text-center
                      "
                    >
                      <History
                        size={28}
                        className="
                          mx-auto
                          mb-3
                          text-slate-700
                        "
                      />

                      <p
                        className="
                          text-sm
                          font-medium
                          text-slate-400
                        "
                      >
                        No conversation history
                      </p>

                      <p
                        className="
                          mt-1
                          text-xs
                          text-slate-600
                        "
                      >
                        Completed chats will
                        appear here.
                      </p>
                    </div>
                  ) : (
                    <div
                      className="
                        max-h-72
                        overflow-y-auto
                      "
                    >
                      {agentHistory.map(
                        (conversation) => {
                          const firstUserMessage =
                            conversation.messages.find(
                              (message) =>
                                message.role ===
                                "user"
                            );

                          return (
                            <div
                              key={
                                conversation.id
                              }
                              className="
                                group
                                flex
                                items-center
                                gap-3
                                border-b
                                border-white/5
                                px-5
                                py-3
                                transition
                                hover:bg-white/3
                              "
                            >
                              <button
                                type="button"
                                onClick={() =>
                                  loadConversation(
                                    conversation
                                  )
                                }
                                className="
                                  min-w-0
                                  flex-1
                                  text-left
                                "
                              >
                                <p
                                  className="
                                    truncate
                                    text-sm
                                    font-medium
                                    text-slate-200
                                  "
                                >
                                  {firstUserMessage?.content ||
                                    "Conversation"}
                                </p>

                                <div
                                  className="
                                    mt-1
                                    flex
                                    items-center
                                    gap-2
                                    text-[10px]
                                    text-slate-600
                                  "
                                >
                                  <Clock
                                    size={11}
                                  />

                                  {new Date(
                                    conversation.createdAt
                                  ).toLocaleString()}
                                </div>
                              </button>

                              <button
                                type="button"
                                onClick={() =>
                                  deleteConversation(
                                    conversation.id
                                  )
                                }
                                disabled={
                                  running
                                }
                                title="Delete conversation"
                                className="
                                  rounded-lg
                                  p-2
                                  text-slate-600
                                  opacity-0
                                  transition
                                  hover:bg-red-500/10
                                  hover:text-red-400
                                  group-hover:opacity-100
                                  disabled:opacity-40
                                "
                              >
                                <Trash2
                                  size={14}
                                />
                              </button>
                            </div>
                          );
                        }
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* CONTEXT INDICATOR */}

              {history.length > 0 && (
                <div
                  className="
                    flex
                    items-center
                    justify-between
                    border-b
                    border-white/5
                    bg-cyan-500/3
                    px-5
                    py-2.5
                  "
                >
                  <div
                    className="
                      flex
                      items-center
                      gap-2
                    "
                  >
                    <Activity
                      size={13}
                      className="text-cyan-400"
                    />

                    <span
                      className="
                        text-xs
                        text-cyan-300
                      "
                    >
                      Conversation context active
                    </span>
                  </div>

                  <span
                    className="
                      text-[10px]
                      text-slate-600
                    "
                  >
                    {
                      history.filter(
                        (message) =>
                          message.role ===
                          "user"
                      ).length
                    }{" "}
                    exchanges
                  </span>
                </div>
              )}

              {/* MAIN GRID */}

              <div
                className="
                  grid
                  gap-6
                  p-5
                  lg:grid-cols-2
                "
              >
                {/* LEFT */}

                <div className="space-y-5">
                  {/* PROJECT CONTEXT */}

                  <div
                    className="
                      rounded-2xl
                      border
                      border-cyan-500/10
                      bg-cyan-500/3
                      p-4
                    "
                  >
                    <div
                      className="
                        mb-3
                        flex
                        items-center
                        gap-2
                      "
                    >
                      <Sparkles
                        size={15}
                        className="text-cyan-400"
                      />

                      <span
                        className="
                          text-sm
                          font-semibold
                          text-white
                        "
                      >
                        Project Context
                      </span>

                      <span
                        className="
                          rounded-full
                          bg-white/5
                          px-2
                          py-0.5
                          text-[9px]
                          text-slate-500
                        "
                      >
                        Optional
                      </span>
                    </div>

                    <p
                      className="
                        mb-3
                        text-xs
                        leading-5
                        text-slate-600
                      "
                    >
                      Give the agent information
                      about your project so
                      responses are more specific
                      and useful.
                    </p>

                    <div className="relative">
                      <select
                        value={
                          contextType
                        }
                        onChange={(event) =>
                          handleContextChange(
                            event.target
                              .value as ProjectContextType
                          )
                        }
                        disabled={running}
                        className="
                          w-full
                          appearance-none
                          rounded-xl
                          border
                          border-white/10
                          bg-[#080E19]
                          px-3
                          py-2.5
                          pr-9
                          text-xs
                          text-slate-300
                          outline-none
                          transition
                          focus:border-cyan-500/40
                          disabled:opacity-50
                        "
                      >
                        <option value="none">
                          No Project Context
                        </option>

                        <option value="webapp">
                          Full-stack Web Application
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

                      <ChevronDown
                        size={14}
                        className="
                          pointer-events-none
                          absolute
                          right-3
                          top-1/2
                          -translate-y-1/2
                          text-slate-600
                        "
                      />
                    </div>

                    {contextType !==
                      "none" && (
                      <textarea
                        rows={5}
                        value={
                          projectContext
                        }
                        onChange={(event) =>
                          setProjectContext(
                            event.target.value
                          )
                        }
                        disabled={running}
                        placeholder="
Describe your project, stack, architecture,
database, requirements, etc.
"
                        className="
                          mt-3
                          w-full
                          resize-none
                          rounded-xl
                          border
                          border-white/10
                          bg-[#080E19]
                          px-3
                          py-2.5
                          text-xs
                          leading-5
                          text-slate-300
                          outline-none
                          placeholder:text-slate-700
                          focus:border-cyan-500/40
                          disabled:opacity-50
                        "
                      />
                    )}
                  </div>

                  {/* TASK */}

                  <div>
                    <div
                      className="
                        mb-2
                        flex
                        items-center
                        gap-2
                      "
                    >
                      <Activity
                        size={15}
                        className="text-cyan-400"
                      />

                      <label
                        className="
                          text-sm
                          font-semibold
                          text-white
                        "
                      >
                        Give the agent a task
                      </label>
                    </div>

                    <textarea
                      rows={11}
                      value={prompt}
                      onChange={(event) =>
                        setPrompt(
                          event.target.value
                        )
                      }
                      onKeyDown={
                        handlePromptKeyDown
                      }
                      disabled={running}
                      placeholder={`Ask ${selectedAgent.name} something...`}
                      className="
                        w-full
                        resize-none
                        rounded-2xl
                        border
                        border-white/10
                        bg-[#080E19]
                        px-4
                        py-3
                        text-sm
                        leading-6
                        text-slate-300
                        outline-none
                        placeholder:text-slate-700
                        transition
                        focus:border-cyan-500/40
                        disabled:cursor-not-allowed
                        disabled:opacity-50
                      "
                    />

                    <p
                      className="
                        mt-2
                        text-[10px]
                        text-slate-700
                      "
                    >
                      Enter to run • Shift + Enter
                      for new line
                    </p>
                  </div>

                  {/* RUN */}

                  <button
                    type="button"
                    onClick={runAgent}
                    disabled={
                      !prompt.trim() ||
                      running
                    }
                    className="
                      flex
                      w-full
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
                      disabled:cursor-not-allowed
                      disabled:opacity-40
                    "
                  >
                    {running ? (
                      <>
                        <Loader2
                          size={17}
                          className="animate-spin"
                        />
                        Agent is thinking...
                      </>
                    ) : (
                      <>
                        <Send size={17} />
                        Run Agent
                      </>
                    )}
                  </button>
                </div>

                {/* RIGHT OUTPUT */}

                <div
                  className="
                    flex
                    min-h-125
                    flex-col
                    overflow-hidden
                    rounded-2xl
                    border
                    border-white/10
                    bg-[#080E19]
                  "
                >
                  {/* OUTPUT HEADER */}

                  <div
                    className="
                      flex
                      items-center
                      justify-between
                      border-b
                      border-white/10
                      px-5
                      py-4
                    "
                  >
                    <div>
                      <h3
                        className="
                          text-sm
                          font-semibold
                          text-white
                        "
                      >
                        Agent Output
                      </h3>

                      <p
                        className="
                          mt-1
                          text-[10px]
                          text-slate-600
                        "
                      >
                        Gemini-powered response
                      </p>
                    </div>

                    <div
                      className="
                        flex
                        items-center
                        gap-2
                      "
                    >
                      {response &&
                        !running && (
                          <button
                            type="button"
                            onClick={
                              copyResponse
                            }
                            className="
                              flex
                              items-center
                              gap-1.5
                              rounded-lg
                              border
                              border-white/10
                              bg-white/3
                              px-2.5
                              py-1.5
                              text-[10px]
                              text-slate-400
                              transition
                              hover:bg-white/5
                              hover:text-white
                            "
                          >
                            {copied ? (
                              <>
                                <Check
                                  size={12}
                                />
                                Copied
                              </>
                            ) : (
                              <>
                                <Copy
                                  size={12}
                                />
                                Copy
                              </>
                            )}
                          </button>
                        )}

                      {response &&
                        !running && (
                          <span
                            className="
                              rounded-full
                              bg-emerald-500/10
                              px-2.5
                              py-1
                              text-[10px]
                              font-medium
                              text-emerald-400
                            "
                          >
                            Completed
                          </span>
                        )}
                    </div>
                  </div>

                  {/* OUTPUT BODY */}

                  <div
                    className="
                      flex-1
                      overflow-y-auto
                      p-5
                    "
                  >
                    {/* THINKING */}

                    {running &&
                      !response && (
                        <div
                          className="
                            flex
                            min-h-105
                            flex-col
                            items-center
                            justify-center
                            text-center
                          "
                        >
                          <div
                            className="
                              flex
                              h-14
                              w-14
                              items-center
                              justify-center
                              rounded-2xl
                              bg-cyan-500/10
                            "
                          >
                            <Sparkles
                              size={24}
                              className="
                                animate-pulse
                                text-cyan-400
                              "
                            />
                          </div>

                          <p
                            className="
                              mt-4
                              text-sm
                              font-medium
                              text-white
                            "
                          >
                            {selectedAgent.name}{" "}
                            is analyzing...
                          </p>

                          <p
                            className="
                              mt-1
                              max-w-xs
                              text-xs
                              leading-5
                              text-slate-600
                            "
                          >
                            Gemini AI is processing
                            your request.
                          </p>
                        </div>
                      )}

                    {/* RESPONSE */}

                    {response && (
                      <div
                        className="
                          whitespace-pre-wrap
                          text-sm
                          leading-7
                          text-slate-300
                        "
                      >
                        {response}

                        {running && (
                          <span
                            className="
                              ml-1
                              inline-block
                              animate-pulse
                              text-cyan-400
                            "
                          >
                            ▌
                          </span>
                        )}
                      </div>
                    )}

                    {/* EMPTY */}

                    {!running &&
                      !response &&
                      !error && (
                        <div
                          className="
                            flex
                            min-h-105
                            flex-col
                            items-center
                            justify-center
                            text-center
                          "
                        >
                          <div
                            className="
                              flex
                              h-14
                              w-14
                              items-center
                              justify-center
                              rounded-2xl
                              bg-white/3
                            "
                          >
                            <Bot
                              size={24}
                              className="text-slate-700"
                            />
                          </div>

                          <p
                            className="
                              mt-4
                              text-sm
                              font-medium
                              text-slate-500
                            "
                          >
                            Ready for your instruction
                          </p>

                          <p
                            className="
                              mt-1
                              max-w-xs
                              text-xs
                              leading-5
                              text-slate-700
                            "
                          >
                            Give the agent a task and
                            its response will appear here.
                          </p>
                        </div>
                      )}

                    {/* ERROR */}

                    {error && (
                      <div
                        className="
                          rounded-2xl
                          border
                          border-red-500/20
                          bg-red-500/5
                          p-4
                        "
                      >
                        <div
                          className="
                            flex
                            items-center
                            justify-between
                          "
                        >
                          <p
                            className="
                              text-xs
                              font-semibold
                              text-red-400
                            "
                          >
                            Agent Error
                          </p>

                          <button
                            type="button"
                            onClick={() =>
                              setError("")
                            }
                            className="
                              text-red-500
                              hover:text-red-400
                            "
                          >
                            <X size={14} />
                          </button>
                        </div>

                        <p
                          className="
                            mt-2
                            whitespace-pre-wrap
                            text-xs
                            leading-5
                            text-red-300/70
                          "
                        >
                          {error}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
export default function AgentsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-[#070B14] text-white">
          <div className="flex items-center gap-3 text-sm text-slate-400">
            <Loader2
              size={18}
              className="animate-spin text-cyan-400"
            />
            Loading AI Agents...
          </div>
        </div>
      }
    >
      <AgentsPageContent />
    </Suspense>
  );
}