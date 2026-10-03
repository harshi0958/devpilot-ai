import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { randomInt } from "crypto";
import { prisma } from "../lib/prisma";

import {
  sendWelcomeEmail,
  sendLoginOTPEmail,
  sendPasswordResetOTPEmail,
} from "./email.service";

/* =========================================================
   TYPES
========================================================= */

interface RegisterInput {
  name: string;
  email: string;
  password: string;
}

interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: string;
  createdAt: Date;
}

interface AuthResult {
  user: AuthUser;
  token: string;
}

interface OTPResult {
  success: boolean;
  message: string;
  expiresIn: number;
}

/* =========================================================
   CONFIG
========================================================= */

const JWT_SECRET = process.env.JWT_SECRET;

const JWT_EXPIRES_IN =
  process.env.JWT_EXPIRES_IN || "7d";

/*
 * OTP validity:
 * 50 seconds
 */
const OTP_EXPIRY_SECONDS = 50;

/* =========================================================
   PASSWORD FUNCTIONS
========================================================= */

export const hashPassword = async (
  password: string
): Promise<string> => {
  return bcrypt.hash(password, 12);
};

export const verifyPassword = async (
  password: string,
  passwordHash: string
): Promise<boolean> => {
  return bcrypt.compare(password, passwordHash);
};

/* =========================================================
   JWT
========================================================= */

export const generateToken = (
  user: AuthUser
): string => {
  if (!JWT_SECRET) {
    throw new Error(
      "JWT_SECRET is not configured on the backend."
    );
  }

  return jwt.sign(
    {
      userId: user.id,
      email: user.email,
      role: user.role,
    },
    JWT_SECRET,
    {
      expiresIn:
        JWT_EXPIRES_IN as jwt.SignOptions["expiresIn"],
    }
  );
};

/* =========================================================
   OTP GENERATOR
========================================================= */

const generateOTP = (): string => {
  return randomInt(100000, 1000000).toString();
};

/* =========================================================
   REGISTER USER
========================================================= */

export const registerUser = async (
  input: RegisterInput
): Promise<AuthResult> => {
  const name = input.name?.trim();
  const email = input.email?.trim().toLowerCase();
  const password = input.password;

  /* -------------------------
     VALIDATION
  ------------------------- */

  if (!name) {
    throw new Error("Name is required.");
  }

  if (!email) {
    throw new Error("Email is required.");
  }

  if (!password) {
    throw new Error("Password is required.");
  }

  if (password.length < 8) {
    throw new Error(
      "Password must be at least 8 characters."
    );
  }

  if (!JWT_SECRET) {
    throw new Error(
      "JWT_SECRET is not configured on the backend."
    );
  }

  /* -------------------------
     CHECK EXISTING USER
  ------------------------- */

  const existingUser =
    await prisma.user.findUnique({
      where: {
        email,
      },
    });

  if (existingUser) {
    throw new Error(
      "An account with this email already exists."
    );
  }

  /* -------------------------
     HASH PASSWORD
  ------------------------- */

  const passwordHash =
    await hashPassword(password);

  /* -------------------------
     CREATE USER
  ------------------------- */

  const user = await prisma.user.create({
    data: {
      name,
      email,
      passwordHash,
    },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      createdAt: true,
    },
  });

  /* -------------------------
     GENERATE JWT
  ------------------------- */

  const token = generateToken(user);

  /* -------------------------
     SEND WELCOME EMAIL
  ------------------------- */

  try {
    await sendWelcomeEmail({
      name: user.name,
      email: user.email,
    });
  } catch (error) {
    /*
     * Account creation should not fail
     * just because email delivery failed.
     */
    console.error(
      "Welcome Email Error:",
      error
    );
  }

  return {
    user,
    token,
  };
};

/* =========================================================
   SEND LOGIN OTP
========================================================= */

