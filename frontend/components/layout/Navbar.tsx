"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function Navbar() {
  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="fixed inset-x-0 top-0 z-50"
    >
      <div className="mx-auto max-w-7xl px-6 pt-5">
        <div className="flex h-16 items-center justify-between rounded-2xl border border-white/10 bg-slate-900/60 px-6 backdrop-blur-xl">

          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-4"
          >
            {/* <Image
              src="/branding/logo.png"
              alt="DevPilot AI"
              width={54}
              height={54}
              priority
              className="h-14 w-14 object-contain transition-transform duration-300 hover:scale-105"
            /> */}

            <div className="leading-none">
              <h1 className="text-2xl font-extrabold tracking-tight text-white">
                DevPilot
                <span className="bg-linear-to-r from-cyan-400 to-violet-500 bg-clip-text text-transparent">
                  {" "}AI
                </span>
              </h1>

              <p className="mt-1 text-xs text-slate-400">
                Autonomous Software Engineer
              </p>
            </div>
          </Link>

          {/* Navigation */}
          <nav className="hidden items-center gap-8 md:flex">

            <Link
              href="/#features"
              className="text-sm text-slate-300 transition hover:text-cyan-400"
            >
              Features
            </Link>

            <Link
              href="/#agents"
              className="text-sm text-slate-300 transition hover:text-cyan-400"
            >
              Agents
            </Link>

            <Link
              href="/#pricing"
              className="text-sm text-slate-300 transition hover:text-cyan-400"
            >
              Pricing
            </Link>

            <Link
              href="/docs"
              className="text-sm text-slate-300 transition hover:text-cyan-400"
            >
              Docs
            </Link>

            <Link
              href="https://github.com/harshi0958/devpilot-ai"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-slate-300 transition hover:text-cyan-400"
            >
              GitHub
            </Link>

          </nav>

          {/* Right Side */}
          <div className="hidden items-center gap-3 md:flex">

            <Link href="/login">
              <Button
                variant="ghost"
                className="text-slate-300 hover:text-white"
              >
                Login
              </Button>
            </Link>

            <Link href="/register">
              <Button className="rounded-xl bg-cyan-500 text-black hover:bg-cyan-400">
                Get Started

                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>

          </div>

        </div>
      </div>
    </motion.header>
  );
}