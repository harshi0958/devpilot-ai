"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

interface QuickActionCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  href: string;
}

export default function QuickActionCard({
  icon,
  title,
  description,
  href,
}: QuickActionCardProps) {
  return (
    <Link href={href} className="block">
      <div
        className="
          group
          relative
          w-full
          overflow-hidden
          rounded-2xl
          border
          border-white/10
          bg-[#101827]
          p-5
          text-left
          transition-all
          duration-300
          hover:-translate-y-1
          hover:border-cyan-500/30
          hover:bg-[#121d2e]
          hover:shadow-[0_12px_35px_rgba(6,182,212,0.08)]
        "
      >
        {/* Subtle hover glow */}
        <div
          className="
            pointer-events-none
            absolute
            -right-10
            -top-10
            h-24
            w-24
            rounded-full
            bg-cyan-500/10
            blur-2xl
            opacity-0
            transition-opacity
            duration-300
            group-hover:opacity-100
          "
        />

        <div className="relative flex items-center justify-between gap-4">
          {/* Left content */}
          <div className="flex min-w-0 items-center gap-4">
            <div
              className="
                flex
                h-12
                w-12
                shrink-0
                items-center
                justify-center
                rounded-xl
                border
                border-cyan-500/10
                bg-cyan-500/10
                text-cyan-400
                transition-all
                duration-300
                group-hover:border-cyan-500/20
                group-hover:bg-cyan-500/15
                group-hover:scale-105
              "
            >
              {icon}
            </div>

            <div className="min-w-0">
              <h3
                className="
                  font-semibold
                  text-white
                  transition-colors
                  duration-300
                  group-hover:text-cyan-400
                "
              >
                {title}
              </h3>

              <p className="mt-1 text-sm leading-5 text-slate-400">
                {description}
              </p>
            </div>
          </div>

          {/* Arrow */}
          <div
            className="
              flex
              h-9
              w-9
              shrink-0
              items-center
              justify-center
              rounded-lg
              border
              border-white/5
              bg-white/[0.02]
              transition-all
              duration-300
              group-hover:border-cyan-500/20
              group-hover:bg-cyan-500/10
            "
          >
            <ArrowUpRight
              size={17}
              className="
                text-slate-500
                transition-all
                duration-300
                group-hover:translate-x-0.5
                group-hover:-translate-y-0.5
                group-hover:text-cyan-400
              "
            />
          </div>
        </div>
      </div>
    </Link>
  );
}