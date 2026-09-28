"use client";

import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import {
  FaGithub,
  FaLinkedin,
  FaDiscord,
  FaXTwitter,
} from "react-icons/fa6";

const productLinks = [
  { label: "Features", href: "/#features" },
  { label: "Agents", href: "/#agents" },
  { label: "Pricing", href: "/#pricing" },
  { label: "Roadmap", href: "/coming-soon?feature=Roadmap" },
];

const resourceLinks = [
  { label: "Docs", href: "/docs" },
  { label: "API", href: "/coming-soon?feature=API" },
  { label: "Blog", href: "/coming-soon?feature=Blog" },
  { label: "Community", href: "/coming-soon?feature=Community" },
];

const companyLinks = [
  { label: "About", href: "/coming-soon?feature=About" },
  { label: "Careers", href: "/coming-soon?feature=Careers" },
  { label: "Contact", href: "/contact" },
  { label: "Press", href: "/coming-soon?feature=Press" },
];

const legalLinks = [
  { label: "Privacy", href: "/coming-soon?feature=Privacy" },
  { label: "Terms", href: "/coming-soon?feature=Terms" },
  { label: "Cookies", href: "/coming-soon?feature=Cookies" },
  { label: "Licenses", href: "/coming-soon?feature=Licenses" },
];

const socialLinks = [
  {
    label: "GitHub",
    href: "https://github.com/harshi0958/devpilot-ai",
    icon: FaGithub,
  },
  {
    label: "X",
    href: "https://x.com",
    icon: FaXTwitter,
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com",
    icon: FaLinkedin,
  },
  {
    label: "Discord",
    href: "https://discord.com",
    icon: FaDiscord,
  },
];

