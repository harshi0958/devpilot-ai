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
          w-full
          rounded-2xl
          border
          border-white/10
          bg-[#101827]
          p-5
          text-left
          transition-all
          duration-300
          hover:border-cyan-500/40
          hover:bg-[#131d2d]
          hover:shadow-lg
          hover:shadow-cyan-500/10
          hover:-translate-y-1
          cursor-pointer
        "
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400">
              {icon}
            </div>

            <div>
              <h3 className="font-semibold text-white transition group-hover:text-cyan-400">
                {title}
              </h3>

              <p className="mt-1 text-sm text-slate-400">
                {description}
              </p>
            </div>
          </div>

          <ArrowUpRight
            size={18}
            className="text-slate-500 transition-all duration-300 group-hover:text-cyan-400 group-hover:translate-x-1"
          />
        </div>
      </div>
    </Link>
  );
}