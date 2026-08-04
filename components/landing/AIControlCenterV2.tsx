"use client";

import {
  BrainCircuit,
  Code2,
  Database,
  ShieldCheck,
  Rocket,
  CheckCircle2,
} from "lucide-react";

const agents = [
  {
    icon: BrainCircuit,
    name: "Architect AI",
    desc: "Planning scalable architecture",
    progress: 100,
  },
  {
    icon: Code2,
    name: "Frontend AI",
    desc: "Generating React Components",
    progress: 86,
  },
  {
    icon: Database,
    name: "Backend AI",
    desc: "Creating REST APIs",
    progress: 72,
  },
  {
    icon: ShieldCheck,
    name: "Testing AI",
    desc: "Running Test Cases",
    progress: 48,
  },
  {
    icon: Rocket,
    name: "Deployment AI",
    desc: "Preparing Production Build",
    progress: 22,
  },
];

const files = [
  "Navbar.tsx",
  "Hero.tsx",
  "Dashboard.tsx",
  "AuthService.ts",
  "Dockerfile",
  "README.md",
];

export default function AIControlCenterV2() {
  return (
    <section className="py-32">

      <div className="max-w-7xl mx-auto px-6">

        <div className="text-center mb-14">

          <span className="px-5 py-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-cyan-400 text-sm">
            AI Control Center
          </span>

          <h2 className="text-5xl font-bold mt-6">
            Watch DevPilot AI Build Software
          </h2>

          <p className="text-zinc-400 mt-5 max-w-3xl mx-auto">
            Multiple autonomous AI agents collaborate together in real-time to
            design, develop, test and deploy production-ready software.
          </p>

        </div>

        <div className="grid lg:grid-cols-2 gap-10">

          {/* LEFT */}

          <div className="space-y-5">

            {agents.map((agent) => {
              const Icon = agent.icon;

              return (

                <div
                  key={agent.name}
                  className="rounded-3xl border border-white/10 bg-[#1a2033] p-6"
                >

                  <div className="flex justify-between items-center">

                    <div className="flex gap-4">

                      <div className="w-12 h-12 rounded-xl bg-cyan-500/10 flex items-center justify-center">

                        <Icon className="text-cyan-400 w-6 h-6" />

                      </div>

                      <div>

                        <h3 className="font-semibold text-lg">
                          {agent.name}
                        </h3>

                        <p className="text-zinc-400 text-sm">
                          {agent.desc}
                        </p>

                      </div>

                    </div>

                    <CheckCircle2 className="text-emerald-400" />

                  </div>

                  <div className="mt-6 h-2 rounded-full bg-white/10 overflow-hidden">

                    <div
                      className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-blue-500 to-violet-500"
                      style={{
                        width: `${agent.progress}%`,
                      }}
                    />

                  </div>

                </div>

              );
            })}

          </div>

          {/* RIGHT */}

          <div className="rounded-3xl border border-white/10 bg-[#151b2d] overflow-hidden">

            <div className="flex justify-between items-center px-6 py-4 border-b border-white/10">

              <div className="flex gap-2">

                <div className="w-3 h-3 rounded-full bg-red-500" />
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <div className="w-3 h-3 rounded-full bg-green-500" />

              </div>

              <span className="text-sm text-zinc-400">
                DevPilot IDE
              </span>

              <span className="text-emerald-400 text-sm">
                ● LIVE
              </span>

            </div>

            <div className="grid grid-cols-3">

              <div className="border-r border-white/10 p-5">

                <p className="text-cyan-400 mb-5 text-sm">
                  SRC
                </p>

                <div className="space-y-3 text-sm text-zinc-400">

                  {files.map((file) => (

                    <div key={file}>
                      {file}
                    </div>

                  ))}

                </div>

              </div>

              <div className="col-span-2 p-5">

                <p className="text-cyan-400 mb-5">
                  Generating project...
                </p>

                <div className="space-y-4">

                  {files.map((file, index) => (

                    <div
                      key={index}
                      className="flex justify-between rounded-lg bg-white/5 px-4 py-3"
                    >

                      <span>{file}</span>

                      <CheckCircle2
                        size={18}
                        className="text-emerald-400"
                      />

                    </div>

                  ))}

                </div>

                <div className="mt-8">

                  <div className="flex justify-between text-sm mb-2">

                    <span>AI Progress</span>

                    <span className="text-cyan-400">
                      92%
                    </span>

                  </div>

                  <div className="h-2 rounded-full bg-white/10 overflow-hidden">

                    <div className="w-[92%] h-full rounded-full bg-gradient-to-r from-cyan-400 via-blue-500 to-violet-500" />

                  </div>

                </div>

              </div>

            </div>

          </div>

        </div>

      </div>

    </section>
  );
}