export default function Footer() {
  return (
    <footer className="relative mt-32 overflow-hidden border-t border-white/10">

      {/* Background Glow */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(6,182,212,0.08),transparent_70%)]" />

      <div className="relative mx-auto max-w-7xl px-6 py-20">

        {/* TOP GRID */}
        <div className="grid gap-14 lg:grid-cols-[2fr_1fr_1fr_1fr_1fr]">

          {/* BRAND */}
          <div className="max-w-107.5">

            <Link
              href="/"
              className="flex items-center gap-4"
            >
              <img
                src="/branding/logo.png"
                alt="DevPilot AI"
                className="h-14 w-14 rounded-xl object-cover"
              />

              <div>
                <h2 className="text-3xl font-bold text-white">
                  DevPilot
                  <span className="text-cyan-400"> AI</span>
                </h2>

                <p className="text-sm text-slate-400">
                  Autonomous Software Engineer
                </p>
              </div>
            </Link>

            <p className="mt-8 leading-8 text-slate-400">
              DevPilot AI is an autonomous multi-agent software engineering
              platform that designs, develops, tests and deploys complete
              applications using specialized AI agents.
            </p>

            {/* Social Icons */}
            <div className="mt-8 flex gap-4">

              {socialLinks.map((social) => {
                const Icon = social.icon;

                return (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className="
                      flex
                      h-11
                      w-11
                      items-center
                      justify-center
                      rounded-xl
                      border
                      border-white/10
                      bg-white/5
                      transition-all
                      duration-300
                      hover:-translate-y-1
                      hover:scale-110
                      hover:border-cyan-500
                      hover:bg-cyan-500/10
                      hover:shadow-[0_0_20px_rgba(34,211,238,.25)]
                    "
                  >
                    <Icon size={18} />
                  </a>
                );
              })}

            </div>

          </div>

          {/* PRODUCT */}
          <div>

            <h3 className="mb-6 text-lg font-semibold text-white">
              Product
            </h3>

            <ul className="space-y-4">

              {productLinks.map((item) => (
                <li key={item.label}>

                  <Link
                    href={item.href}
                    className="
                      group
                      flex
                      items-center
                      gap-2
                      text-slate-400
                      transition-all
                      duration-300
                      hover:translate-x-1
                      hover:text-cyan-400
                    "
                  >
                    {item.label}

                    <ArrowRight
                      size={14}
                      className="
                        opacity-0
                        transition-all
                        duration-300
                        group-hover:opacity-100
                      "
                    />
                  </Link>

                </li>
              ))}

            </ul>

          </div>

          {/* RESOURCES */}
          <div>

            <h3 className="mb-6 text-lg font-semibold text-white">
              Resources
            </h3>

            <ul className="space-y-4">

              {resourceLinks.map((item) => (
                <li key={item.label}>

                  <Link
                    href={item.href}
                    className="
                      group
                      flex
                      items-center
                      gap-2
                      text-slate-400
                      transition-all
                      duration-300
                      hover:translate-x-1
                      hover:text-cyan-400
                    "
                  >
                    {item.label}

                    <ArrowRight
                      size={14}
                      className="
                        opacity-0
                        transition-all
                        duration-300
                        group-hover:opacity-100
                      "
                    />
                  </Link>

                </li>
              ))}

            </ul>

          </div>

          {/* COMPANY */}
          <div>

            <h3 className="mb-6 text-lg font-semibold text-white">
              Company
            </h3>

            <ul className="space-y-4">

              {companyLinks.map((item) => (
                <li key={item.label}>

                  <Link
                    href={item.href}
                    className="
                      group
                      flex
                      items-center
                      gap-2
                      text-slate-400
                      transition-all
                      duration-300
                      hover:translate-x-1
                      hover:text-cyan-400
                    "
                  >
                    {item.label}

                    <ArrowRight
                      size={14}
                      className="
                        opacity-0
                        transition-all
                        duration-300
                        group-hover:opacity-100
                      "
                    />
                  </Link>

                </li>
              ))}

            </ul>

          </div>

          {/* LEGAL */}
          <div>

            <h3 className="mb-6 text-lg font-semibold text-white">
              Legal
            </h3>

            <ul className="space-y-4">

              {legalLinks.map((item) => (
                <li key={item.label}>

                  <Link
                    href={item.href}
                    className="
                      group
                      flex
                      items-center
                      gap-2
                      text-slate-400
                      transition-all
                      duration-300
                      hover:translate-x-1
                      hover:text-cyan-400
                    "
                  >
                    {item.label}

                    <ArrowRight
                      size={14}
                      className="
                        opacity-0
                        transition-all
                        duration-300
                        group-hover:opacity-100
                      "
                    />
                  </Link>

                </li>
              ))}

            </ul>

          </div>

        </div>

        {/* DIVIDER */}
        <div className="my-14 border-t border-white/10" />

        {/* BOTTOM */}
        <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">

          {/* Left */}
          <div>

            <p className="text-slate-300">
              © 2026 DevPilot AI. All rights reserved.
            </p>

            <p className="mt-2 text-sm text-slate-500">
              Autonomous Multi-Agent Software Engineering Platform
            </p>

            <p className="mt-1 text-xs text-slate-600">
              Made with ❤️ in India
            </p>

          </div>

          {/* Right */}
          <div className="flex flex-wrap items-center gap-4">

            {/* Status */}
            <div className="flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-4 py-2">

              <div className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />

              <span className="text-sm text-emerald-400">
                All Systems Operational
              </span>

            </div>

            {/* Version */}
            <div
              className="
                rounded-full
                border
                border-cyan-500/30
                bg-cyan-500/10
                px-5
                py-2
                text-cyan-400
                transition-all
                duration-300
                hover:scale-105
                hover:bg-cyan-500
                hover:text-black
                hover:shadow-[0_0_25px_rgba(34,211,238,.35)]
              "
            >
              v1.0.0
            </div>

            {/* Launch App */}
            <Link
              href="/dashboard"
              className="
                rounded-full
                border
                border-cyan-500/30
                bg-cyan-500/10
                px-5
                py-2
                text-cyan-400
                transition-all
                duration-300
                hover:scale-105
                hover:bg-cyan-500
                hover:text-black
                hover:shadow-[0_0_30px_rgba(34,211,238,.35)]
              "
            >
              Launch App

              <ArrowUpRight
                size={16}
                className="ml-2 inline"
              />
            </Link>

          </div>

        </div>

      </div>
    </footer>
  );
}