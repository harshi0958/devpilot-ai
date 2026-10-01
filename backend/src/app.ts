import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/auth";
import projectRoutes from "./routes/projects";
import agentRoutes from "./routes/agents";
import executionsRouter from "./routes/executions";
import workflowRoutes from "./routes/workflow";
import githubRoutes from "./routes/github";
import filesRouter from "./routes/files";
import studentRoutes from "./routes/student.routes";

const app = express();

/*
|--------------------------------------------------------------------------
| Security Middleware
|--------------------------------------------------------------------------
*/

app.use(helmet());

const allowedOrigin =
  process.env.FRONTEND_URL || "http://localhost:3000";

app.use(
  cors({
    origin: allowedOrigin,
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    optionsSuccessStatus: 204,
  })
);

app.options("*", cors({
  origin: allowedOrigin,
  credentials: true,
}));

app.use(cookieParser());

/*
|--------------------------------------------------------------------------
| Body Parser
|--------------------------------------------------------------------------
*/

app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true }));

/*
|--------------------------------------------------------------------------
| Logger
|--------------------------------------------------------------------------
*/

app.use(morgan("dev"));

/*
|--------------------------------------------------------------------------
| Health Check
|--------------------------------------------------------------------------
*/

app.get("/health", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "DevPilot AI Backend is running",
    timestamp: new Date().toISOString(),
  });
});

/*
|--------------------------------------------------------------------------
| Root Route
|--------------------------------------------------------------------------
*/

app.get("/", (_req, res) => {
  res.status(200).json({
    success: true,
    name: "DevPilot AI API",
    version: "1.0.0",
    status: "running",
  });
});

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

// Authentication
app.use("/api/auth", authRoutes);

// AI Agents
app.use("/api/agents", agentRoutes);

// Projects
app.use("/api/projects", projectRoutes);

// Executions
app.use("/api/executions", executionsRouter);

// Files
app.use("/api/files", filesRouter);

// AI Agent Workflow
app.use("/api/agents/workflow", workflowRoutes);

// GitHub Integration
app.use("/api/github", githubRoutes);

// Student API
app.use("/api/students", studentRoutes);

/*
|--------------------------------------------------------------------------
| 404 Handler
|--------------------------------------------------------------------------
*/

app.use((_req, res) => {
  res.status(404).json({
    success: false,
    message: "API route not found",
  });
});

/*
|--------------------------------------------------------------------------
| Global Error Handler
|--------------------------------------------------------------------------
*/

app.use(
  (
    err: Error,
    _req: express.Request,
    res: express.Response,
    _next: express.NextFunction
  ) => {
    console.error("Global Error:", err);

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
);

export default app;