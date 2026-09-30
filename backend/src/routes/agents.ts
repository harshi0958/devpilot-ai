import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import { executeAgent } from "../services/agent.service";
import {
  authenticate,
  AuthenticatedRequest,
} from "../middleware/auth.middleware";

const router = Router();
const prisma = new PrismaClient();

/**
 * POST /api/agents/workflow/build
 *
 * Autonomous Architect -> Developer workflow.
 *
 * Flow:
 * User Prompt
 *      ↓
 * Architect Agent
 *      ↓
 * Architecture Plan
 *      ↓
 * Developer Agent
 *      ↓
 * Project Files
 */
router.post(
  "/workflow/build",
  authenticate,
  async (req: AuthenticatedRequest, res) => {
    try {
      /*
      |--------------------------------------------------------------------------
      | Authentication
      |--------------------------------------------------------------------------
      */

      if (!req.user?.userId) {
        return res.status(401).json({
          success: false,
          message:
            "Authentication required. Please login first.",
        });
      }

      /*
      |--------------------------------------------------------------------------
      | Request Data
      |--------------------------------------------------------------------------
      */

      const {
        prompt,
        projectId,
        conversationId,
      } = req.body;

      /*
      |--------------------------------------------------------------------------
      | Prompt Validation
      |--------------------------------------------------------------------------
      */

      if (
        typeof prompt !== "string" ||
        !prompt.trim()
      ) {
        return res.status(400).json({
          success: false,
          message: "Please provide a valid prompt.",
        });
      }

      /*
      |--------------------------------------------------------------------------
      | Project Validation
      |--------------------------------------------------------------------------
      */

      if (
        typeof projectId !== "string" ||
        !projectId.trim()
      ) {
        return res.status(400).json({
          success: false,
          message:
            "projectId is required for autonomous project generation.",
        });
      }

      const project =
        await prisma.project.findFirst({
          where: {
            id: projectId.trim(),
            ownerId: req.user.userId,
          },

          select: {
            id: true,
            name: true,
            ownerId: true,
          },
        });

      if (!project) {
        return res.status(404).json({
          success: false,
          message:
            "Project not found or you do not have access to it.",
        });
      }

      /*
      |--------------------------------------------------------------------------
      | Find Architect Agent
      |--------------------------------------------------------------------------
      */

      const architect =
        await prisma.agent.findFirst({
          where: {
            type: "ARCHITECT",
            isActive: true,
          },

          select: {
            id: true,
            name: true,
            type: true,
          },
        });

      if (!architect) {
        return res.status(404).json({
          success: false,
          message:
            "Architect agent is not available.",
        });
      }

      /*
      |--------------------------------------------------------------------------
      | Find Developer Agent
      |--------------------------------------------------------------------------
      */

      const developer =
        await prisma.agent.findFirst({
          where: {
            type: "DEVELOPER",
            isActive: true,
          },

          select: {
            id: true,
            name: true,
            type: true,
          },
        });

      if (!developer) {
        return res.status(404).json({
          success: false,
          message:
            "Developer agent is not available.",
        });
      }

      /*
      |--------------------------------------------------------------------------
      | Step 1: Architect
      |--------------------------------------------------------------------------
      */

      console.log(
        `Autonomous workflow started | project=${project.name}`
      );

      console.log(
        `Step 1: Architect Agent | agentId=${architect.id}`
      );

      const architectResult =
        await executeAgent({
          agentId: architect.id,

          prompt: `
Analyze the following software project request and create a complete implementation architecture.

USER REQUEST
============
${prompt.trim()}

PROJECT
=======
${project.name}

ARCHITECT RESPONSIBILITIES
==========================
1. Understand the requested functionality.
2. Define the database/data model.
3. Define backend API structure.
4. Define frontend structure.
5. Define important components and services.
6. Define required files.
7. Define how the components connect.
8. Keep the existing DevPilot project architecture and technology stack.
9. Do not write the final implementation code.
10. Produce a clear implementation plan that another Developer Agent can directly follow.

Return a structured architecture and implementation plan.
`,

          userId: req.user.userId,

          projectId: project.id,

          conversationId:
            typeof conversationId === "string" &&
            conversationId.trim()
              ? conversationId.trim()
              : undefined,
        });

      /*
      |--------------------------------------------------------------------------
      | Step 2: Developer
      |--------------------------------------------------------------------------
      */

      console.log(
        `Step 2: Developer Agent | agentId=${developer.id}`
      );

      const developerPrompt = `
Build the requested software feature using the architecture created by the Architect Agent.

USER REQUEST
============
${prompt.trim()}

ARCHITECT AGENT PLAN
====================
${architectResult.response}

DEVELOPER RESPONSIBILITIES
==========================
1. Follow the Architect Agent plan.
2. Use the existing DevPilot project architecture as the source of truth.
3. Generate actual implementation files.
4. Generate complete file contents.
5. Do not generate pseudocode.
6. Do not replace the existing technology stack.
7. Keep file paths relative to the project root.
8. Generate all required files for the requested implementation.

FILE OUTPUT FORMAT
==================
Return generated files using this exact structure:

{
  "files": [
    {
      "path": "relative/path/to/file.ts",
      "content": "complete file content"
    }
  ]
}

Return valid JSON only.
Do not wrap the JSON inside markdown code fences.
`;

      const developerResult =
        await executeAgent({
          agentId: developer.id,

          prompt: developerPrompt,

          userId: req.user.userId,

          projectId: project.id,

          conversationId:
            typeof conversationId === "string" &&
            conversationId.trim()
              ? conversationId.trim()
              : undefined,
        });

      /*
      |--------------------------------------------------------------------------
      | Workflow Completed
      |--------------------------------------------------------------------------
      */

      console.log(
        `Autonomous workflow completed | project=${project.name}`
      );

      return res.status(200).json({
        success: true,

        message:
          "Architect to Developer workflow completed successfully.",

        workflow: {
          projectId: project.id,
          projectName: project.name,

          architect: {
            agentId: architect.id,
            agentName: architect.name,
            executionId:
              architectResult.executionId,
          },

          developer: {
            agentId: developer.id,
            agentName: developer.name,
            executionId:
              developerResult.executionId,
          },
        },

        results: {
          architecture:
            architectResult.response,

          development:
            developerResult.response,
        },
      });
    } catch (error) {
      console.error(
        "Autonomous Build Workflow Error:",
        error
      );

      const errorMessage =
        error instanceof Error
          ? error.message
          : "Autonomous build workflow failed.";

      return res.status(500).json({
        success: false,
        message: errorMessage,
      });
    }
  }
);

