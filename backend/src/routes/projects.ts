import { Router, Response } from "express";
import { prisma } from "../lib/prisma";
import {
  authenticate,
  AuthenticatedRequest,
} from "../middleware/auth.middleware";

const router = Router();

/*
|--------------------------------------------------------------------------
| Helper: Create Slug
|--------------------------------------------------------------------------
*/

const createSlug = (name: string) => {
  return (
    name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || "project"
  );
};

/*
|--------------------------------------------------------------------------
| GET /api/projects
| Get active projects owned by current user
|--------------------------------------------------------------------------
*/

router.get(
  "/",
  authenticate,
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      if (!req.user?.userId) {
        return res.status(401).json({
          success: false,
          message: "Authentication required.",
        });
      }

      const projects = await prisma.project.findMany({
        where: {
          ownerId: req.user.userId,
          archived: false,
        },
        orderBy: {
          createdAt: "desc",
        },
        include: {
          _count: {
            select: {
              members: true,
              executions: true,
              conversations: true,
              files: true,
            },
          },
        },
      });

      return res.status(200).json({
        success: true,
        count: projects.length,
        projects,
      });
    } catch (error) {
      console.error("Get Projects Error:", error);

      return res.status(500).json({
        success: false,
        message: "Failed to fetch projects.",
      });
    }
  }
);

/*
|--------------------------------------------------------------------------
| GET /api/projects/archived
| Get archived projects owned by current user
|--------------------------------------------------------------------------
*/

router.get(
  "/archived",
  authenticate,
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      if (!req.user?.userId) {
        return res.status(401).json({
          success: false,
          message: "Authentication required.",
        });
      }

      const projects = await prisma.project.findMany({
        where: {
          ownerId: req.user.userId,
          archived: true,
        },
        orderBy: {
          updatedAt: "desc",
        },
        include: {
          _count: {
            select: {
              members: true,
              executions: true,
              conversations: true,
              files: true,
            },
          },
        },
      });

      return res.status(200).json({
        success: true,
        count: projects.length,
        projects,
      });
    } catch (error) {
      console.error(
        "Get Archived Projects Error:",
        error
      );

      return res.status(500).json({
        success: false,
        message: "Failed to fetch archived projects.",
      });
    }
  }
);

/*
|--------------------------------------------------------------------------
| GET /api/projects/:id
| Get single project
|--------------------------------------------------------------------------
*/

router.get(
  "/:id",
  authenticate,
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      if (!req.user?.userId) {
        return res.status(401).json({
          success: false,
          message: "Authentication required.",
        });
      }

      const project = await prisma.project.findFirst({
        where: {
          id: String(req.params.id),
          ownerId: req.user.userId,
        },
        include: {
          _count: {
            select: {
              members: true,
              executions: true,
              conversations: true,
              files: true,
            },
          },
        },
      });

      if (!project) {
        return res.status(404).json({
          success: false,
          message: "Project not found.",
        });
      }

      return res.status(200).json({
        success: true,
        project,
      });
    } catch (error) {
      console.error("Get Project Error:", error);

      return res.status(500).json({
        success: false,
        message: "Failed to fetch project.",
      });
    }
  }
);

/*
|--------------------------------------------------------------------------
| POST /api/projects
| Create new project
|--------------------------------------------------------------------------
*/

router.post(
  "/",
  authenticate,
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      if (!req.user?.userId) {
        return res.status(401).json({
          success: false,
          message: "Authentication required.",
        });
      }

      const { name, description } = req.body;

      if (
        !name ||
        typeof name !== "string" ||
        !name.trim()
      ) {
        return res.status(400).json({
          success: false,
          message: "Project name is required.",
        });
      }

      const cleanName = name.trim();

      const cleanDescription =
        typeof description === "string"
          ? description.trim()
          : null;

      const baseSlug = createSlug(cleanName);

      let slug = baseSlug;
      let counter = 1;

      while (
        await prisma.project.findUnique({
          where: { slug },
        })
      ) {
        slug = `${baseSlug}-${counter}`;
        counter++;
      }

      const project = await prisma.project.create({
        data: {
          name: cleanName,
          description: cleanDescription,
          slug,
          ownerId: req.user.userId,
          archived: false,
        },
        include: {
          _count: {
            select: {
              members: true,
              executions: true,
              conversations: true,
              files: true,
            },
          },
        },
      });

      return res.status(201).json({
        success: true,
        message: "Project created successfully.",
        project,
      });
    } catch (error) {
      console.error("Create Project Error:", error);

      return res.status(500).json({
        success: false,
        message: "Failed to create project.",
      });
    }
  }
);

/*
|--------------------------------------------------------------------------
| PATCH /api/projects/:id
| Update project
|--------------------------------------------------------------------------
*/

