"use client";

import { useEffect, useRef, useState } from "react";
import {
  Bell,
  ChevronDown,
  Moon,
  Sun,
  Search,
  Settings,
} from "lucide-react";

import { useTheme } from "@/components/common/ThemeProvider";

import ProfileDropdown from "./ProfileDropdown";
import NotificationDropdown from "./NotificationDropdown";
export default function TopNavbar() {
  const { theme, toggleTheme } = useTheme();
  const [notifications, setNotifications] = useState([
  {
    title: "Frontend AI completed Navbar.tsx",
    time: "2 min ago",
  },
  {
    title: "Backend AI generated Authentication API",
    time: "7 min ago",
  },
  {
    title: "Testing AI executed 128 test cases",
    time: "24 min ago",
  },
  {
    title: "Deployment queued",
    time: "1 hour ago",
  },
]);
const handleMarkAll = () => {
  setNotifications([]);
  setNotificationOpen(false);
};

const notificationCount = notifications.length;

const [notificationOpen, setNotificationOpen] = useState(false);

  const [profileOpen, setProfileOpen] = useState(false);

  const profileRef = useRef<HTMLDivElement>(null);
const notificationRef = useRef<HTMLDivElement>(null);
  // Close on outside click
  useEffect(() => {
  function handleClickOutside(event: MouseEvent) {
    if (
      profileRef.current &&
      !profileRef.current.contains(event.target as Node)
    ) {
      setProfileOpen(false);
    }

    if (
      notificationRef.current &&
      !notificationRef.current.contains(event.target as Node)
    ) {
      setNotificationOpen(false);
    }
  }

  document.addEventListener("mousedown", handleClickOutside);

  return () =>
    document.removeEventListener(
      "mousedown",
      handleClickOutside
    );
}, []);

  // Close on Escape
  useEffect(() => {
  function handleEscape(event: KeyboardEvent) {
    if (event.key === "Escape") {
      setProfileOpen(false);
      setNotificationOpen(false);
    }
  }

  document.addEventListener("keydown", handleEscape);

  return () => {
    document.removeEventListener("keydown", handleEscape);
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

          <div
  className="relative"
  ref={notificationRef}
>
  <button
    onClick={() =>
      setNotificationOpen(!notificationOpen)
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
  >
    <Bell size={18} className="text-white" />

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
  onClick={toggleTheme}
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
          <button
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
            <Settings size={18} className="text-white" />
          </button>

          {/* Profile */}
          <div className="relative" ref={profileRef}>

            <button
              onClick={() => setProfileOpen(!profileOpen)}
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
                  profileOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            <ProfileDropdown isOpen={profileOpen} />

          </div>

        </div>

      </div>
    </header>
  );
}