/**
 * POST /api/agents/workflow/test
 *
 * Autonomous Testing workflow.
 *
 * Flow:
 * Project Files
 *      ↓
 * Testing Agent
 *      ↓
 * Test / Bug Analysis
 */
router.post(
  "/workflow/test",
  authenticate,
  async (req: AuthenticatedRequest, res) => {
    try {
      /*
      |--------------------------------------------------------------------------
      | Authentication
      |--------------------------------------------------------------------------
      */

      if (!req.user?.userId) {
        return res.status(401).json({
          success: false,
          message:
            "Authentication required. Please login first.",
        });
      }

      /*
      |--------------------------------------------------------------------------
      | Request Data
      |--------------------------------------------------------------------------
      */

      const {
        projectId,
        conversationId,
      } = req.body;

      /*
      |--------------------------------------------------------------------------
      | Project Validation
      |--------------------------------------------------------------------------
      */

      if (
        typeof projectId !== "string" ||
        !projectId.trim()
      ) {
        return res.status(400).json({
          success: false,
          message: "projectId is required.",
        });
      }

      /*
      |--------------------------------------------------------------------------
      | Verify Project Ownership
      |--------------------------------------------------------------------------
      */

      const project =
        await prisma.project.findFirst({
          where: {
            id: projectId.trim(),
            ownerId: req.user.userId,
          },

          select: {
            id: true,
            name: true,
          },
        });

      if (!project) {
        return res.status(404).json({
          success: false,
          message:
            "Project not found or you do not have access to it.",
        });
      }

      /*
      |--------------------------------------------------------------------------
      | Load Project Files
      |--------------------------------------------------------------------------
      */

      const files =
        await prisma.projectFile.findMany({
          where: {
            projectId: project.id,
            type: "FILE",
          },

          orderBy: {
            path: "asc",
          },

          select: {
            path: true,
            content: true,
          },
        });

      if (files.length === 0) {
        return res.status(400).json({
          success: false,
          message:
            "No project files found. Generate project files before running tests.",
        });
      }

      /*
      |--------------------------------------------------------------------------
      | Build Testing Context
      |--------------------------------------------------------------------------
      */

      const fileContext = files
        .map((file) => {
          const content =
            file.content || "";

          return `
FILE: ${file.path}
====================
${content}
====================
`;
        })
        .join("\n");

      /*
      |--------------------------------------------------------------------------
      | Find Testing Agent
      |--------------------------------------------------------------------------
      */

      const testingAgent =
        await prisma.agent.findFirst({
          where: {
            type: "TESTING",
            isActive: true,
          },

          select: {
            id: true,
            name: true,
            type: true,
          },
        });

      if (!testingAgent) {
        return res.status(404).json({
          success: false,
          message:
            "Testing agent is not available.",
        });
      }

      /*
      |--------------------------------------------------------------------------
      | Execute Testing Agent
      |--------------------------------------------------------------------------
      */

      console.log(
        `Testing workflow started | project=${project.name} | files=${files.length}`
      );

      const testingResult =
        await executeAgent({
          agentId: testingAgent.id,

          prompt: `
Analyze the generated project files below and perform a software testing review.

PROJECT
=======
${project.name}

PROJECT FILES
============
${fileContext}

TESTING RESPONSIBILITIES
========================
1. Review all provided files.
2. Identify syntax errors.
3. Identify TypeScript errors.
4. Identify incorrect imports.
5. Identify API route inconsistencies.
6. Identify database/Prisma issues.
7. Identify authentication/security issues.
8. Identify frontend/backend integration issues.
9. Identify obvious runtime errors.
10. Identify missing required implementation pieces.

For every issue provide:
- severity
- file
- problem
- reason
- recommended fix

Also provide:
- overall test status
- total issues found
- files reviewed

Return the result in this structure:

{
  "status": "PASS" | "FAIL",
  "totalIssues": 0,
  "filesReviewed": 0,
  "issues": [
    {
      "severity": "HIGH" | "MEDIUM" | "LOW",
      "file": "path/to/file.ts",
      "problem": "Description",
      "reason": "Why this is a problem",
      "recommendedFix": "How to fix it"
    }
  ],
  "summary": "Overall testing summary"
}

Return valid JSON only.
Do not wrap the JSON in markdown code fences.
`,

          userId: req.user.userId,

          projectId: project.id,

          conversationId:
            typeof conversationId === "string" &&
            conversationId.trim()
              ? conversationId.trim()
              : undefined,
        });

      /*
      |--------------------------------------------------------------------------
      | Testing Workflow Completed
      |--------------------------------------------------------------------------
      */

      console.log(
        `Testing workflow completed | project=${project.name}`
      );

      return res.status(200).json({
        success: true,

        message:
          "Testing workflow completed successfully.",

        workflow: {
          projectId: project.id,
          projectName: project.name,

          testing: {
            agentId: testingAgent.id,
            agentName: testingAgent.name,
            filesReviewed: files.length,
            executionId:
              testingResult.executionId,
          },
        },

        result: testingResult.response,
      });
    } catch (error) {
      console.error(
        "Testing Workflow Error:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Testing workflow failed.",
      });
    }
  }
);

