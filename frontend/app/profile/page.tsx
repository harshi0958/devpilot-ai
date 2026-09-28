"use client";

import { useEffect, useState } from "react";
import Sidebar from "@/components/dashboard/Sidebar";
import TopNavbar from "@/components/dashboard/TopNavbar";

interface User {
  id: string;
  name: string;
  email: string;
  role?: string;
  avatarUrl?: string | null;
  createdAt?: string;
}

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          "http://localhost:5000/api/auth/me",
          {
            method: "GET",
            credentials: "include",
          }
        );

        const result = await response.json();

        if (!response.ok) {
          throw new Error(
            result?.message || "Failed to load profile."
          );
        }

        const currentUser =
          result?.user ||
          result?.data?.user ||
          result?.data ||
          result;

        setUser(currentUser);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Unable to load profile."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const getInitial = () => {
    if (!user?.name) return "U";

    return user.name
      .trim()
      .charAt(0)
      .toUpperCase();
  };

  const formatDate = (date?: string) => {
    if (!date) return "Not available";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "Not available";
    }

    return parsedDate.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  const formatRole = (role?: string) => {
    if (!role) return "User";

    return role.charAt(0).toUpperCase() +
      role.slice(1).toLowerCase();
  };

  return (
    <div className="flex min-h-screen bg-[#070B14] text-white">
      <Sidebar />

      <div className="flex-1">
        <TopNavbar />

        <main className="p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-white">
              Profile
            </h1>

            <p className="mt-2 text-slate-400">
              Manage your personal account and preferences.
            </p>
          </div>

          {/* Loading */}
          {loading && (
            <div className="rounded-2xl border border-slate-800 bg-[#0D121C] p-8">
              <div className="flex items-center gap-4">
                <div className="h-14 w-14 animate-pulse rounded-full bg-slate-800" />

                <div className="space-y-3">
                  <div className="h-5 w-40 animate-pulse rounded bg-slate-800" />
                  <div className="h-4 w-56 animate-pulse rounded bg-slate-800" />
                </div>
              </div>
            </div>
          )}

          {/* Error */}
          {!loading && error && (
            <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-6">
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-500/10 text-red-400">
                  !
                </div>

                <div>
                  <h2 className="font-semibold text-red-300">
                    Unable to load profile
                  </h2>

                  <p className="mt-1 text-sm text-red-400/80">
                    {error}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Profile */}
          {!loading && !error && user && (
            <div className="grid gap-6 lg:grid-cols-3">
              {/* Left Profile Card */}
              <div className="rounded-2xl border border-slate-800 bg-[#0D121C] p-6 lg:col-span-1">
                <div className="flex flex-col items-center text-center">
                  {/* Avatar */}
                  <div className="flex h-28 w-28 items-center justify-center overflow-hidden rounded-full border-4 border-cyan-400/20 bg-cyan-500/10">
                    {user.avatarUrl ? (
                      <img
                        src={user.avatarUrl}
                        alt={user.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <span className="text-4xl font-bold text-cyan-400">
                        {getInitial()}
                      </span>
                    )}
                  </div>

                  <h2 className="mt-5 text-2xl font-bold text-white">
                    {user.name}
                  </h2>

                  <p className="mt-1 text-sm text-slate-400">
                    {user.email}
                  </p>

                  {/* Role */}
                  <div className="mt-4 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-1.5">
                    <span className="text-sm font-medium text-cyan-400">
                      {formatRole(user.role)}
                    </span>
                  </div>
                </div>

                <div className="mt-8 border-t border-slate-800 pt-6">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-500">
                      Account Status
                    </span>

                    <span className="flex items-center gap-2 text-sm font-medium text-emerald-400">
                      <span className="h-2 w-2 rounded-full bg-emerald-400" />
                      Active
                    </span>
                  </div>
                </div>
              </div>

              {/* Right Content */}
              <div className="space-y-6 lg:col-span-2">
                {/* Personal Information */}
                <div className="rounded-2xl border border-slate-800 bg-[#0D121C] p-6">
                  <div className="mb-6">
                    <h2 className="text-xl font-semibold text-white">
                      Personal Information
                    </h2>

                    <p className="mt-1 text-sm text-slate-500">
                      Your account information stored in DevPilot AI.
                    </p>
                  </div>

                  <div className="grid gap-5 sm:grid-cols-2">
                    {/* Name */}
                    <div>
                      <label className="mb-2 block text-sm font-medium text-slate-400">
                        Full Name
                      </label>

                      <div className="rounded-xl border border-slate-800 bg-[#090E17] px-4 py-3">
                        <p className="text-sm text-white">
                          {user.name}
                        </p>
                      </div>
                    </div>

                    {/* Email */}
                    <div>
                      <label className="mb-2 block text-sm font-medium text-slate-400">
                        Email Address
                      </label>

                      <div className="rounded-xl border border-slate-800 bg-[#090E17] px-4 py-3">
                        <p className="break-all text-sm text-white">
                          {user.email}
                        </p>
                      </div>
                    </div>

                    {/* Role */}
                    <div>
                      <label className="mb-2 block text-sm font-medium text-slate-400">
                        Account Role
                      </label>

                      <div className="rounded-xl border border-slate-800 bg-[#090E17] px-4 py-3">
                        <p className="text-sm text-white">
                          {formatRole(user.role)}
                        </p>
                      </div>
                    </div>

                    {/* Member Since */}
                    <div>
                      <label className="mb-2 block text-sm font-medium text-slate-400">
                        Member Since
                      </label>

                      <div className="rounded-xl border border-slate-800 bg-[#090E17] px-4 py-3">
                        <p className="text-sm text-white">
                          {formatDate(user.createdAt)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Account Overview */}
                <div className="rounded-2xl border border-slate-800 bg-[#0D121C] p-6">
                  <div className="mb-6">
                    <h2 className="text-xl font-semibold text-white">
                      Account Overview
                    </h2>

                    <p className="mt-1 text-sm text-slate-500">
                      Quick information about your DevPilot account.
                    </p>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-3">
                    {/* Workspace */}
                    <div className="rounded-xl border border-slate-800 bg-[#090E17] p-5">
                      <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-cyan-400/10 text-lg">
                        ◈
                      </div>

                      <p className="text-sm text-slate-500">
                        Workspace
                      </p>

                      <p className="mt-1 font-semibold text-white">
                        DevPilot AI
                      </p>
                    </div>

                    {/* AI Agents */}
                    <div className="rounded-xl border border-slate-800 bg-[#090E17] p-5">
                      <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-purple-400/10 text-lg">
                        ✦
                      </div>

                      <p className="text-sm text-slate-500">
                        AI Agents
                      </p>

                      <p className="mt-1 font-semibold text-white">
                        6 Agents
                      </p>
                    </div>

                    {/* Status */}
                    <div className="rounded-xl border border-slate-800 bg-[#090E17] p-5">
                      <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-400/10 text-lg">
                        ✓
                      </div>

                      <p className="text-sm text-slate-500">
                        Status
                      </p>

                      <p className="mt-1 font-semibold text-emerald-400">
                        Active
                      </p>
                    </div>
                  </div>
                </div>

                {/* Security */}
                <div className="rounded-2xl border border-slate-800 bg-[#0D121C] p-6">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <h2 className="text-xl font-semibold text-white">
                        Account Security
                      </h2>

                      <p className="mt-1 text-sm text-slate-500">
                        Your account is protected using secure authentication.
                      </p>
                    </div>

                    <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-2">
                      <span className="text-sm font-medium text-emerald-400">
                        ● Secure
                      </span>
                    </div>
                  </div>

                  <div className="mt-5 rounded-xl border border-slate-800 bg-[#090E17] p-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-cyan-400/10 text-cyan-400">
                        🔒
                      </div>

                      <div>
                        <p className="text-sm font-medium text-white">
                          Authentication
                        </p>

                        <p className="mt-1 text-xs text-slate-500">
                          HTTP-only secure authentication cookie is enabled.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* No User */}
          {!loading && !error && !user && (
            <div className="rounded-2xl border border-slate-800 bg-[#0D121C] p-8 text-center">
              <p className="text-slate-400">
                No profile information found.
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}