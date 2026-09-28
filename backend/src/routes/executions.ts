import { Router, Request, Response } from "express";
import { prisma } from "../lib/prisma";
import { authenticate } from "../middleware/auth.middleware";

const router = Router();

type AuthenticatedRequest = Request & {
  user?: {
    userId: string;
  };
};

/**
 * GET /api/executions
 * Get AI executions belonging to the logged-in user.
 */
router.get("/", authenticate, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const executions = await prisma.aIExecution.findMany({
      where: {
        userId,
      },
      orderBy: {
        createdAt: "desc",
      },
      include: {
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
    console.error("Get executions error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch executions",
    });
  }
});

/**
 * GET /api/executions/:id
 * Get one AI execution belonging to the logged-in user.
 */
router.get("/:id", authenticate, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Execution ID is required",
      });
    }

    const execution = await prisma.aIExecution.findFirst({
      where: {
        id,
        userId,
      },
      include: {
        agent: {
          select: {
            id: true,
            name: true,
            type: true,
            description: true,
          },
        },
        project: {
          select: {
            id: true,
            name: true,
            slug: true,
            description: true,
          },
        },
      },
    });

    if (!execution) {
      return res.status(404).json({
        success: false,
        message: "Execution not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: execution,
    });
  } catch (error) {
    console.error("Get execution error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch execution",
    });
  }
});

export default router;