/**
 * GET /api/agents
 *
 * Get all active AI agents.
 */
router.get("/", async (_req, res) => {
  try {
    const agents =
      await prisma.agent.findMany({
        where: {
          isActive: true,
        },

        orderBy: {
          createdAt: "asc",
        },

        select: {
          id: true,
          type: true,
          name: true,
          description: true,
          systemPrompt: true,
          isActive: true,
          createdAt: true,
          updatedAt: true,
        },
      });

    return res.status(200).json({
      success: true,
      count: agents.length,
      agents,
    });
  } catch (error) {
    console.error(
      "Get Agents Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to fetch AI agents.",
    });
  }
});

/**
 * GET /api/agents/executions
 *
 * Get authenticated user's AI execution history.
 *
 * IMPORTANT:
 * This route must stay BEFORE /:id
 * otherwise "executions" can be treated as an agent ID.
 */
router.get(
  "/executions",
  authenticate,
  async (
    req: AuthenticatedRequest,
    res
  ) => {
    try {
      if (!req.user?.userId) {
        return res.status(401).json({
          success: false,
          message:
            "Authentication required. Please login first.",
        });
      }

      const executions =
        await prisma.aIExecution.findMany({
          where: {
            userId: req.user.userId,
          },

          orderBy: {
            createdAt: "desc",
          },

          take: 100,

          select: {
            id: true,
            status: true,
            model: true,
            prompt: true,
            response: true,
            inputTokens: true,
            outputTokens: true,
            totalTokens: true,
            durationMs: true,
            errorMessage: true,
            startedAt: true,
            completedAt: true,
            createdAt: true,
            updatedAt: true,

            agent: {
              select: {
                id: true,
                name: true,
                type: true,
              },
            },

            project: {
              select: {
                id: true,
                name: true,
                slug: true,
              },
            },
          },
        });

      return res.status(200).json({
        success: true,
        count: executions.length,
        data: executions,
      });
    } catch (error) {
      console.error(
        "Get Execution History Error:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Failed to fetch execution history.",
      });
    }
  }
);