export const sendLoginOTP = async (
  emailInput: string
): Promise<OTPResult> => {
  const email = emailInput?.trim().toLowerCase();

  if (!email) {
    throw new Error("Email is required.");
  }

  /* -------------------------
     FIND USER
  ------------------------- */

  const user =
    await prisma.user.findUnique({
      where: {
        email,
      },
    });

  if (!user) {
    throw new Error(
      "No account found with this email."
    );
  }

  /* -------------------------
     INVALIDATE OLD LOGIN OTPs
  ------------------------- */

  await prisma.emailVerificationCode.updateMany(
    {
      where: {
        userId: user.id,
        purpose: "LOGIN",
        usedAt: null,
      },
      data: {
        usedAt: new Date(),
      },
    }
  );

  /* -------------------------
     GENERATE NEW OTP
  ------------------------- */

  const code = generateOTP();

  const expiresAt = new Date(
    Date.now() +
      OTP_EXPIRY_SECONDS * 1000
  );

  /* -------------------------
     SAVE OTP
  ------------------------- */

  await prisma.emailVerificationCode.create({
    data: {
      userId: user.id,
      email: user.email,
      code,
      purpose: "LOGIN",
      expiresAt,
    },
  });

  /* -------------------------
     SEND OTP EMAIL
  ------------------------- */

  try {
    await sendLoginOTPEmail({
      name: user.name,
      email: user.email,
      otp: code,
      expiresInSeconds:
        OTP_EXPIRY_SECONDS,
    });
  } catch (error) {
    console.error(
      "Login OTP Email Error:",
      error
    );

    /*
     * Invalidate OTP if email failed.
     */
    await prisma.emailVerificationCode.updateMany(
      {
        where: {
          userId: user.id,
          code,
          purpose: "LOGIN",
          usedAt: null,
        },
        data: {
          usedAt: new Date(),
        },
      }
    );

    throw new Error(
      "Unable to send OTP email. Please try again."
    );
  }

  return {
    success: true,
    message:
      "OTP sent successfully to your email.",
    expiresIn: OTP_EXPIRY_SECONDS,
  };
};

/* =========================================================
   VERIFY LOGIN OTP
========================================================= */

export const verifyLoginOTP = async (
  emailInput: string,
  otpInput: string
): Promise<AuthResult> => {
  const email = emailInput?.trim().toLowerCase();
  const otp = otpInput?.trim();

  /* -------------------------
     VALIDATION
  ------------------------- */

  if (!email) {
    throw new Error("Email is required.");
  }

  if (!otp) {
    throw new Error("OTP is required.");
  }

  if (!/^\d{6}$/.test(otp)) {
    throw new Error(
      "OTP must be 6 digits."
    );
  }

  if (!JWT_SECRET) {
    throw new Error(
      "JWT_SECRET is not configured on the backend."
    );
  }

  /* -------------------------
     FIND USER
  ------------------------- */

  const user =
    await prisma.user.findUnique({
      where: {
        email,
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
      },
    });

  if (!user) {
    throw new Error(
      "No account found with this email."
    );
  }

  /* -------------------------
     FIND OTP
  ------------------------- */

  const verificationCode =
    await prisma.emailVerificationCode.findFirst(
      {
        where: {
          userId: user.id,
          email: user.email,
          code: otp,
          purpose: "LOGIN",
          usedAt: null,
        },
        orderBy: {
          createdAt: "desc",
        },
      }
    );

  if (!verificationCode) {
    throw new Error(
      "Invalid or expired OTP."
    );
  }

  /* -------------------------
     CHECK EXPIRY
  ------------------------- */

  if (
    verificationCode.expiresAt.getTime() <=
    Date.now()
  ) {
    await prisma.emailVerificationCode.update({
      where: {
        id: verificationCode.id,
      },
      data: {
        usedAt: new Date(),
      },
    });

    throw new Error(
      "OTP has expired. Please request a new OTP."
    );
  }

  /* -------------------------
     MARK OTP USED
  ------------------------- */

  await prisma.emailVerificationCode.update({
    where: {
      id: verificationCode.id,
    },
    data: {
      usedAt: new Date(),
    },
  });

  /* -------------------------
     GENERATE LOGIN TOKEN
  ------------------------- */

  const token = generateToken(user);

  return {
    user,
    token,
  };
};

/* =========================================================
   RESEND LOGIN OTP
========================================================= */

export const resendLoginOTP = async (
  email: string
): Promise<OTPResult> => {
  return sendLoginOTP(email);
};

/* =========================================================
   FORGOT PASSWORD
   SEND PASSWORD RESET OTP
========================================================= */

