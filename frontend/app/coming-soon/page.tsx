"use client";

import Link from "next/link";
import { ArrowLeft, Sparkles } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function ComingSoonContent() {
  const searchParams = useSearchParams();
  const feature = searchParams.get("feature") || "This feature";

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#070B14] px-6 text-white">

      <div className="w-full max-w-2xl rounded-3xl border border-white/10 bg-[#0B1220] p-12 text-center">

        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-cyan-500/10">
          <Sparkles
            size={30}
            className="text-cyan-400"
          />
        </div>

        <h1 className="mt-8 text-4xl font-bold">
          {feature}
        </h1>

        <p className="mt-4 text-lg text-slate-400">
          This section is part of the DevPilot AI roadmap
          and will be available in a future release.
        </p>

        <Link
          href="/"
          className="mt-8 inline-flex items-center gap-2 rounded-xl bg-cyan-500 px-6 py-3 font-semibold text-black transition hover:bg-cyan-400"
        >
          <ArrowLeft size={18} />
          Back to Home
        </Link>

      </div>

    </main>
  );
}

export default function ComingSoonPage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center bg-[#070B14] text-white">
          Loading...
        </main>
      }
    >
      <ComingSoonContent />
    </Suspense>
  );
}