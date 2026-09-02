import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "../lib/prisma";

interface RegisterInput {
  name: string;
  email: string;
  password: string;
}

interface LoginInput {
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

const JWT_SECRET = process.env.JWT_SECRET;

const JWT_EXPIRES_IN =
  process.env.JWT_EXPIRES_IN || "7d";

if (!JWT_SECRET) {
  console.warn(
    "⚠️ JWT_SECRET is not configured."
  );
}

// ============================================================
// PASSWORD HASHING
// ============================================================

export const hashPassword = async (
  password: string
): Promise<string> => {
  return bcrypt.hash(password, 12);
};

// ============================================================
// PASSWORD VERIFICATION
// ============================================================

export const verifyPassword = async (
  password: string,
  passwordHash: string
): Promise<boolean> => {
  return bcrypt.compare(
    password,
    passwordHash
  );
};

// ============================================================
// JWT GENERATION
// ============================================================

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
      expiresIn: JWT_EXPIRES_IN as jwt.SignOptions["expiresIn"],
    }
  );
};

// ============================================================
// REGISTER
// ============================================================

export const registerUser = async (
  input: RegisterInput
): Promise<AuthResult> => {
  const name = input.name.trim();
  const email = input.email
    .trim()
    .toLowerCase();
  const password = input.password;

  if (!name) {
    throw new Error(
      "Name is required."
    );
  }

  if (!email) {
    throw new Error(
      "Email is required."
    );
  }

  if (!password) {
    throw new Error(
      "Password is required."
    );
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

  // ----------------------------------------------------------
  // CHECK EXISTING USER
  // ----------------------------------------------------------

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

  // ----------------------------------------------------------
  // HASH PASSWORD
  // ----------------------------------------------------------

  const passwordHash =
    await hashPassword(password);

  // ----------------------------------------------------------
  // CREATE USER
  // ----------------------------------------------------------

  const user =
    await prisma.user.create({
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

  // ----------------------------------------------------------
  // GENERATE JWT
  // ----------------------------------------------------------

  const token =
    generateToken(user);

  return {
    user,
    token,
  };
};

// ============================================================
// LOGIN
// ============================================================

export const loginUser = async (
  input: LoginInput
): Promise<AuthResult> => {
  const email = input.email
    .trim()
    .toLowerCase();

  const password = input.password;

  if (!email || !password) {
    throw new Error(
      "Email and password are required."
    );
  }

  if (!JWT_SECRET) {
    throw new Error(
      "JWT_SECRET is not configured on the backend."
    );
  }

  // ----------------------------------------------------------
  // FIND USER
  // ----------------------------------------------------------

  const user =
    await prisma.user.findUnique({
      where: {
        email,
      },
    });

  // ----------------------------------------------------------
  // GENERIC ERROR
  // ----------------------------------------------------------

  if (!user) {
    throw new Error(
      "Invalid email or password."
    );
  }

  // ----------------------------------------------------------
  // VERIFY PASSWORD
  // ----------------------------------------------------------

  const passwordValid =
    await verifyPassword(
      password,
      user.passwordHash
    );

  if (!passwordValid) {
    throw new Error(
      "Invalid email or password."
    );
  }

  // ----------------------------------------------------------
  // USER RESPONSE
  // ----------------------------------------------------------

  const safeUser: AuthUser = {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    createdAt: user.createdAt,
  };

  // ----------------------------------------------------------
  // GENERATE JWT
  // ----------------------------------------------------------

  const token =
    generateToken(safeUser);

  return {
    user: safeUser,
    token,
  };
};

// ============================================================
// GET USER BY ID
// ============================================================

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