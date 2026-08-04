"use client";
import Link from "next/link";
import FileCard from "./FileCard";

const files = [
  {
    name: "LandingPage.tsx",
    type: "TSX",
    updated: "2 min ago",
  },
  {
    name: "Navbar.tsx",
    type: "TSX",
    updated: "10 min ago",
  },
  {
    name: "Dashboard.tsx",
    type: "TSX",
    updated: "25 min ago",
  },
  {
    name: "package.json",
    type: "JSON",
    updated: "1 hour ago",
  },
];

export default function RecentFiles() {
  return (
    <section className="mt-12">

      <div className="mb-6 flex items-center justify-between">

        <div>

          <h2 className="text-3xl font-bold text-white">
            Recent Files
          </h2>

          <p className="mt-2 text-slate-400">
            Continue editing your latest files.
          </p>

        </div>

        <Link
  href="/files"
  className="rounded-xl border border-cyan-500/30 px-5 py-2 text-cyan-400 transition hover:bg-cyan-500 hover:text-black"
>
  View All
</Link>

      </div>

      <div className="grid gap-4">

        {files.map((file) => (
          <FileCard
            key={file.name}
            {...file}
          />
        ))}

      </div>

    </section>
  );
}