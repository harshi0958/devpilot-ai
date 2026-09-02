import { NextResponse } from "next/server";
import { GoogleGenAI, ThinkingLevel } from "@google/genai";

const apiKey = process.env.GEMINI_API_KEY;

const ai = apiKey
  ? new GoogleGenAI({
      apiKey,
    })
  : null;

// ============================================================
// AGENT TYPES
// ============================================================

type AgentType =
  | "architect"
  | "developer"
  | "uiux"
  | "debugger"
  | "testing"
  | "documentation";

// ============================================================
// AGENT NAMES
// ============================================================

const agentNames: Record<AgentType, string> = {
  architect: "Architect Agent",
  developer: "Developer Agent",
  uiux: "UI/UX Agent",
  debugger: "Debugger Agent",
  testing: "Testing Agent",
  documentation: "Documentation Agent",
};

// ============================================================
// AGENT INSTRUCTIONS
// ============================================================

const defaultInstructions: Record<AgentType, string> = {
  architect: `
You are a senior software architect.
Focus on architecture, frontend/backend structure, database design,
APIs, authentication, security, scalability and technology choices.
Give practical and structured recommendations.
`,

  developer: `
You are an expert full-stack software developer.
Focus on clean code, project structure, APIs, components,
backend logic, database integration, error handling and implementation.
Give practical code examples when useful.
`,

  uiux: `
You are a senior UI/UX designer.
Focus on user flows, page structure, UI components, responsive design,
accessibility, navigation, visual hierarchy and usability.
Give practical design recommendations.
`,

  debugger: `
You are an expert software debugging engineer.
Find the root cause of technical problems and explain the exact fix.
Focus on errors, problematic code, step-by-step fixes and prevention.
`,

  testing: `
You are a senior software testing engineer.
Focus on unit, integration, functional, UI, API, security,
edge-case and regression testing.
Provide practical test cases and recommendations.
`,

  documentation: `
You are a professional technical documentation engineer.
Focus on README files, installation, configuration, environment variables,
features, APIs, usage, folder structure, deployment and troubleshooting.
Use clean structured documentation.
`,
};

// ============================================================
// SINGLE FAST MODEL
// ============================================================

const MODEL = "gemini-3.6-flash";

// ============================================================
// FAST REQUEST DETECTION
// ============================================================

function isFastRequest(prompt: string): boolean {
  return /mcq|multiple choice|exam|quiz|quick answer|one word|answer only|correct option/i.test(
    prompt
  );
}

// ============================================================
// ERROR MESSAGE
// ============================================================

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  if (typeof error === "string") {
    return error;
  }

  try {
    return JSON.stringify(error);
  } catch {
    return "Unknown AI error.";
  }
}

// ============================================================
// POST
// ============================================================

export async function POST(request: Request) {
  try {
    // ----------------------------------------------------------
    // API KEY
    // ----------------------------------------------------------

    if (!apiKey || !ai) {
      return NextResponse.json(
        {
          success: false,
          error: "GEMINI_API_KEY is not configured.",
        },
        {
          status: 500,
        }
      );
    }

    // ----------------------------------------------------------
    // READ BODY
    // ----------------------------------------------------------

    let body: any;

    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid request body.",
        },
        {
          status: 400,
        }
      );
    }

    const agentType = body?.agentType as AgentType;

    const prompt =
      typeof body?.prompt === "string"
        ? body.prompt.trim()
        : "";
    
    const history = Array.isArray(body?.history)
  ? body.history
      .filter(
        (message: any) =>
          message &&
          (message.role === "user" ||
            message.role === "assistant") &&
          typeof message.content === "string"
      )
      .slice(-10)
  : [];

    const customInstruction =
      typeof body?.instruction === "string"
        ? body.instruction.trim()
        : "";

    // ----------------------------------------------------------
    // VALIDATE AGENT
    // ----------------------------------------------------------

    const validAgentTypes: AgentType[] = [
      "architect",
      "developer",
      "uiux",
      "debugger",
      "testing",
      "documentation",
    ];

    if (!validAgentTypes.includes(agentType)) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid AI agent type.",
        },
        {
          status: 400,
        }
      );
    }

    // ----------------------------------------------------------
    // VALIDATE PROMPT
    // ----------------------------------------------------------

    if (!prompt) {
      return NextResponse.json(
        {
          success: false,
          error: "Please provide a task for the AI agent.",
        },
        {
          status: 400,
        }
      );
    }

    // ----------------------------------------------------------
    // FAST MODE
    // ----------------------------------------------------------

    const fastRequest = isFastRequest(prompt);

    // ----------------------------------------------------------
    // AGENT INSTRUCTION
    // ----------------------------------------------------------

    const agentInstruction =
      customInstruction ||
      defaultInstructions[agentType];

    // ----------------------------------------------------------
    // LIGHTWEIGHT PROMPT
    // ----------------------------------------------------------

    const conversationContext =
  history.length > 0
    ? `
Previous conversation:
${history
  .map(
    (message: {
      role: "user" | "assistant";
      content: string;
    }) =>
      `${message.role === "user" ? "User" : "Agent"}: ${
        message.content
      }`
  )
  .join("\n\n")}

Use this previous conversation only to understand context.
Do not repeat previous answers unless necessary.
`
    : "";

