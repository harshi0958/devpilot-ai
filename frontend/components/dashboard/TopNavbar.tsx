"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  Bell,
  ChevronDown,
  Moon,
  Sun,
  Search,
  Settings,
} from "lucide-react";

import ProfileDropdown from "./ProfileDropdown";
import NotificationDropdown from "./NotificationDropdown";

type ThemeMode = "dark" | "light";

const useTheme = (): {
  theme: ThemeMode;
  toggleTheme: () => void;
} => {
  const [theme, setTheme] = useState<ThemeMode>("dark");

  useEffect(() => {
    const storedTheme = window.localStorage.getItem("theme");
    const preferredTheme: ThemeMode =
      storedTheme === "light" || storedTheme === "dark"
        ? storedTheme
        : "dark";

    setTheme(preferredTheme);
    document.documentElement.classList.toggle(
      "dark",
      preferredTheme === "dark"
    );
  }, []);

  const toggleTheme = () => {
    setTheme((currentTheme) => {
      const nextTheme: ThemeMode =
        currentTheme === "dark" ? "light" : "dark";

      document.documentElement.classList.toggle(
        "dark",
        nextTheme === "dark"
      );
      window.localStorage.setItem("theme", nextTheme);

      return nextTheme;
    });
  };

  return { theme, toggleTheme };
};

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

type Execution = {
  id: string;
  status: string;
  createdAt: string;
  agent?: {
    name: string;
  } | null;
  project?: {
    name: string;
  } | null;
};

type Notification = {
  title: string;
  time: string;
};

