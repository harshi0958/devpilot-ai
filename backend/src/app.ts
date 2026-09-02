import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth";

import agentRoutes from "./routes/agents";

const app = express();

/*
|--------------------------------------------------------------------------
| Security Middleware
|--------------------------------------------------------------------------
*/

app.use(helmet());

/*
|--------------------------------------------------------------------------
| CORS
|--------------------------------------------------------------------------
*/

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
  })
);
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
app.use("/api/auth", authRoutes);
/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

// AI Agents
app.use("/api/agents", agentRoutes);

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