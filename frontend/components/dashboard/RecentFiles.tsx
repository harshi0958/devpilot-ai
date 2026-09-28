"use client";

import Link from "next/link";
import { FileCode2, ArrowRight } from "lucide-react";

export default function RecentFiles() {
  return (
    <section className="mt-12">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-white">
            Recent Files
          </h2>

          <p className="mt-2 text-slate-400">
            Project file management will appear here.
          </p>
        </div>

        <Link
          href="/files"
          className="rounded-xl border border-cyan-500/30 px-5 py-2 text-cyan-400 transition hover:bg-cyan-500 hover:text-black"
        >
          View All
        </Link>
      </div>

      <div className="flex min-h-45 flex-col items-center justify-center rounded-2xl border border-white/10 bg-[#0B1220] text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-cyan-500/10">
          <FileCode2
            size={28}
            className="text-cyan-400"
          />
        </div>

        <h3 className="mt-4 text-lg font-semibold text-white">
          No project files yet
        </h3>

        <p className="mt-2 max-w-md text-sm text-slate-500">
          Project files will appear here once file management
          is connected to the workspace.
        </p>

        <Link
          href="/files"
          className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-cyan-400 transition hover:text-cyan-300"
        >
          Open Files
          <ArrowRight size={16} />
        </Link>
      </div>
    </section>
  );
}