import { Router } from "express";
import { prisma } from "../lib/prisma";
import { authenticate } from "../middleware/auth.middleware";
import { pushProjectToGitHub } from "../services/github.service";

const router = Router();

/**
 * POST /api/github/connect
 * Connect a GitHub repository to a DevPilot project
 */
router.post(
  "/connect",
  authenticate,
  async (req, res) => {
    try {
      const userId = req.user!.userId;

      const {
        projectId,
        repositoryUrl,
        repositoryName,
        ownerName,
        branch,
      } = req.body;

      if (
        !projectId ||
        !repositoryUrl ||
        !repositoryName ||
        !ownerName
      ) {
        return res.status(400).json({
          success: false,
          message:
            "projectId, repositoryUrl, repositoryName and ownerName are required.",
        });
      }

      const project = await prisma.project.findUnique({
        where: {
          id: projectId,
        },
        select: {
          id: true,
          ownerId: true,
          name: true,
        },
      });

      if (!project) {
        return res.status(404).json({
          success: false,
          message: "Project not found.",
        });
      }

      if (project.ownerId !== userId) {
        return res.status(403).json({
          success: false,
          message: "You do not have access to this project.",
        });
      }

      const connection =
        await prisma.gitHubConnection.upsert({
          where: {
            projectId,
          },
          update: {
            repositoryUrl,
            repositoryName,
            ownerName,
            branch: branch || "main",
          },
          create: {
            projectId,
            repositoryUrl,
            repositoryName,
            ownerName,
            branch: branch || "main",
          },
        });

      return res.status(200).json({
        success: true,
        message: "GitHub repository connected successfully.",
        data: connection,
      });
    } catch (error) {
      console.error("GitHub connect error:", error);

      return res.status(500).json({
        success: false,
        message: "Failed to connect GitHub repository.",
      });
    }
  }
);

/**
 * GET /api/github/status/:projectId
 * Get GitHub connection status for a project
 */
router.get(
  "/status/:projectId",
  authenticate,
  async (req, res) => {
    try {
      const userId = req.user!.userId;

      const projectId = Array.isArray(req.params.projectId)
        ? req.params.projectId[0]
        : req.params.projectId;

      if (!projectId) {
        return res.status(400).json({
          success: false,
          message: "Project ID is required.",
        });
      }

      const project = await prisma.project.findUnique({
        where: {
          id: projectId,
        },
        select: {
          id: true,
          ownerId: true,
        },
      });

      if (!project) {
        return res.status(404).json({
          success: false,
          message: "Project not found.",
        });
      }

      if (project.ownerId !== userId) {
        return res.status(403).json({
          success: false,
          message: "You do not have access to this project.",
        });
      }

      const connection =
        await prisma.gitHubConnection.findUnique({
          where: {
            projectId,
          },
        });

      return res.status(200).json({
        success: true,
        connected: Boolean(connection),
        data: connection,
      });
    } catch (error) {
      console.error("GitHub status error:", error);

      return res.status(500).json({
        success: false,
        message: "Failed to fetch GitHub status.",
      });
    }
  }
);

/**
 * POST /api/github/push
 * Push all DevPilot project files to GitHub
 */
router.post(
  "/push",
  authenticate,
  async (req, res) => {
    try {
      const userId = req.user!.userId;

      const { projectId, commitMessage } =
        req.body;

      if (!projectId) {
        return res.status(400).json({
          success: false,
          message: "Project ID is required.",
        });
      }

      // Verify project ownership
      const project =
        await prisma.project.findUnique({
          where: {
            id: projectId,
          },
          select: {
            id: true,
            ownerId: true,
            name: true,
          },
        });

      if (!project) {
        return res.status(404).json({
          success: false,
          message: "Project not found.",
        });
      }

      if (project.ownerId !== userId) {
        return res.status(403).json({
          success: false,
          message:
            "You do not have access to this project.",
        });
      }

      const result =
        await pushProjectToGitHub(
          projectId,
          commitMessage ||
            `chore: sync ${project.name} from DevPilot AI`
        );

      return res.status(200).json({
        success: true,
        message:
          "Project pushed to GitHub successfully.",
        data: result,
      });
    } catch (error) {
      console.error(
        "GitHub push error:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to push project to GitHub.",
      });
    }
  }
);

export default router;