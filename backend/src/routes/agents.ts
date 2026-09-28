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
 * GET /api/agents
 * Get all active AI agents
 */
router.get("/", async (_req, res) => {
  try {
    const agents = await prisma.agent.findMany({
      where: { isActive: true },
      orderBy: { createdAt: "asc" },
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
    console.error("Get Agents Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch AI agents.",
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
  async (req: AuthenticatedRequest, res) => {
    try {
      if (!req.user?.userId) {
        return res.status(401).json({
          success: false,
          message: "Authentication required. Please login first.",
        });
      }

      const executions = await prisma.aIExecution.findMany({
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
      console.error("Get Execution History Error:", error);

      return res.status(500).json({
        success: false,
        message: "Failed to fetch execution history.",
      });
    }
  }
);

/**
 * GET /api/agents/:id
 * Get a single AI agent
 */
router.get("/:id", async (req, res) => {
  try {
    const id = Array.isArray(req.params.id)
      ? req.params.id[0]
      : req.params.id;

    const agent = await prisma.agent.findUnique({
      where: { id },
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
        message: "AI agent not found.",
      });
    }

    return res.status(200).json({
      success: true,
      agent,
    });
  } catch (error) {
    console.error("Get Agent Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch AI agent.",
    });
  }
});

/**
 * POST /api/agents/:id/execute
 * Execute an AI agent
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
  async (req: AuthenticatedRequest, res) => {
    try {
      const id = Array.isArray(req.params.id)
        ? req.params.id[0]
        : req.params.id;

      const {
        prompt,
        projectId,
        conversationId,
      } = req.body;

      /*
      |------------------------------------------------------------------
      | Authentication
      |------------------------------------------------------------------
      */

      if (!req.user?.userId) {
        return res.status(401).json({
          success: false,
          message: "Authentication required. Please login first.",
        });
      }

      /*
      |------------------------------------------------------------------
      | Prompt Validation
      |------------------------------------------------------------------
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
      |------------------------------------------------------------------
      | Project Validation
      |------------------------------------------------------------------
      */

      if (
        typeof projectId === "string" &&
        projectId.trim()
      ) {
        const project = await prisma.project.findFirst({
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
      |------------------------------------------------------------------
      | Execute AI Agent
      |------------------------------------------------------------------
      */

      const result = await executeAgent({
        agentId: id,
        prompt: prompt.trim(),

        /*
        |----------------------------------------------------------------
        | Never trust userId from frontend.
        | Always use authenticated JWT userId.
        |----------------------------------------------------------------
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
      |------------------------------------------------------------------
      | Success Response
      |------------------------------------------------------------------
      */

      return res.status(200).json({
        success: true,
        message: "AI agent executed successfully.",
        result,
      });
    } catch (error) {
      console.error("Execute Agent Error:", error);

      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to execute AI agent.";

      /*
      |------------------------------------------------------------------
      | Known Errors
      |------------------------------------------------------------------
      */

      if (errorMessage === "AI agent not found.") {
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
      |------------------------------------------------------------------
      | Generic Error
      |------------------------------------------------------------------
      */

      return res.status(500).json({
        success: false,
        message: errorMessage,
      });
    }
  }
);

export default router;