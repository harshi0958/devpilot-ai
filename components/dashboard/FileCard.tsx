"use client";

import Link from "next/link";
import { ArrowUpRight, Clock } from "lucide-react";

interface FileCardProps {
  name: string;
  type: string;
  updated: string;
}

export default function FileCard({
  name,
  type,
  updated,
}: FileCardProps) {
  return (
    <Link
      href="/files"
      className="group block"
    >
      <div
        className="
          flex
          items-center
          justify-between
          rounded-2xl
          border
          border-white/10
          bg-[#101827]
          p-4
          transition-all
          duration-300
          hover:border-cyan-500/30
          hover:bg-[#131d2d]
          hover:shadow-lg
          hover:shadow-cyan-500/10
        "
      >
        <div className="flex items-center gap-4">

          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-500/10 font-bold text-cyan-400">
            {type}
          </div>

          <div>
            <h3 className="font-semibold text-white group-hover:text-cyan-400 transition">
              {name}
            </h3>

            <div className="mt-1 flex items-center gap-2 text-sm text-slate-400">
              <Clock size={14} />
              {updated}
            </div>
          </div>

        </div>

        <ArrowUpRight
          size={18}
          className="text-slate-500 transition-all duration-300 group-hover:translate-x-1 group-hover:text-cyan-400"
        />
      </div>
    </Link>
  );
}