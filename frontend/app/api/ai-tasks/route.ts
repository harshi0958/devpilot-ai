import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

type AgentType =
  | "architect"
  | "developer"
  | "uiux"
  | "debugger"
  | "testing"
  | "documentation";

const agentNames: Record<
  AgentType,
  string
> = {
  architect: "Architect Agent",
  developer: "Developer Agent",
  uiux: "UI/UX Agent",
  debugger: "Debugger Agent",
  testing: "Testing Agent",
  documentation:
    "Documentation Agent",
};

const defaultInstructions: Record<
  AgentType,
  string
> = {
  architect: `
You are a senior software architect.

Analyze software projects and provide practical architecture recommendations.

Focus on:
- System architecture
- Frontend and backend structure
- Database design
- APIs
- Authentication
- Security
- Scalability
- Technology choices
- Development phases

Give clear and structured recommendations.
`,

  developer: `
You are an expert full-stack software developer.

Help users implement software features.

Focus on:
- Clean code
- Project structure
- APIs
- Components
- Backend logic
- Database integration
- Error handling
- Practical implementation
- Code examples when useful

Give actionable development guidance.
`,

  uiux: `
You are a senior UI/UX designer.

Analyze software projects and recommend modern user experiences.

Focus on:
- Page structure
- User flows
- UI components
- Responsive design
- Accessibility
- Navigation
- Visual hierarchy
- Forms
- Dashboards
- Usability

Give practical design recommendations.
`,

  debugger: `
You are an expert software debugging engineer.

Analyze programming errors and technical problems.

Focus on:
- Root cause
- Error explanation
- Problematic code
- Step-by-step fixes
- Prevention
- Better implementation

Do not simply provide a workaround.
Explain why the issue happens.
`,

  testing: `
You are a senior software testing engineer.

Analyze software projects and create comprehensive testing strategies.

Focus on:
- Unit testing
- Integration testing
- Functional testing
- UI testing
- API testing
- Security testing
- Edge cases
- Validation
- Regression testing

Provide practical test cases and recommendations.
`,

  documentation: `
You are a professional technical documentation engineer.

Create clear and developer-friendly documentation.

Focus on:
- README documentation
- Project overview
- Installation
- Configuration
- Environment variables
- Features
- API documentation
- Usage
- Folder structure
- Deployment
- Troubleshooting

Use clean headings and structured content.
`,
};

export async function POST(
  request: Request
) {
  try {
    // =================================
    // Check API Key
    // =================================

    if (
      !process.env.GEMINI_API_KEY
    ) {
      return NextResponse.json(
        {
          error:
            "GEMINI_API_KEY is not configured.",
        },
        {
          status: 500,
        }
      );
    }

    // =================================
    // Read Request
    // =================================

    const body = await request.json();

    const agentType =
      body?.agentType as AgentType;

    const prompt =
      typeof body?.prompt === "string"
        ? body.prompt.trim()
        : "";

    const instruction =
      typeof body?.instruction === "string"
        ? body.instruction.trim()
        : "";

    // =================================
    // Validate Agent Type
    // =================================

    const validAgentTypes: AgentType[] =
      [
        "architect",
        "developer",
        "uiux",
        "debugger",
        "testing",
        "documentation",
      ];

    if (
      !validAgentTypes.includes(
        agentType
      )
    ) {
      return NextResponse.json(
        {
          error:
            "Invalid AI agent type.",
        },
        {
          status: 400,
        }
      );
    }

    // =================================
    // Validate Prompt
    // =================================

    if (!prompt) {
      return NextResponse.json(
        {
          error:
            "Please provide a task for the AI agent.",
        },
        {
          status: 400,
        }
      );
    }

    // =================================
    // Select Agent Instruction
    // =================================

    const systemInstruction =
      instruction ||
      defaultInstructions[
        agentType
      ];

    const agentName =
      agentNames[agentType];

    // =================================
    // Build AI Prompt
    // =================================

    const finalPrompt = `
You are ${agentName}, part of DevPilot AI.

DevPilot AI is an AI-powered multi-agent
software development assistant.

Your role:
${systemInstruction}

Important rules:
- Understand the user's request before responding.
- Provide practical and technically useful answers.
- Use clear headings and bullet points where appropriate.
- Do not invent project information that was not provided.
- If information is missing, clearly state your assumption.
- Focus specifically on your assigned agent role.
- Avoid unnecessary generic explanations.
- Give actionable recommendations.

User's task:

${prompt}
`;

    // =================================
    // Gemini Request
    // =================================

    const response =
      await ai.models.generateContent({
        model: "gemini-3.6-flash",

        contents: finalPrompt,

        config: {
          temperature: 0.7,

          maxOutputTokens: 4000,
        },
      });

    // =================================
    // Read Gemini Response
    // =================================

    const text =
      response.text?.trim();

    if (!text) {
      return NextResponse.json(
        {
          error:
            "Gemini returned an empty response.",
        },
        {
          status: 500,
        }
      );
    }

    // =================================
    // Return Response
    // =================================

    return NextResponse.json({
      success: true,
      agentType,
      agentName,
      response: text,
    });
  } catch (error) {
    console.error(
      "AI Agent Generation Error:",
      error
    );

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to execute AI agent.",
      },
      {
        status: 500,
      }
    );
  }
}