router.patch(
  "/:id",
  authenticate,
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      if (!req.user?.userId) {
        return res.status(401).json({
          success: false,
          message: "Authentication required.",
        });
      }

      const existingProject =
        await prisma.project.findFirst({
          where: {
            id: String(req.params.id),
            ownerId: req.user.userId,
          },
        });

      if (!existingProject) {
        return res.status(404).json({
          success: false,
          message: "Project not found.",
        });
      }

      const {
        name,
        description,
        archived,
      } = req.body;

      const data: {
        name?: string;
        description?: string | null;
        archived?: boolean;
      } = {};

      /*
      |----------------------------------------------------------------------
      | Name
      |----------------------------------------------------------------------
      */

      if (name !== undefined) {
        if (
          typeof name !== "string" ||
          !name.trim()
        ) {
          return res.status(400).json({
            success: false,
            message: "Project name cannot be empty.",
          });
        }

        data.name = name.trim();
      }

      /*
      |----------------------------------------------------------------------
      | Description
      |----------------------------------------------------------------------
      */

      if (description !== undefined) {
        data.description =
          typeof description === "string"
            ? description.trim()
            : null;
      }

      /*
      |----------------------------------------------------------------------
      | Archived
      |----------------------------------------------------------------------
      */

      if (archived !== undefined) {
        if (typeof archived !== "boolean") {
          return res.status(400).json({
            success: false,
            message:
              "Archived value must be true or false.",
          });
        }

        data.archived = archived;
      }

      const project =
        await prisma.project.update({
          where: {
            id: existingProject.id,
          },
          data,
          include: {
            _count: {
              select: {
                members: true,
                executions: true,
                conversations: true,
                files: true,
              },
            },
          },
        });

      return res.status(200).json({
        success: true,
        message: data.archived
          ? "Project archived successfully."
          : (existingProject as { archived?: boolean }).archived &&
            data.archived === false
          ? "Project restored successfully."
          : "Project updated successfully.",
        project,
      });
    } catch (error) {
      console.error("Update Project Error:", error);

      return res.status(500).json({
        success: false,
        message: "Failed to update project.",
      });
    }
  }
);

/*
|--------------------------------------------------------------------------
| PATCH /api/projects/:id/archive
| Archive project
|--------------------------------------------------------------------------
*/

router.patch(
  "/:id/archive",
  authenticate,
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      if (!req.user?.userId) {
        return res.status(401).json({
          success: false,
          message: "Authentication required.",
        });
      }

      const project =
        await prisma.project.findFirst({
          where: {
            id: String(req.params.id),
            ownerId: req.user.userId,
          },
        });

      if (!project) {
        return res.status(404).json({
          success: false,
          message: "Project not found.",
        });
      }

      const updatedProject =
        await prisma.project.update({
          where: {
            id: project.id,
          },
          data: {
            archived: true,
          } as any,
        });

      return res.status(200).json({
        success: true,
        message: "Project archived successfully.",
        project: updatedProject,
      });
    } catch (error) {
      console.error(
        "Archive Project Error:",
        error
      );

      return res.status(500).json({
        success: false,
        message: "Failed to archive project.",
      });
    }
  }
);

/*
|--------------------------------------------------------------------------
| PATCH /api/projects/:id/restore
| Restore archived project
|--------------------------------------------------------------------------
*/

router.patch(
  "/:id/restore",
  authenticate,
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      if (!req.user?.userId) {
        return res.status(401).json({
          success: false,
          message: "Authentication required.",
        });
      }

      const project =
        await prisma.project.findFirst({
          where: {
            id: String(req.params.id),
            ownerId: req.user.userId,
          },
        });

      if (!project) {
        return res.status(404).json({
          success: false,
          message: "Project not found.",
        });
      }

      const updatedProject =
        await prisma.project.update({
          where: {
            id: project.id,
          },
          data: {
            archived: false,
          } as any,
        });

      return res.status(200).json({
        success: true,
        message: "Project restored successfully.",
        project: updatedProject,
      });
    } catch (error) {
      console.error(
        "Restore Project Error:",
        error
      );

      return res.status(500).json({
        success: false,
        message: "Failed to restore project.",
      });
    }
  }
);

/*
|--------------------------------------------------------------------------
| DELETE /api/projects/:id
| Permanently delete project
|--------------------------------------------------------------------------
*/

router.delete(
  "/:id",
  authenticate,
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      if (!req.user?.userId) {
        return res.status(401).json({
          success: false,
          message: "Authentication required.",
        });
      }

      const project =
        await prisma.project.findFirst({
          where: {
            id: String(req.params.id),
            ownerId: req.user.userId,
          },
        });

      if (!project) {
        return res.status(404).json({
          success: false,
          message: "Project not found.",
        });
      }

      await prisma.project.delete({
        where: {
          id: project.id,
        },
      });

      return res.status(200).json({
        success: true,
        message:
          "Project permanently deleted successfully.",
      });
    } catch (error) {
      console.error(
        "Delete Project Error:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Failed to permanently delete project.",
      });
    }
  }
);

export default router;