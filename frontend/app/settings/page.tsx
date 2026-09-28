"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/dashboard/Sidebar";
import TopNavbar from "@/components/dashboard/TopNavbar";

export default function SettingsPage() {
  const router = useRouter();

  const [emailNotifications, setEmailNotifications] =
    useState(true);

  const [aiNotifications, setAiNotifications] =
    useState(true);

  const [projectNotifications, setProjectNotifications] =
    useState(true);

  const [systemNotifications, setSystemNotifications] =
    useState(true);

  const [saved, setSaved] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    const storedSettings =
      localStorage.getItem("devpilot-settings");

    if (storedSettings) {
      try {
        const settings = JSON.parse(storedSettings);

        setEmailNotifications(
          settings.emailNotifications ?? true
        );

        setAiNotifications(
          settings.aiNotifications ?? true
        );

        setProjectNotifications(
          settings.projectNotifications ?? true
        );

        setSystemNotifications(
          settings.systemNotifications ?? true
        );
      } catch {
        // Ignore invalid local settings
      }
    }
  }, []);

  const saveSettings = () => {
    localStorage.setItem(
      "devpilot-settings",
      JSON.stringify({
        emailNotifications,
        aiNotifications,
        projectNotifications,
        systemNotifications,
      })
    );

    setSaved(true);

    setTimeout(() => {
      setSaved(false);
    }, 2500);
  };

  const handleLogout = async () => {
    try {
      setLoggingOut(true);

      await fetch(
        "http://localhost:5000/api/auth/logout",
        {
          method: "POST",
          credentials: "include",
        }
      );
    } catch {
      // Continue logout even if backend request fails
    } finally {
      router.push("/login");
    }
  };

  const SettingToggle = ({
    enabled,
    onChange,
  }: {
    enabled: boolean;
    onChange: (value: boolean) => void;
  }) => {
    return (
      <button
        type="button"
        onClick={() => onChange(!enabled)}
        className={`relative h-6 w-11 rounded-full transition ${
          enabled
            ? "bg-cyan-500"
            : "bg-slate-700"
        }`}
        aria-label={
          enabled ? "Disable setting" : "Enable setting"
        }
      >
        <span
          className={`absolute top-1 h-4 w-4 rounded-full bg-white transition ${
            enabled
              ? "left-6"
              : "left-1"
          }`}
        />
      </button>
    );
  };

  return (
    <div className="flex min-h-screen bg-[#070B14] text-white">
      <Sidebar />

      <div className="flex-1">
        <TopNavbar />

        <main className="p-8">
          {/* Header */}
          <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <h1 className="text-4xl font-bold text-white">
                Settings
              </h1>

              <p className="mt-2 text-slate-400">
                Configure your workspace settings and
                notifications.
              </p>
            </div>

            <button
              type="button"
              onClick={saveSettings}
              className="rounded-xl bg-cyan-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400"
            >
              {saved ? "✓ Settings Saved" : "Save Changes"}
            </button>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {/* Main Settings */}
            <div className="space-y-6 lg:col-span-2">
              {/* General */}
              <section className="rounded-2xl border border-slate-800 bg-[#0D121C] p-6">
                <div className="mb-6">
                  <h2 className="text-xl font-semibold text-white">
                    General
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Basic workspace configuration.
                  </p>
                </div>

                <div className="space-y-4">
                  {/* Appearance */}
                  <div className="flex items-center justify-between rounded-xl border border-slate-800 bg-[#090E17] p-5">
                    <div className="flex items-center gap-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-cyan-400/10 text-cyan-400">
                        ☀
                      </div>

                      <div>
                        <p className="font-medium text-white">
                          Appearance
                        </p>

                        <p className="mt-1 text-sm text-slate-500">
                          DevPilot AI is currently using dark
                          mode.
                        </p>
                      </div>
                    </div>

                    <span className="rounded-lg border border-cyan-400/20 bg-cyan-400/10 px-3 py-1.5 text-xs font-medium text-cyan-400">
                      Dark
                    </span>
                  </div>

                  {/* Language */}
                  <div className="flex items-center justify-between rounded-xl border border-slate-800 bg-[#090E17] p-5">
                    <div className="flex items-center gap-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-400/10 text-purple-400">
                        A
                      </div>

                      <div>
                        <p className="font-medium text-white">
                          Language
                        </p>

                        <p className="mt-1 text-sm text-slate-500">
                          Select your preferred interface
                          language.
                        </p>
                      </div>
                    </div>

                    <span className="rounded-lg border border-slate-700 bg-slate-800/50 px-3 py-1.5 text-xs font-medium text-slate-300">
                      English
                    </span>
                  </div>
                </div>
              </section>

              {/* Notifications */}
              <section className="rounded-2xl border border-slate-800 bg-[#0D121C] p-6">
                <div className="mb-6">
                  <h2 className="text-xl font-semibold text-white">
                    Notifications
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Choose which notifications you want to
                    receive.
                  </p>
                </div>

                <div className="space-y-3">
                  {/* Email */}
                  <div className="flex items-center justify-between rounded-xl border border-slate-800 bg-[#090E17] p-5">
                    <div>
                      <p className="font-medium text-white">
                        Email Notifications
                      </p>

                      <p className="mt-1 text-sm text-slate-500">
                        Receive important account updates by
                        email.
                      </p>
                    </div>

                    <SettingToggle
                      enabled={emailNotifications}
                      onChange={setEmailNotifications}
                    />
                  </div>

                  {/* AI */}
                  <div className="flex items-center justify-between rounded-xl border border-slate-800 bg-[#090E17] p-5">
                    <div>
                      <p className="font-medium text-white">
                        AI Execution Notifications
                      </p>

                      <p className="mt-1 text-sm text-slate-500">
                        Get notified when AI agent executions
                        complete.
                      </p>
                    </div>

                    <SettingToggle
                      enabled={aiNotifications}
                      onChange={setAiNotifications}
                    />
                  </div>

                  {/* Project */}
                  <div className="flex items-center justify-between rounded-xl border border-slate-800 bg-[#090E17] p-5">
                    <div>
                      <p className="font-medium text-white">
                        Project Notifications
                      </p>

                      <p className="mt-1 text-sm text-slate-500">
                        Receive updates related to your
                        projects.
                      </p>
                    </div>

                    <SettingToggle
                      enabled={projectNotifications}
                      onChange={setProjectNotifications}
                    />
                  </div>

                  {/* System */}
                  <div className="flex items-center justify-between rounded-xl border border-slate-800 bg-[#090E17] p-5">
                    <div>
                      <p className="font-medium text-white">
                        System Notifications
                      </p>

                      <p className="mt-1 text-sm text-slate-500">
                        Receive important system and security
                        alerts.
                      </p>
                    </div>

                    <SettingToggle
                      enabled={systemNotifications}
                      onChange={setSystemNotifications}
                    />
                  </div>
                </div>
              </section>

              {/* Security */}
              <section className="rounded-2xl border border-slate-800 bg-[#0D121C] p-6">
                <div className="mb-6">
                  <h2 className="text-xl font-semibold text-white">
                    Security
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Review your account security configuration.
                  </p>
                </div>

                <div className="rounded-xl border border-slate-800 bg-[#090E17] p-5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-400/10 text-emerald-400">
                        🔒
                      </div>

                      <div>
                        <p className="font-medium text-white">
                          Authentication
                        </p>

                        <p className="mt-1 text-sm text-slate-500">
                          Your account uses secure HTTP-only
                          authentication cookies.
                        </p>
                      </div>
                    </div>

                    <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs font-medium text-emerald-400">
                      Secure
                    </span>
                  </div>
                </div>
              </section>
            </div>

            {/* Right Side */}
            <div className="space-y-6">
              {/* Workspace Card */}
              <section className="rounded-2xl border border-slate-800 bg-[#0D121C] p-6">
                <div className="mb-5">
                  <h2 className="text-xl font-semibold text-white">
                    Workspace
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Current DevPilot workspace.
                  </p>
                </div>

                <div className="rounded-xl border border-slate-800 bg-[#090E17] p-5">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-500/10 text-2xl text-cyan-400">
                    ✦
                  </div>

                  <h3 className="mt-4 text-lg font-semibold text-white">
                    DevPilot AI
                  </h3>

                  <p className="mt-1 text-sm text-slate-500">
                    Autonomous Software Engineering
                    Workspace
                  </p>

                  <div className="mt-5 flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-emerald-400" />

                    <span className="text-sm text-emerald-400">
                      Workspace Active
                    </span>
                  </div>
                </div>
              </section>

              {/* AI Agents */}
              <section className="rounded-2xl border border-slate-800 bg-[#0D121C] p-6">
                <div className="mb-5">
                  <h2 className="text-xl font-semibold text-white">
                    AI Agents
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Available software engineering agents.
                  </p>
                </div>

                <div className="space-y-2">
                  {[
                    "Architect",
                    "Developer",
                    "UI/UX",
                    "Debugger",
                    "Testing",
                    "Documentation",
                  ].map((agent) => (
                    <div
                      key={agent}
                      className="flex items-center justify-between rounded-lg border border-slate-800 bg-[#090E17] px-4 py-3"
                    >
                      <span className="text-sm text-slate-300">
                        {agent}
                      </span>

                      <span className="h-2 w-2 rounded-full bg-emerald-400" />
                    </div>
                  ))}
                </div>
              </section>

              {/* Danger Zone */}
              <section className="rounded-2xl border border-red-500/20 bg-red-500/3 p-6">
                <div className="mb-5">
                  <h2 className="text-xl font-semibold text-white">
                    Account
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Manage your current session.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleLogout}
                  disabled={loggingOut}
                  className="w-full rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm font-semibold text-red-400 transition hover:bg-red-500/20 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {loggingOut
                    ? "Signing out..."
                    : "Sign Out"}
                </button>
              </section>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}