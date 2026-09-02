"use client";
import IDEPreview from "./IDEPreview";
import { motion } from "framer-motion";
import {
  Brain,
  Code2,
  Database,
  ShieldCheck,
  Rocket,
  CheckCircle2,
} from "lucide-react";

const agents = [
  {
    icon: Brain,
    title: "Architect AI",
    status: "Planning System Architecture",
    progress: 100,
    color: "text-cyan-400",
  },
  {
    icon: Code2,
    title: "Frontend AI",
    status: "Generating React Components",
    progress: 86,
    color: "text-sky-400",
  },
  {
    icon: Database,
    title: "Backend AI",
    status: "Creating REST APIs",
    progress: 74,
    color: "text-blue-400",
  },
  {
    icon: ShieldCheck,
    title: "Testing AI",
    status: "Running Test Cases",
    progress: 58,
    color: "text-emerald-400",
  },
  {
    icon: Rocket,
    title: "Deployment AI",
    status: "Preparing Production Build",
    progress: 35,
    color: "text-violet-400",
  },
];

export default function AIControlCenter() {
  return (
    <section className="relative py-32">
      <div className="mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: .7 }}
          className="text-center mb-16"
        >
          <span className="rounded-full border border-cyan-500/30 bg-cyan-500/10 px-5 py-2 text-cyan-300">
            AI Control Center
          </span>

          <h2 className="mt-6 text-5xl font-bold text-white">
            Watch DevPilot AI
            <br />
            Build Your Software
          </h2>

          <p className="mx-auto mt-6 max-w-3xl text-lg text-slate-400">
            Multiple autonomous AI agents collaborate together in real-time to
            design, develop, test and deploy production-ready software.
          </p>
        </motion.div>

        <div className="rounded-3xl border border-white/10 bg-[#12182b]/80 backdrop-blur-xl p-8">

          <div className="flex items-center justify-between border-b border-white/10 pb-6">

            <div>

              <h3 className="text-2xl font-bold text-white">
                Live AI Execution
              </h3>

              <p className="text-slate-400">
                Autonomous Engineering Pipeline
              </p>

            </div>

            <div className="flex items-center gap-2 text-emerald-400">
              <span className="h-3 w-3 rounded-full bg-emerald-400 animate-pulse"></span>
              Running
            </div>

          </div>

          <div className="mt-8 space-y-5">

            {agents.map((agent, index) => {

              const Icon = agent.icon;

              return (

                <motion.div
                  key={agent.title}
                  initial={{ opacity: 0, x: -40 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{
                    delay: index * .15,
                    duration: .5,
                  }}
                  className="rounded-2xl border border-white/5 bg-[#1a2237] p-6"
                >

                  <div className="flex justify-between">

                    <div className="flex gap-4">

                      <div className="rounded-xl bg-cyan-500/10 p-3">

                        <Icon className={`h-7 w-7 ${agent.color}`} />

                      </div>

                      <div>

                        <h4 className="font-semibold text-xl text-white">
                          {agent.title}
                        </h4>

                        <p className="text-slate-400">
                          {agent.status}
                        </p>

                      </div>

                    </div>

                    <CheckCircle2 className="text-emerald-400" />

                  </div>

                  <div className="mt-5 h-2 overflow-hidden rounded-full bg-slate-700">

                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{
                        width: `${agent.progress}%`,
                      }}
                      transition={{
                        duration: 1.3,
                        delay: index * .2,
                      }}
                      className="h-full rounded-full bg-linear-to-r from-cyan-400 via-blue-500 to-violet-500"
                    />

                  </div>
                 <IDEPreview />
                </motion.div>

              );
            })}

          </div>

        </div>
      </div>
    </section>
  );
}