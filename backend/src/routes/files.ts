import { Router, Response } from "express";
import { FileType } from "@prisma/client";
import { prisma } from "../lib/prisma";
import {
  authenticate,
  AuthenticatedRequest,
} from "../middleware/auth.middleware";

const router = Router();

/*
|--------------------------------------------------------------------------
| GET /api/files?projectId=...
| Get all files for a project
|--------------------------------------------------------------------------
*/

router.get(
  "/",
  authenticate,
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const projectId =
        typeof req.query.projectId === "string"
          ? req.query.projectId
          : undefined;

      if (!projectId) {
        return res.status(400).json({
          success: false,
          message: "projectId is required",
        });
      }

      if (!req.user?.userId) {
        return res.status(401).json({
          success: false,
          message: "Authentication required",
        });
      }

      // Verify project ownership
      const project = await prisma.project.findFirst({
        where: {
          id: projectId,
          ownerId: req.user.userId,
        },
        select: {
          id: true,
        },
      });

      if (!project) {
        return res.status(404).json({
          success: false,
          message: "Project not found",
        });
      }

      const files = await prisma.projectFile.findMany({
        where: {
          projectId,
        },
        orderBy: {
          path: "asc",
        },
      });

      return res.json({
        success: true,
        count: files.length,
        data: files.map((file) => ({
          ...file,
          size: file.size !== null ? file.size.toString() : null,
        })),
      });
    } catch (error) {
      console.error("Get files error:", error);

      return res.status(500).json({
        success: false,
        message: "Failed to fetch project files",
      });
    }
  }
);

/*
|--------------------------------------------------------------------------
| GET /api/files/:id
| Get one file
|--------------------------------------------------------------------------
*/

router.get(
  "/:id",
  authenticate,
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const fileId =
        typeof req.params.id === "string"
          ? req.params.id
          : undefined;

      if (!fileId) {
        return res.status(400).json({
          success: false,
          message: "File ID is required",
        });
      }

      if (!req.user?.userId) {
        return res.status(401).json({
          success: false,
          message: "Authentication required",
        });
      }

      const file = await prisma.projectFile.findUnique({
        where: {
          id: fileId,
        },
      });

      if (!file) {
        return res.status(404).json({
          success: false,
          message: "File not found",
        });
      }

      // Verify ownership separately
      const project = await prisma.project.findFirst({
        where: {
          id: file.projectId,
          ownerId: req.user.userId,
        },
        select: {
          id: true,
        },
      });

      if (!project) {
        return res.status(403).json({
          success: false,
          message: "You do not have access to this file",
        });
      }

      return res.json({
        success: true,
        data: {
          ...file,
          size: file.size !== null ? file.size.toString() : null,
        },
      });
    } catch (error) {
      console.error("Get file error:", error);

      return res.status(500).json({
        success: false,
        message: "Failed to fetch file",
      });
    }
  }
);

/*
|--------------------------------------------------------------------------
| POST /api/files
| Create a project file
|--------------------------------------------------------------------------
*/

router.post(
  "/",
  authenticate,
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const {
        projectId,
        name,
        path,
        type,
        mimeType,
        size,
        content,
        parentPath,
      } = req.body;

      if (!projectId || !name || !path || !type) {
        return res.status(400).json({
          success: false,
          message:
            "projectId, name, path and type are required",
        });
      }

      if (!req.user?.userId) {
        return res.status(401).json({
          success: false,
          message: "Authentication required",
        });
      }

      if (type !== "FILE" && type !== "FOLDER") {
        return res.status(400).json({
          success: false,
          message: "type must be FILE or FOLDER",
        });
      }

      // Verify project ownership
      const project = await prisma.project.findFirst({
        where: {
          id: projectId,
          ownerId: req.user.userId,
        },
        select: {
          id: true,
        },
      });

      if (!project) {
        return res.status(404).json({
          success: false,
          message: "Project not found",
        });
      }

      const file = await prisma.projectFile.create({
        data: {
          projectId,
          name,
          path,
          type: type as FileType,
          mimeType: mimeType || null,
          size:
            size !== undefined && size !== null
              ? BigInt(size)
              : null,
          content: content || null,
          parentPath: parentPath || null,
        },
      });

      return res.status(201).json({
        success: true,
        message: "File created successfully",
        data: {
          ...file,
          size: file.size !== null ? file.size.toString() : null,
        },
      });
    } catch (error) {
      console.error("Create file error:", error);

      return res.status(500).json({
        success: false,
        message: "Failed to create file",
      });
    }
  }
);

/*
|--------------------------------------------------------------------------
| DELETE /api/files/:id
| Delete a project file
|--------------------------------------------------------------------------
*/

router.delete(
  "/:id",
  authenticate,
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const fileId =
        typeof req.params.id === "string"
          ? req.params.id
          : undefined;

      if (!fileId) {
        return res.status(400).json({
          success: false,
          message: "File ID is required",
        });
      }

      if (!req.user?.userId) {
        return res.status(401).json({
          success: false,
          message: "Authentication required",
        });
      }

      const file = await prisma.projectFile.findUnique({
        where: {
          id: fileId,
        },
      });

      if (!file) {
        return res.status(404).json({
          success: false,
          message: "File not found",
        });
      }

      // Verify project ownership
      const project = await prisma.project.findFirst({
        where: {
          id: file.projectId,
          ownerId: req.user.userId,
        },
        select: {
          id: true,
        },
      });

      if (!project) {
        return res.status(403).json({
          success: false,
          message: "You do not have access to this file",
        });
      }

      await prisma.projectFile.delete({
        where: {
          id: fileId,
        },
      });

      return res.json({
        success: true,
        message: "File deleted successfully",
      });
    } catch (error) {
      console.error("Delete file error:", error);

      return res.status(500).json({
        success: false,
        message: "Failed to delete file",
      });
    }
  }
);

export default router;