"use client";

import Link from "next/link";
import { BellOff } from "lucide-react";

export default function EmptyNotification() {
  return (
    <div className="rounded-3xl border border-white/10 bg-[#111827] py-24 text-center">

      <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-cyan-500/10">

        <BellOff
          size={38}
          className="text-cyan-400"
        />

      </div>

      <h2 className="text-2xl font-bold text-white">
        You're all caught up!
      </h2>

      <p className="mt-3 text-slate-400">
        There are no new notifications right now.
      </p>

      <Link
        href="/dashboard"
        className="mt-8 inline-flex rounded-xl bg-cyan-500 px-6 py-3 font-semibold text-black transition hover:bg-cyan-400"
      >
        Back to Dashboard
      </Link>

    </div>
  );
}