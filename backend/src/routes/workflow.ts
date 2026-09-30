import { Router, Response } from "express";
import { FileType } from "@prisma/client";

import { prisma } from "../lib/prisma";

import {
  authenticate,
  AuthenticatedRequest,
} from "../middleware/auth.middleware";

import { executeAgent } from "../services/agent.service";

const router = Router();

/*
|--------------------------------------------------------------------------
| Helper: Parse AI JSON
|--------------------------------------------------------------------------
*/

function parseAIJson(text: string): any {
  if (!text || !text.trim()) {
    throw new Error("AI returned an empty response.");
  }

  const cleaned = text
    .trim()
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();

  try {
    return JSON.parse(cleaned);
  } catch {
    const start = cleaned.indexOf("{");
    const end = cleaned.lastIndexOf("}");

    if (start !== -1 && end > start) {
      try {
        return JSON.parse(
          cleaned.slice(start, end + 1)
        );
      } catch {
        throw new Error(
          "AI returned invalid JSON."
        );
      }
    }

    throw new Error(
      "AI returned invalid JSON."
    );
  }
}

/*
|--------------------------------------------------------------------------
| POST /api/agents/workflow/build
|
| Architect → Developer → ProjectFile
|--------------------------------------------------------------------------
*/

router.post(
  "/build",
  authenticate,
  async (
    req: AuthenticatedRequest,
    res: Response
  ) => {
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
      | Request
      |--------------------------------------------------------------------------
      */

      const {
        projectId,
        prompt,
      } = req.body;

      if (
        typeof projectId !== "string" ||
        !projectId.trim()
      ) {
        return res.status(400).json({
          success: false,
          message: "projectId is required.",
        });
      }

      if (
        typeof prompt !== "string" ||
        !prompt.trim()
      ) {
        return res.status(400).json({
          success: false,
          message: "prompt is required.",
        });
      }

      const cleanProjectId =
        projectId.trim();

      const cleanPrompt =
        prompt.trim();

      /*
      |--------------------------------------------------------------------------
      | PROJECT
      |--------------------------------------------------------------------------
      |
      | First find the project by ID.
      | Then verify ownership separately.
      |
      */

      const project =
        await prisma.project.findUnique({
          where: {
            id: cleanProjectId,
          },

          select: {
            id: true,
            name: true,
            description: true,
            ownerId: true,
          },
        });

      if (!project) {
        console.error(
          `Workflow: project does not exist | projectId=${cleanProjectId}`
        );

        return res.status(404).json({
          success: false,
          message: "Project does not exist.",
        });
      }

      if (
        project.ownerId !==
        req.user.userId
      ) {
        console.error(
          `Workflow: project ownership mismatch | projectOwner=${project.ownerId} | user=${req.user.userId}`
        );

        return res.status(403).json({
          success: false,
          message:
            "You do not have access to this project.",
        });
      }

      console.log(
        `Workflow project verified | ${project.name} | ${project.id}`
      );

      /*
      |--------------------------------------------------------------------------
      | ARCHITECT AGENT
      |--------------------------------------------------------------------------
      */

      const architect =
        await prisma.agent.findUnique({
          where: {
            type: "ARCHITECT",
          },

          select: {
            id: true,
            name: true,
            type: true,
            isActive: true,
          },
        });

      if (!architect) {
        return res.status(404).json({
          success: false,
          message:
            "Architect Agent not found.",
        });
      }

      if (!architect.isActive) {
        return res.status(400).json({
          success: false,
          message:
            "Architect Agent is inactive.",
        });
      }

      /*
      |--------------------------------------------------------------------------
      | DEVELOPER AGENT
      |--------------------------------------------------------------------------
      */

      const developer =
        await prisma.agent.findUnique({
          where: {
            type: "DEVELOPER",
          },

          select: {
            id: true,
            name: true,
            type: true,
            isActive: true,
          },
        });

      if (!developer) {
        return res.status(404).json({
          success: false,
          message:
            "Developer Agent not found.",
        });
      }

      if (!developer.isActive) {
        return res.status(400).json({
          success: false,
          message:
            "Developer Agent is inactive.",
        });
      }

      /*
      |--------------------------------------------------------------------------
      | WORKFLOW START
      |--------------------------------------------------------------------------
      */

      console.log(
        "=========================================="
      );

      console.log(
        "DEV PILOT AUTONOMOUS BUILD"
      );

      console.log(
        `Project: ${project.name}`
      );

      console.log(
        `Prompt: ${cleanPrompt}`
      );

      console.log(
        "=========================================="
      );

      /*
      |--------------------------------------------------------------------------
      | STEP 1 — ARCHITECT
      |--------------------------------------------------------------------------
      */

      console.log(
        "STEP 1 → Architect Agent"
      );

      const architectResult =
        await executeAgent({
          agentId: architect.id,

          userId: req.user.userId,

          projectId: project.id,

          prompt: `
You are the ARCHITECT AGENT of DevPilot AI.

Design the implementation architecture for the user's request.

USER REQUEST
============
${cleanPrompt}

PROJECT
=======
Name: ${project.name}

Description:
${
  project.description ||
  "No project description provided."
}

EXISTING DEV PILOT STACK
========================
Frontend:
- Next.js
- React
- TypeScript
- Tailwind CSS
- shadcn/ui

Backend:
- Node.js
- Express
- TypeScript

Database:
- PostgreSQL
- Prisma ORM

Authentication:
- JWT
- HTTP-only cookies

AI:
- Gemini

ARCHITECT RULES
===============
1. Keep the existing DevPilot architecture.
2. Do not introduce MongoDB.
3. Do not introduce Mongoose.
4. Do not replace PostgreSQL.
5. Do not replace Prisma.
6. Do not replace Express.
7. Do not introduce unnecessary infrastructure.
8. Design a practical production-quality implementation.
9. Identify the database changes required.
10. Identify backend APIs required.
11. Identify frontend pages/components required.
12. Identify every source file required.

RETURN ONLY VALID JSON.

FORMAT:

{
  "summary": "architecture summary",
  "database": [
    {
      "name": "ModelName",
      "purpose": "purpose"
    }
  ],
  "api": [
    {
      "method": "GET",
      "path": "/api/example",
      "purpose": "purpose"
    }
  ],
  "frontend": [
    {
      "path": "frontend/app/example/page.tsx",
      "purpose": "purpose"
    }
  ],
  "files": [
    {
      "path": "backend/src/example.ts",
      "purpose": "purpose"
    }
  ]
}
`,
        });

      console.log(
        "Architect Agent completed."
      );

      /*
      |--------------------------------------------------------------------------
      | Parse Architecture
      |--------------------------------------------------------------------------
      */

      let architecture: any;

      try {
        architecture =
          parseAIJson(
            architectResult.response
          );
      } catch (error) {
        console.error(
          "Architect JSON Error:",
          error
        );

        return res.status(500).json({
          success: false,
          message:
            "Architect Agent returned invalid JSON.",
          rawResponse:
            architectResult.response,
        });
      }

      if (
        !architecture ||
        !Array.isArray(
          architecture.files
        )
      ) {
        return res.status(500).json({
          success: false,
          message:
            "Architect Agent returned an invalid file plan.",
          architecture,
        });
      }

      /*
      |--------------------------------------------------------------------------
      | STEP 2 — DEVELOPER
      |--------------------------------------------------------------------------
      */

      console.log(
        "STEP 2 → Developer Agent"
      );

      const developerResult =
        await executeAgent({
          agentId: developer.id,

          userId: req.user.userId,

          projectId: project.id,

          prompt: `
You are the DEVELOPER AGENT of DevPilot AI.

Implement the user's requested software feature.

USER REQUEST
============
${cleanPrompt}

ARCHITECT AGENT PLAN
====================
${JSON.stringify(
  architecture,
  null,
  2
)}

EXISTING DEV PILOT STACK
========================
Frontend:
- Next.js
- React
- TypeScript
- Tailwind CSS
- shadcn/ui

Backend:
- Node.js
- Express
- TypeScript

Database:
- PostgreSQL
- Prisma

Authentication:
- JWT HTTP-only cookies

IMPLEMENTATION RULES
====================
1. Follow the Architect Agent plan.
2. Generate real source code.
3. Generate complete files.
4. Do not generate pseudocode.
5. Do not use MongoDB.
6. Do not use Mongoose.
7. Do not replace PostgreSQL.
8. Do not replace Prisma.
9. Do not replace Express.
10. Keep the existing DevPilot architecture.
11. Use TypeScript.
12. Keep paths relative to the project root.
13. Generate every required file from the architecture.
14. Do not omit files.
15. Return ONLY valid JSON.

IMPORTANT:
Every file must contain its COMPLETE source code.

FORMAT:

{
  "summary": "implementation summary",
  "files": [
    {
      "path": "relative/path/file.ts",
      "content": "complete source code"
    }
  ]
}
`,
        });

      console.log(
        "Developer Agent completed."
      );

      /*
      |--------------------------------------------------------------------------
      | Parse Developer Output
      |--------------------------------------------------------------------------
      */

      let implementation: any;

      try {
        implementation =
          parseAIJson(
            developerResult.response
          );
      } catch (error) {
        console.error(
          "Developer JSON Error:",
          error
        );

        return res.status(500).json({
          success: false,
          message:
            "Developer Agent returned invalid JSON.",
          rawResponse:
            developerResult.response,
        });
      }

      if (
        !implementation ||
        !Array.isArray(
          implementation.files
        )
      ) {
        return res.status(500).json({
          success: false,
          message:
            "Developer Agent returned no valid files.",
          implementation,
        });
      }

      /*
      |--------------------------------------------------------------------------
      | STEP 3 — SAVE FILES
      |--------------------------------------------------------------------------
      */

      console.log(
        `STEP 3 → Saving ${implementation.files.length} files`
      );

      const savedFiles: Array<{
        id: string;
        name: string;
        path: string;
        type: FileType;
        mimeType: string | null;
        size: string | null;
      }> = [];

      for (
        const generatedFile of
        implementation.files
      ) {
        if (
          !generatedFile ||
          typeof generatedFile.path !==
            "string" ||
          typeof generatedFile.content !==
            "string"
        ) {
          console.warn(
            "Skipping invalid generated file:",
            generatedFile
          );

          continue;
        }

        const filePath =
          generatedFile.path
            .trim()
            .replace(/^\/+/, "")
            .replace(/\\/g, "/");

        if (!filePath) {
          continue;
        }

        const parts =
          filePath.split("/");

        const fileName =
          parts[parts.length - 1];

        if (!fileName) {
          continue;
        }

        const parentPath =
          parts.length > 1
            ? parts
                .slice(0, -1)
                .join("/")
            : null;

        const mimeType =
          fileName.endsWith(".tsx")
            ? "text/tsx"
            : fileName.endsWith(".ts")
            ? "text/typescript"
            : fileName.endsWith(".jsx")
            ? "text/javascript"
            : fileName.endsWith(".js")
            ? "text/javascript"
            : fileName.endsWith(".json")
            ? "application/json"
            : fileName.endsWith(".css")
            ? "text/css"
            : fileName.endsWith(".html")
            ? "text/html"
            : fileName.endsWith(".md")
            ? "text/markdown"
            : fileName.endsWith(".prisma")
            ? "text/plain"
            : "text/plain";

        const size =
          Buffer.byteLength(
            generatedFile.content,
            "utf8"
          );

        /*
        |--------------------------------------------------------------------------
        | UPSERT PROJECT FILE
        |--------------------------------------------------------------------------
        */

        const savedFile =
          await prisma.projectFile.upsert({
            where: {
              projectId_path: {
                projectId:
                  project.id,
                path: filePath,
              },
            },

            update: {
              name: fileName,
              type: FileType.FILE,
              mimeType,
              size: BigInt(size),
              content:
                generatedFile.content,
              parentPath,
            },

            create: {
              projectId:
                project.id,
              name: fileName,
              path: filePath,
              type: FileType.FILE,
              mimeType,
              size: BigInt(size),
              content:
                generatedFile.content,
              parentPath,
            },
          });

        savedFiles.push({
          id: savedFile.id,
          name: savedFile.name,
          path: savedFile.path,
          type: savedFile.type,
          mimeType: savedFile.mimeType,
          size:
            savedFile.size !== null
              ? savedFile.size.toString()
              : null,
        });
      }

      /*
      |--------------------------------------------------------------------------
      | WORKFLOW COMPLETE
      |--------------------------------------------------------------------------
      */

      console.log(
        "=========================================="
      );

      console.log(
        `WORKFLOW COMPLETE → ${savedFiles.length} files saved`
      );

      console.log(
        "=========================================="
      );

      return res.status(200).json({
        success: true,

        message:
          "DevPilot autonomous build completed successfully.",

        project: {
          id: project.id,
          name: project.name,
        },

        workflow: {
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

        architecture,

        implementation: {
          summary:
            implementation.summary ||
            null,

          generatedFiles:
            savedFiles.length,

          files: savedFiles,
        },
      });
    } catch (error) {
      console.error(
        "DevPilot Build Workflow Error:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "DevPilot autonomous build failed.",
      });
    }
  }
);

export default router;