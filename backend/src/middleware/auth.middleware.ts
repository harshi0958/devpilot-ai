import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface JwtPayload {
  userId: string;
  email: string;
  role: string;
}

export interface AuthenticatedRequest extends Request {
  user?: JwtPayload;
}

const JWT_SECRET = process.env.JWT_SECRET;

export const authenticate = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!JWT_SECRET) {
      return res.status(500).json({
        success: false,
        message: "JWT_SECRET is not configured on the backend.",
      });
    }

    const token = req.cookies?.auth_token;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Authentication required. Please login first.",
      });
    }

    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;

    if (!decoded.userId) {
      return res.status(401).json({
        success: false,
        message: "Invalid authentication token.",
      });
    }

    req.user = decoded;

    next();
  } catch (error) {
    console.error("Authentication Error:", error);

    return res.status(401).json({
      success: false,
      message: "Invalid or expired authentication token.",
    });
  }
};