export default function TopNavbar() {
  const { theme, toggleTheme } = useTheme();

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [notificationOpen, setNotificationOpen] =
    useState(false);

  const [profileOpen, setProfileOpen] = useState(false);

  const profileRef = useRef<HTMLDivElement>(null);
  const notificationRef = useRef<HTMLDivElement>(null);

  /* ----------------------------- */
  /* Fetch recent activity */
  /* ----------------------------- */

  useEffect(() => {
    let cancelled = false;

    const fetchNotifications = async () => {
      try {
        const response = await fetch(
          `${API_URL}/api/executions`,
          {
            method: "GET",
            credentials: "include",
          }
        );

        if (!response.ok) {
          throw new Error(
            "Failed to fetch notifications"
          );
        }

        const data = await response.json();

        const executions: Execution[] =
          Array.isArray(data?.data)
            ? data.data
            : [];

        const recent = executions
          .slice(0, 4)
          .map((execution) => ({
            title: getNotificationTitle(execution),
            time: getRelativeTime(
              execution.createdAt
            ),
          }));

        if (!cancelled) {
          setNotifications(recent);
        }
      } catch (error) {
        console.error(
          "Failed to load notifications:",
          error
        );

        if (!cancelled) {
          setNotifications([]);
        }
      }
    };

    fetchNotifications();

    return () => {
      cancelled = true;
    };
  }, []);

  const getNotificationTitle = (
    execution: Execution
  ) => {
    const agentName =
      execution.agent?.name || "AI Agent";

    const projectName =
      execution.project?.name || "Project";

    switch (execution.status) {
      case "COMPLETED":
        return `${agentName} completed work on ${projectName}`;

      case "RUNNING":
        return `${agentName} is working on ${projectName}`;

      case "FAILED":
        return `${agentName} encountered an issue in ${projectName}`;

      case "QUEUED":
        return `${agentName} queued work for ${projectName}`;

      default:
        return `${agentName} updated ${projectName}`;
    }
  };

  const getRelativeTime = (date: string) => {
    const timestamp = new Date(date).getTime();

    if (Number.isNaN(timestamp)) {
      return "Recently";
    }

    const difference = Math.max(
      0,
      Date.now() - timestamp
    );

    const seconds = Math.floor(
      difference / 1000
    );

    const minutes = Math.floor(
      seconds / 60
    );

    const hours = Math.floor(
      minutes / 60
    );

    const days = Math.floor(
      hours / 24
    );

    if (seconds < 60) {
      return "Just now";
    }

    if (minutes < 60) {
      return `${minutes} min ago`;
    }

    if (hours < 24) {
      return `${hours} hour${
        hours > 1 ? "s" : ""
      } ago`;
    }

    return `${days} day${
      days > 1 ? "s" : ""
    } ago`;
  };

  /* ----------------------------- */
  /* Mark notifications as read */
  /* ----------------------------- */

  const handleMarkAll = () => {
    setNotifications([]);
    setNotificationOpen(false);
  };

  const notificationCount =
    notifications.length;

  /* ----------------------------- */
  /* Outside click */
  /* ----------------------------- */

  useEffect(() => {
    function handleClickOutside(
      event: MouseEvent
    ) {
      const target = event.target as Node;

      if (
        profileRef.current &&
        !profileRef.current.contains(target)
      ) {
        setProfileOpen(false);
      }

      if (
        notificationRef.current &&
        !notificationRef.current.contains(target)
      ) {
        setNotificationOpen(false);
      }
    }

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, []);

  /* ----------------------------- */
  /* Escape key */
  /* ----------------------------- */

  useEffect(() => {
    function handleEscape(
      event: KeyboardEvent
    ) {
      if (event.key === "Escape") {
        setProfileOpen(false);
        setNotificationOpen(false);
      }
    }

    document.addEventListener(
      "keydown",
      handleEscape
    );

    return () => {
      document.removeEventListener(
        "keydown",
        handleEscape
      );
    };
  }, []);

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-[#0B1220]/80 backdrop-blur-xl">
      <div className="flex h-20 items-center justify-between px-8">

        {/* Left */}
        <div className="flex items-center gap-6">

          <h1 className="hidden text-2xl font-bold text-white lg:block">
            Dashboard
          </h1>

          {/* Search */}
          <div className="relative hidden md:block">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="text"
              placeholder="Search projects, agents, files..."
              className="
                w-96
                rounded-xl
                border
                border-white/10
                bg-[#111827]
                py-3
                pl-11
                pr-20
                text-sm
                text-white
                placeholder:text-slate-500
                outline-none
                transition-all
                focus:border-cyan-500
                focus:ring-2
                focus:ring-cyan-500/20
              "
            />

            <div
              className="
                absolute
                right-3
                top-1/2
                -translate-y-1/2
                rounded-md
                border
                border-white/10
                bg-[#1F2937]
                px-2
                py-1
                text-[10px]
                text-slate-400
              "
            >
              Ctrl K
            </div>
          </div>
        </div>

        {/* Right */}
        <div className="flex items-center gap-3">

          {/* Notifications */}
          <div
            className="relative"
            ref={notificationRef}
          >
            <button
              type="button"
              onClick={() =>
                setNotificationOpen(
                  !notificationOpen
                )
              }
              className="
                relative
                flex
                h-11
                w-11
                items-center
                justify-center
                rounded-xl
                border
                border-white/10
                bg-[#111827]
                transition-all
                hover:border-cyan-500
              "
              aria-label="Notifications"
            >
              <Bell
                size={18}
                className="text-white"
              />

              {notificationCount > 0 && (
                <span
                  className="
                    absolute
                    -right-1
                    -top-1
                    flex
                    h-5
                    w-5
                    items-center
                    justify-center
                    rounded-full
                    bg-red-500
                    text-[10px]
                    font-bold
                    text-white
                  "
                >
                  {notificationCount}
                </span>
              )}
            </button>

            <NotificationDropdown
              isOpen={notificationOpen}
              notifications={notifications}
              onMarkAll={handleMarkAll}
            />
          </div>

          {/* Theme */}
          <button
            type="button"
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="
              flex
              h-11
              w-11
              items-center
              justify-center
              rounded-xl
              border
              border-white/10
              bg-[#111827]
              transition-all
              duration-300
              hover:border-cyan-500
              hover:rotate-12
            "
          >
            {theme === "dark" ? (
              <Sun
                size={18}
                className="text-yellow-400"
              />
            ) : (
              <Moon
                size={18}
                className="text-slate-700"
              />
            )}
          </button>

          {/* Settings */}
          <Link
            href="/settings"
            aria-label="Settings"
            className="
              flex
              h-11
              w-11
              items-center
              justify-center
              rounded-xl
              border
              border-white/10
              bg-[#111827]
              transition-all
              hover:border-cyan-500
            "
          >
            <Settings
              size={18}
              className="text-white"
            />
          </Link>

          {/* Profile */}
          <div
            className="relative"
            ref={profileRef}
          >
            <button
              type="button"
              onClick={() =>
                setProfileOpen(!profileOpen)
              }
              className="
                flex
                items-center
                gap-3
                rounded-xl
                border
                border-white/10
                bg-[#111827]
                px-3
                py-2
                transition-all
                hover:border-cyan-500
              "
            >
              <div
                className="
                  flex
                  h-10
                  w-10
                  items-center
                  justify-center
                  rounded-full
                  bg-cyan-500
                  font-bold
                  text-black
                "
              >
                H
              </div>

              <div className="hidden text-left lg:block">
                <p className="text-sm font-semibold text-white">
                  Harshit
                </p>

                <p className="text-xs text-slate-400">
                  Administrator
                </p>
              </div>

              <ChevronDown
                size={18}
                className={`hidden lg:block text-slate-400 transition-transform duration-300 ${
                  profileOpen
                    ? "rotate-180"
                    : ""
                }`}
              />
            </button>

            <ProfileDropdown
              isOpen={profileOpen}
            />
          </div>
        </div>
      </div>
    </header>
  );
}