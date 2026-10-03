import { Router, Request, Response } from "express";
import {
  registerUser,
  sendLoginOTP,
  verifyLoginOTP,
  resendLoginOTP,
  sendPasswordResetOTP,
  getUserById,
  verifyPasswordResetOTP,
  resetPassword
} from "../services/auth.service";
import {
  authenticate,
  AuthenticatedRequest,
} from "../middleware/auth.middleware";

const router = Router();

const COOKIE_NAME = "auth_token";

/* =========================================================
   AUTH COOKIE
========================================================= */

const setAuthCookie = (
  res: Response,
  token: string
) => {
  res.cookie(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",

    // Required for Vercel frontend + Render backend
    sameSite:
      process.env.NODE_ENV === "production"
        ? "none"
        : "lax",

    path: "/",

    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
};

/* =========================================================
   REGISTER
========================================================= */

router.post(
  "/register",
  async (req: Request, res: Response) => {
    try {
      const {
        name,
        email,
        password,
      } = req.body;

      const result = await registerUser({
        name,
        email,
        password,
      });

      /*
       * Registration creates the account and sends
       * the welcome email.
       *
       * We intentionally do NOT automatically log
       * the user in here. User will login using OTP.
       */

      return res.status(201).json({
        success: true,
        message:
          "Account created successfully. Please login using the OTP sent to your email.",
        user: result.user,
      });
    } catch (error) {
      console.error(
        "Register Error:",
        error
      );

      const message =
        error instanceof Error
          ? error.message
          : "Failed to create account.";

      if (
        message ===
        "An account with this email already exists."
      ) {
        return res.status(409).json({
          success: false,
          message,
        });
      }

      if (
        message === "Name is required." ||
        message === "Email is required." ||
        message === "Password is required." ||
        message ===
          "Password must be at least 8 characters."
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
  }
);

/* =========================================================
   SEND LOGIN OTP
========================================================= */

router.post(
  "/login",
  async (req: Request, res: Response) => {
    try {
      const { email } = req.body;

      const result = await sendLoginOTP(email);

      return res.status(200).json({
        success: true,
        message: result.message,
        expiresIn: result.expiresIn,
      });
    } catch (error) {
      console.error(
        "Send Login OTP Error:",
        error
      );

      const message =
        error instanceof Error
          ? error.message
          : "Failed to send login OTP.";

      if (
        message === "Email is required." ||
        message ===
          "No account found with this email."
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
  }
);

/* =========================================================
   VERIFY LOGIN OTP
========================================================= */

router.post(
  "/login/verify",
  async (req: Request, res: Response) => {
    try {
      const {
        email,
        otp,
      } = req.body;

      const result = await verifyLoginOTP(
        email,
        otp
      );

      setAuthCookie(
        res,
        result.token
      );

      return res.status(200).json({
        success: true,
        message: "Login successful.",
        user: result.user,
      });
    } catch (error) {
      console.error(
        "Verify Login OTP Error:",
        error
      );

      const message =
        error instanceof Error
          ? error.message
          : "Failed to verify OTP.";

      if (
        message === "Email is required." ||
        message === "OTP is required." ||
        message === "OTP must be 6 digits." ||
        message ===
          "No account found with this email." ||
        message === "Invalid or expired OTP." ||
        message ===
          "OTP has expired. Please request a new OTP."
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
  }
);

/* =========================================================
   RESEND LOGIN OTP
========================================================= */

router.post(
  "/login/resend",
  async (req: Request, res: Response) => {
    try {
      const { email } = req.body;

      const result =
        await resendLoginOTP(email);

      return res.status(200).json({
        success: true,
        message: result.message,
        expiresIn: result.expiresIn,
      });
    } catch (error) {
      console.error(
        "Resend Login OTP Error:",
        error
      );

      const message =
        error instanceof Error
          ? error.message
          : "Failed to resend OTP.";

      if (
        message === "Email is required." ||
        message ===
          "No account found with this email."
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
  }
);

/* =========================================================
   FORGOT PASSWORD - SEND OTP
========================================================= */

router.post(
  "/forgot-password",
  async (req: Request, res: Response) => {
    try {
      const { email } = req.body;

      const result =
        await sendPasswordResetOTP(email);

      return res.status(200).json({
        success: true,
        message: result.message,
        expiresIn: result.expiresIn,
      });
    } catch (error) {
      console.error(
        "Forgot Password Error:",
        error
      );

      const message =
        error instanceof Error
          ? error.message
          : "Failed to send password reset OTP.";

      if (
        message === "Email is required." ||
        message ===
          "No account found with this email."
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
  }
);

// VERIFY PASSWORD RESET OTP
router.post("/forgot-password/verify", async (req, res) => {
  try {
    const { email, otp } = req.body;

    const result = await verifyPasswordResetOTP(email, otp);

    return res.status(200).json({
      success: true,
      message: result.message,
    });
  } catch (error) {
    console.error("Verify Password Reset OTP Error:", error);

    return res.status(400).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Unable to verify OTP.",
    });
  }
});


// RESET PASSWORD
router.post("/reset-password", async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    const result = await resetPassword(
      email,
      otp,
      newPassword
    );

    return res.status(200).json({
      success: true,
      message: result.message,
    });
  } catch (error) {
    console.error("Reset Password Error:", error);

    return res.status(400).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Unable to reset password.",
    });
  }
});

/* =========================================================
   CURRENT USER
========================================================= */

router.get(
  "/me",
  authenticate,
  async (
    req: AuthenticatedRequest,
    res: Response
  ) => {
    try {
      if (!req.user?.userId) {
        return res.status(401).json({
          success: false,
          message: "Authentication required.",
        });
      }

      const user = await getUserById(
        req.user.userId
      );

      if (!user) {
        res.clearCookie(
          COOKIE_NAME,
          {
            httpOnly: true,
            secure:
              process.env.NODE_ENV ===
              "production",
            sameSite:
              process.env.NODE_ENV ===
              "production"
                ? "none"
                : "lax",
            path: "/",
          }
        );

        return res.status(401).json({
          success: false,
          message:
            "User account no longer exists.",
        });
      }

      return res.status(200).json({
        success: true,
        user,
      });
    } catch (error) {
      console.error(
        "Get Current User Error:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Failed to fetch current user.",
      });
    }
  }
);

/* =========================================================
   LOGOUT
========================================================= */

router.post(
  "/logout",
  (_req: Request, res: Response) => {
    res.clearCookie(
      COOKIE_NAME,
      {
        httpOnly: true,
        secure:
          process.env.NODE_ENV ===
          "production",
        sameSite:
          process.env.NODE_ENV ===
          "production"
            ? "none"
            : "lax",
        path: "/",
      }
    );

    return res.status(200).json({
      success: true,
      message:
        "Logged out successfully.",
    });
  }
);

export default router;