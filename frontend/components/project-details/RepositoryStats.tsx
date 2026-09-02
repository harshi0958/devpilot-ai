"use client";

import {
  Star,
  GitFork,
  Bug,
  GitBranch,
  Clock3,
  Code2,
} from "lucide-react";

interface RepositoryStatsProps {
  github: string;
}

const stats = [
  {
    title: "Stars",
    value: "148",
    icon: Star,
    color: "text-yellow-400",
  },
  {
    title: "Forks",
    value: "32",
    icon: GitFork,
    color: "text-cyan-400",
  },
  {
    title: "Open Issues",
    value: "5",
    icon: Bug,
    color: "text-red-400",
  },
  {
    title: "Branch",
    value: "main",
    icon: GitBranch,
    color: "text-purple-400",
  },
  {
    title: "Last Commit",
    value: "2 min ago",
    icon: Clock3,
    color: "text-emerald-400",
  },
  {
    title: "Language",
    value: "TypeScript",
    icon: Code2,
    color: "text-blue-400",
  },
];

export default function RepositoryStats({
  github,
}: RepositoryStatsProps) {
  return (
    <section className="mt-10">
      <div className="rounded-3xl border border-white/10 bg-[#111827] p-6">

        <div className="mb-8 flex items-center justify-between">

          <div>
            <h2 className="text-2xl font-bold text-white">
              Repository Stats
            </h2>

            <p className="mt-1 text-slate-400">
              GitHub repository overview
            </p>
          </div>

          {github && (
            <a
              href={github}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-xl border border-cyan-500/30 px-4 py-2 text-cyan-400 transition hover:bg-cyan-500/10"
            >
              Open Repository
            </a>
          )}

        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">

          {stats.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.title}
                className="
                  rounded-2xl
                  border
                  border-white/10
                  bg-[#0F172A]
                  p-5
                  transition-all
                  duration-300
                  hover:border-cyan-500/30
                "
              >
                <div className="flex items-center justify-between">

                  <div>

                    <p className="text-sm text-slate-400">
                      {item.title}
                    </p>

                    <h3 className="mt-2 text-2xl font-bold text-white">
                      {item.value}
                    </h3>

                  </div>

                  <div
                    className={`
                      rounded-xl
                      bg-[#162133]
                      p-3
                      ${item.color}
                    `}
                  >
                    <Icon size={22} />
                  </div>

                </div>
              </div>
            );
          })}

        </div>

      </div>
    </section>
  );
}