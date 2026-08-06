"use client";

import {
  FileCode2,
  FileJson,
  FileText,
  FolderOpen,
} from "lucide-react";

const files = [
  {
    name: "ProjectHeader.tsx",
    type: "Component",
    updated: "2 min ago",
    icon: FileCode2,
    color: "text-cyan-400",
  },
  {
    name: "projects.ts",
    type: "Data",
    updated: "12 min ago",
    icon: FileJson,
    color: "text-yellow-400",
  },
  {
    name: "README.md",
    type: "Documentation",
    updated: "1 hour ago",
    icon: FileText,
    color: "text-emerald-400",
  },
  {
    name: "components/",
    type: "Folder",
    updated: "Today",
    icon: FolderOpen,
    color: "text-purple-400",
  },
];

export default function RecentFiles() {
  return (
    <section
      className="
        rounded-3xl
        border
        border-white/10
        bg-[#111827]
        p-6
      "
    >
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-bold text-white">
          Recent Files
        </h2>

        <span className="text-sm text-slate-500">
          Last Updated
        </span>
      </div>

      <div className="space-y-4">
        {files.map((file) => {
          const Icon = file.icon;

          return (
            <div
              key={file.name}
              className="
                flex
                items-center
                justify-between
                rounded-2xl
                border
                border-white/10
                bg-[#0F172A]
                p-4
                transition-all
                duration-300
                hover:border-cyan-500/30
                hover:bg-[#162033]
              "
            >
              <div className="flex items-center gap-4">
                <div
                  className="
                    flex
                    h-11
                    w-11
                    items-center
                    justify-center
                    rounded-xl
                    bg-white/5
                  "
                >
                  <Icon
                    size={20}
                    className={file.color}
                  />
                </div>

                <div>
                  <h3 className="font-medium text-white">
                    {file.name}
                  </h3>

                  <p className="text-sm text-slate-400">
                    {file.type}
                  </p>
                </div>
              </div>

              <span className="text-sm text-slate-500">
                {file.updated}
              </span>
            </div>
          );
        })}
      </div>
    </section>
  );
}