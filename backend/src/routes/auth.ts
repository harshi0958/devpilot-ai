import { Router, Request, Response } from "express";
import {
  registerUser,
  loginUser,
  getUserById,
} from "../services/auth.service";
import {
  authenticate,
  AuthenticatedRequest,
} from "../middleware/auth.middleware";

const router = Router();

const COOKIE_NAME = "auth_token";

const setAuthCookie = (res: Response, token: string) => {
  res.cookie(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
};

router.post("/register", async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    const result = await registerUser({
      name,
      email,
      password,
    });

    setAuthCookie(res, result.token);

    return res.status(201).json({
      success: true,
      message: "Account created successfully.",
      user: result.user,
    });
  } catch (error) {
    console.error("Register Error:", error);

    const message =
      error instanceof Error
        ? error.message
        : "Failed to create account.";

    if (message === "An account with this email already exists.") {
      return res.status(409).json({
        success: false,
        message,
      });
    }

    if (
      message === "Name is required." ||
      message === "Email is required." ||
      message === "Password is required." ||
      message === "Password must be at least 8 characters."
    ) {
      return res.status(400).json({
        success: false,
        message,
      });
    }

    return res.status(500).json({
      success: false,
      message,
    });
  }
});

router.post("/login", async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const result = await loginUser({
      email,
      password,
    });

    setAuthCookie(res, result.token);

    return res.status(200).json({
      success: true,
      message: "Login successful.",
      user: result.user,
    });
  } catch (error) {
    console.error("Login Error:", error);

    const message =
      error instanceof Error
        ? error.message
        : "Failed to login.";

    if (
      message === "Email and password are required." ||
      message === "Invalid email or password."
    ) {
      return res.status(401).json({
        success: false,
        message,
      });
    }

    return res.status(500).json({
      success: false,
      message,
    });
  }
});

router.get(
  "/me",
  authenticate,
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      if (!req.user?.userId) {
        return res.status(401).json({
          success: false,
          message: "Authentication required.",
        });
      }

      const user = await getUserById(req.user.userId);

      if (!user) {
        res.clearCookie(COOKIE_NAME, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          path: "/",
        });

        return res.status(401).json({
          success: false,
          message: "User account no longer exists.",
        });
      }

      return res.status(200).json({
        success: true,
        user,
      });
    } catch (error) {
      console.error("Get Current User Error:", error);

      return res.status(500).json({
        success: false,
        message: "Failed to fetch current user.",
      });
    }
  }
);

router.post("/logout", (_req: Request, res: Response) => {
  res.clearCookie(COOKIE_NAME, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  });

  return res.status(200).json({
    success: true,
    message: "Logged out successfully.",
  });
});

export default router;