export const sendPasswordResetOTP =
  async (
    emailInput: string
  ): Promise<OTPResult> => {
    const email =
      emailInput?.trim().toLowerCase();

    if (!email) {
      throw new Error(
        "Email is required."
      );
    }

    /* -------------------------
       FIND USER
    ------------------------- */

    const user =
      await prisma.user.findUnique({
        where: {
          email,
        },
      });

    if (!user) {
      throw new Error(
        "No account found with this email."
      );
    }

    /* -------------------------
       INVALIDATE OLD RESET OTPs
    ------------------------- */

    await prisma.emailVerificationCode.updateMany(
      {
        where: {
          userId: user.id,
          purpose: "PASSWORD_RESET",
          usedAt: null,
        },
        data: {
          usedAt: new Date(),
        },
      }
    );

    /* -------------------------
       GENERATE OTP
    ------------------------- */

    const code = generateOTP();

    const expiresAt = new Date(
      Date.now() +
        OTP_EXPIRY_SECONDS * 1000
    );

    /* -------------------------
       SAVE OTP
    ------------------------- */

    await prisma.emailVerificationCode.create({
      data: {
        userId: user.id,
        email: user.email,
        code,
        purpose: "PASSWORD_RESET",
        expiresAt,
      },
    });

    /* -------------------------
       SEND EMAIL
    ------------------------- */

    try {
      await sendPasswordResetOTPEmail({
        name: user.name,
        email: user.email,
        otp: code,
        expiresInSeconds:
          OTP_EXPIRY_SECONDS,
      });
    } catch (error) {
      console.error(
        "Password Reset OTP Email Error:",
        error
      );

      /*
       * Invalidate OTP if email fails.
       */
      await prisma.emailVerificationCode.updateMany(
        {
          where: {
            userId: user.id,
            code,
            purpose: "PASSWORD_RESET",
            usedAt: null,
          },
          data: {
            usedAt: new Date(),
          },
        }
      );

      throw new Error(
        "Unable to send password reset OTP."
      );
    }

    return {
      success: true,
      message:
        "Password reset OTP sent successfully.",
      expiresIn: OTP_EXPIRY_SECONDS,
    };
  };

/* =========================================================
   GET USER BY ID
========================================================= */

export const getUserById = async (
  userId: string
): Promise<AuthUser | null> => {
  if (!userId) {
    return null;
  }

  const user =
    await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
      },
    });

  return user;
};

export const verifyPasswordResetOTP = async (
  emailInput: string,
  otpInput: string
): Promise<{ success: boolean; message: string }> => {
  const email = emailInput?.trim().toLowerCase();
  const otp = otpInput?.trim();

  if (!email) throw new Error("Email is required.");
  if (!otp) throw new Error("OTP is required.");

  if (!/^\d{6}$/.test(otp)) {
    throw new Error("OTP must be 6 digits.");
  }

  const user = await prisma.user.findUnique({
    where: { email },
    select: {
      id: true,
      email: true,
    },
  });

  if (!user) {
    throw new Error("No account found with this email.");
  }

  const verificationCode =
    await prisma.emailVerificationCode.findFirst({
      where: {
        userId: user.id,
        email: user.email,
        code: otp,
        purpose: "PASSWORD_RESET",
        usedAt: null,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

  if (!verificationCode) {
    throw new Error("Invalid or expired OTP.");
  }

  if (verificationCode.expiresAt.getTime() <= Date.now()) {
    await prisma.emailVerificationCode.update({
      where: {
        id: verificationCode.id,
      },
      data: {
        usedAt: new Date(),
      },
    });

    throw new Error("OTP has expired. Please request a new OTP.");
  }

  return {
    success: true,
    message: "OTP verified successfully.",
  };
};


export const resetPassword = async (
  emailInput: string,
  otpInput: string,
  newPassword: string
): Promise<{ success: boolean; message: string }> => {
  const email = emailInput?.trim().toLowerCase();
  const otp = otpInput?.trim();

  if (!email) throw new Error("Email is required.");
  if (!otp) throw new Error("OTP is required.");
  if (!newPassword) throw new Error("New password is required.");

  if (!/^\d{6}$/.test(otp)) {
    throw new Error("OTP must be 6 digits.");
  }

  if (newPassword.length < 8) {
    throw new Error("Password must be at least 8 characters.");
  }

  const user = await prisma.user.findUnique({
    where: { email },
    select: {
      id: true,
      email: true,
    },
  });

  if (!user) {
    throw new Error("No account found with this email.");
  }

  const verificationCode =
    await prisma.emailVerificationCode.findFirst({
      where: {
        userId: user.id,
        email: user.email,
        code: otp,
        purpose: "PASSWORD_RESET",
        usedAt: null,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

  if (!verificationCode) {
    throw new Error("Invalid or expired OTP.");
  }

  if (verificationCode.expiresAt.getTime() <= Date.now()) {
    await prisma.emailVerificationCode.update({
      where: {
        id: verificationCode.id,
      },
      data: {
        usedAt: new Date(),
      },
    });

    throw new Error("OTP has expired. Please request a new OTP.");
  }

  const passwordHash = await hashPassword(newPassword);

  await prisma.$transaction([
    prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        passwordHash,
      },
    }),

    prisma.emailVerificationCode.update({
      where: {
        id: verificationCode.id,
      },
      data: {
        usedAt: new Date(),
      },
    }),

    prisma.emailVerificationCode.updateMany({
      where: {
        userId: user.id,
        purpose: "PASSWORD_RESET",
        usedAt: null,
        id: {
          not: verificationCode.id,
        },
      },
      data: {
        usedAt: new Date(),
      },
    }),
  ]);

  return {
    success: true,
    message: "Password reset successfully.",
  };
};