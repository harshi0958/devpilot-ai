"use client";

import {
  Crown,
  Bot,
  Code2,
  Rocket,
  Circle,
} from "lucide-react";

const members = [
  {
    name: "Harshit",
    role: "Project Owner",
    contribution: 98,
    status: "Online",
    icon: Crown,
    color: "text-yellow-400",
  },
  {
    name: "Athena AI",
    role: "Backend Engineer",
    contribution: 92,
    status: "Running",
    icon: Bot,
    color: "text-cyan-400",
  },
  {
    name: "Nova AI",
    role: "UI Designer",
    contribution: 81,
    status: "Building",
    icon: Code2,
    color: "text-purple-400",
  },
  {
    name: "DeployBot",
    role: "DevOps",
    contribution: 74,
    status: "Idle",
    icon: Rocket,
    color: "text-emerald-400",
  },
];

export default function TeamMembers() {
  return (
    <section className="mt-10">
      <div className="rounded-3xl border border-white/10 bg-[#111827] p-6">

        <div className="mb-8 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white">
              Team Members
            </h2>

            <p className="mt-1 text-slate-400">
              Active contributors
            </p>
          </div>

          <button className="rounded-xl border border-cyan-500/30 px-4 py-2 text-cyan-400 transition hover:bg-cyan-500/10">
            View All
          </button>
        </div>

        <div className="space-y-4">
          {members.map((member) => {
            const Icon = member.icon;

            return (
              <div
                key={member.name}
                className="rounded-2xl border border-white/10 bg-[#0F172A] p-5 transition hover:border-cyan-500/30 hover:bg-[#101B30]"
              >
                <div className="flex items-center justify-between">

                  <div className="flex items-center gap-4">

                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-500/10">
                      <Icon
                        size={24}
                        className={member.color}
                      />
                    </div>

                    <div>
                      <h3 className="font-semibold text-white">
                        {member.name}
                      </h3>

                      <p className="text-sm text-slate-400">
                        {member.role}
                      </p>
                    </div>

                  </div>

                  <div className="text-right">

                    <div className="mb-2 flex items-center justify-end gap-2">

                      <Circle
                        size={10}
                        fill="#10B981"
                        className="text-emerald-400"
                      />

                      <span className="text-sm text-slate-300">
                        {member.status}
                      </span>

                    </div>

                    <span className="font-semibold text-cyan-400">
                      {member.contribution}%
                    </span>

                  </div>

                </div>

                <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/10">

                  <div
                    style={{
                      width: `${member.contribution}%`,
                    }}
                    className="h-full rounded-full bg-linear-to-r from-cyan-400 via-blue-500 to-purple-500"
                  />

                </div>

              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}