/**
 * GET /api/agents/:id
 *
 * Get a single AI agent.
 */
router.get(
  "/:id",
  async (req, res) => {
    try {
      const id =
        Array.isArray(req.params.id)
          ? req.params.id[0]
          : req.params.id;

      const agent =
        await prisma.agent.findUnique({
          where: {
            id,
          },

          select: {
            id: true,
            type: true,
            name: true,
            description: true,
            systemPrompt: true,
            isActive: true,
            createdAt: true,
            updatedAt: true,
          },
        });

      if (!agent) {
        return res.status(404).json({
          success: false,
          message:
            "AI agent not found.",
        });
      }

      return res.status(200).json({
        success: true,
        agent,
      });
    } catch (error) {
      console.error(
        "Get Agent Error:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Failed to fetch AI agent.",
      });
    }
  }
);

/**
 * POST /api/agents/:id/execute
 *
 * Execute an AI agent.
 *
 * Authentication required.
 * userId is taken from the verified JWT.
 *
 * If projectId is provided:
 * - Project must exist.
 * - Project must belong to the authenticated user.
 */
router.post(
  "/:id/execute",
  authenticate,
  async (
    req: AuthenticatedRequest,
    res
  ) => {
    try {
      const id =
        Array.isArray(req.params.id)
          ? req.params.id[0]
          : req.params.id;

      const {
        prompt,
        projectId,
        conversationId,
      } = req.body;

      /*
      |--------------------------------------------------------------------------
      | Authentication
      |--------------------------------------------------------------------------
      */

      if (!req.user?.userId) {
        return res.status(401).json({
          success: false,
          message:
            "Authentication required. Please login first.",
        });
      }

      /*
      |--------------------------------------------------------------------------
      | Prompt Validation
      |--------------------------------------------------------------------------
      */

      if (
        typeof prompt !== "string" ||
        !prompt.trim()
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Please provide a valid prompt.",
        });
      }

      /*
      |--------------------------------------------------------------------------
      | Project Validation
      |--------------------------------------------------------------------------
      */

      if (
        typeof projectId === "string" &&
        projectId.trim()
      ) {
        const project =
          await prisma.project.findFirst({
            where: {
              id: projectId.trim(),
              ownerId: req.user.userId,
            },

            select: {
              id: true,
              name: true,
              ownerId: true,
            },
          });

        if (!project) {
          return res.status(404).json({
            success: false,
            message:
              "Project not found or you do not have access to it.",
          });
        }
      }

      /*
      |--------------------------------------------------------------------------
      | Execute AI Agent
      |--------------------------------------------------------------------------
      */

      const result =
        await executeAgent({
          agentId: id,

          prompt: prompt.trim(),

          /*
          |--------------------------------------------------------------------------
          | Never trust userId from frontend.
          | Always use authenticated JWT userId.
          |--------------------------------------------------------------------------
          */

          userId: req.user.userId,

          projectId:
            typeof projectId === "string" &&
            projectId.trim()
              ? projectId.trim()
              : undefined,

          conversationId:
            typeof conversationId === "string" &&
            conversationId.trim()
              ? conversationId.trim()
              : undefined,
        });

      /*
      |--------------------------------------------------------------------------
      | Success Response
      |--------------------------------------------------------------------------
      */

      return res.status(200).json({
        success: true,
        message:
          "AI agent executed successfully.",
        result,
      });
    } catch (error) {
      console.error(
        "Execute Agent Error:",
        error
      );

      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to execute AI agent.";

      /*
      |--------------------------------------------------------------------------
      | Known Errors
      |--------------------------------------------------------------------------
      */

      if (
        errorMessage ===
        "AI agent not found."
      ) {
        return res.status(404).json({
          success: false,
          message: errorMessage,
        });
      }

      if (
        errorMessage ===
        "This AI agent is currently inactive."
      ) {
        return res.status(400).json({
          success: false,
          message: errorMessage,
        });
      }

      if (
        errorMessage ===
        "Please provide a task for the AI agent."
      ) {
        return res.status(400).json({
          success: false,
          message: errorMessage,
        });
      }

      if (
        errorMessage ===
        "GEMINI_API_KEY is not configured on the backend."
      ) {
        return res.status(500).json({
          success: false,
          message: errorMessage,
        });
      }

      /*
      |--------------------------------------------------------------------------
      | Generic Error
      |--------------------------------------------------------------------------
      */

      return res.status(500).json({
        success: false,
        message: errorMessage,
      });
    }
  }
);

export default router;