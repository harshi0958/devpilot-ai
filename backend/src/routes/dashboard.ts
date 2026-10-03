import { Router, Response } from "express";
import { prisma } from "../lib/prisma";
import {
  authenticate,
  AuthenticatedRequest,
} from "../middleware/auth.middleware";

const router = Router();

router.get(
  "/stats",
  authenticate,
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      if (!req.user?.userId) {
        return res.status(401).json({
          success: false,
          message: "Authentication required.",
        });
      }

      const userId = req.user.userId;

      // Get all active projects owned by the logged-in user
      const projects = await prisma.project.findMany({
        where: {
          ownerId: userId,
          archived: false,
        },
        select: {
          id: true,
          _count: {
            select: {
              executions: true,
              files: true,
            },
          },
        },
      });

      const projectIds = projects.map((project) => project.id);

      // Get execution statuses for this user's projects
      const executionRecords: { status: string }[] =
        projectIds.length > 0
          ? await prisma.aIExecution.findMany({
              where: {
                projectId: {
                  in: projectIds,
                },
              },
              select: {
                status: true,
              },
            })
          : [];

      const projectCount = projects.length;

      const executionCount = projects.reduce(
        (total, project) =>
          total + project._count.executions,
        0
      );

      const fileCount = projects.reduce(
        (total, project) =>
          total + project._count.files,
        0
      );

      const completedCount = executionRecords.filter(
        (execution) =>
          execution.status === "COMPLETED"
      ).length;

      const failedCount = executionRecords.filter(
        (execution) =>
          execution.status === "FAILED"
      ).length;

      const successRate =
        executionCount > 0
          ? Math.round(
              (completedCount / executionCount) * 100
            )
          : 0;

      return res.status(200).json({
        success: true,
        stats: {
          projects: projectCount,
          agents: await prisma.agent.count({
            where: {
              isActive: true,
            },
          }),
          executions: executionCount,
          files: fileCount,
          completed: completedCount,
          failed: failedCount,
          successRate,
        },
      });
    } catch (error) {
      console.error(
        "Dashboard Stats Error:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Failed to fetch dashboard statistics.",
      });
    }
  }
);

export default router;