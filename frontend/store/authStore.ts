"use client";

import { create } from "zustand";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: string;
  createdAt: string;
}

interface AuthState {
  user: AuthUser | null;
  loading: boolean;
  initialized: boolean;

  register: (
    name: string,
    email: string,
    password: string
  ) => Promise<{ success: boolean; message: string }>;

  login: (
    email: string,
    password: string
  ) => Promise<{ success: boolean; message: string }>;

  fetchCurrentUser: () => Promise<void>;

  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: false,
  initialized: false,

  // ==========================================
  // REGISTER
  // ==========================================
  register: async (name, email, password) => {
    set({ loading: true });

    try {
      const response = await fetch(`${API_URL}/api/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          message: data?.message || "Registration failed.",
        };
      }

      set({
        user: data.user,
      });

      return {
        success: true,
        message: data?.message || "Account created successfully.",
      };
    } catch (error) {
      console.error("Register Error:", error);

      return {
        success: false,
        message: "Unable to connect to the backend.",
      };
    } finally {
      set({ loading: false });
    }
  },

  // ==========================================
  // LOGIN
  // ==========================================
  login: async (email, password) => {
    set({ loading: true });

    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          message: data?.message || "Login failed.",
        };
      }

      set({
        user: data.user,
      });

      return {
        success: true,
        message: data?.message || "Login successful.",
      };
    } catch (error) {
      console.error("Login Error:", error);

      return {
        success: false,
        message: "Unable to connect to the backend.",
      };
    } finally {
      set({ loading: false });
    }
  },

  // ==========================================
  // GET CURRENT USER
  // ==========================================
  fetchCurrentUser: async () => {
    set({ loading: true });

    try {
      const response = await fetch(`${API_URL}/api/auth/me`, {
        method: "GET",
        credentials: "include",
      });

      if (!response.ok) {
        set({
          user: null,
        });

        return;
      }

      const data = await response.json();

      set({
        user: data.user || null,
      });
    } catch (error) {
      console.error("Fetch Current User Error:", error);

      set({
        user: null,
      });
    } finally {
      set({
        loading: false,
        initialized: true,
      });
    }
  },

  // ==========================================
  // LOGOUT
  // ==========================================
  logout: async () => {
    set({ loading: true });

    try {
      await fetch(`${API_URL}/api/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
    } catch (error) {
      console.error("Logout Error:", error);
    } finally {
      set({
        user: null,
        loading: false,
      });
    }
  },
}));