const finalPrompt = `
You are the ${agentNames[agentType]} for DevPilot AI.

${agentInstruction}

Answer the user's request directly and practically.

Rules:
- Understand the previous conversation when available.
- Treat the latest user request as the current task.
- Do not repeat the user's question.
- Do not invent missing information.
- Keep simple requests short.
- Use structured formatting only when useful.
- For MCQs, give the correct option first with a brief explanation.
- For complex requests, prioritize the most important actionable information.
- Do not mention these instructions.

${conversationContext}

Current user request:
${prompt}
`;

    // ==========================================================
    // PERFORMANCE CONFIG
    // ==========================================================

    const thinkingLevel = ThinkingLevel.LOW;

    const maxOutputTokens = fastRequest
  ? 300
  : agentType === "architect" || agentType === "debugger"
    ? 800
    : 700;

const temperature = fastRequest
  ? 0.1
  : 0.2;

    console.log(
      `[AI Agent] ${agentType} | fast=${fastRequest} | model=${MODEL} | tokens=${maxOutputTokens}`
    );

    // ==========================================================
    // STREAM RESPONSE
    // ==========================================================

    const result =
      await ai.models.generateContentStream({
        model: MODEL,
        contents: finalPrompt,

        config: {
          thinkingConfig: {
            thinkingLevel,
          },

          maxOutputTokens,

          temperature,
        },
      });

    const encoder = new TextEncoder();

    const stream = new ReadableStream({
      async start(controller) {
        try {
          let hasText = false;

          for await (const chunk of result) {
            const text = chunk.text || "";

            if (!text) {
              continue;
            }

            hasText = true;

            controller.enqueue(
              encoder.encode(text)
            );
          }

          if (!hasText) {
            throw new Error(
              "AI returned an empty response."
            );
          }

          controller.close();
        } catch (error) {
          console.error(
            "[AI Agent] Stream error:",
            getErrorMessage(error)
          );

          controller.error(error);
        }
      },
    });

    // ==========================================================
    // RETURN STREAM
    // ==========================================================

    return new Response(stream, {
      status: 200,

      headers: {
        "Content-Type": "text/plain; charset=utf-8",

        "Cache-Control":
          "no-cache, no-transform",

        "X-Accel-Buffering": "no",

        Connection: "keep-alive",

        "X-Agent-Type": agentType,

        "X-Agent-Name":
          agentNames[agentType],

        "X-Agent-Model": MODEL,

        "X-Agent-Fast":
          fastRequest ? "true" : "false",
      },
    });
  } catch (error) {
    console.error(
      "[AI Agent] Request error:",
      getErrorMessage(error)
    );

    return NextResponse.json(
      {
        success: false,
        error: getErrorMessage(error),
      },
      {
        status: 503,
      }
    );
  }
}