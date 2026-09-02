"use client";

import { motion } from "framer-motion";
import {
  BrainCircuit,
  Code2,
  ServerCog,
  Database,
  ShieldCheck,
  Rocket,
} from "lucide-react";

const steps = [
  {
    icon: BrainCircuit,
    title: "Architect AI",
    description: "Analyzes your idea and creates scalable system architecture.",
  },
  {
    icon: Code2,
    title: "Frontend AI",
    description: "Builds responsive React & Next.js interfaces.",
  },
  {
    icon: ServerCog,
    title: "Backend AI",
    description: "Generates secure APIs and backend services.",
  },
  {
    icon: Database,
    title: "Database AI",
    description: "Designs optimized database schemas automatically.",
  },
  {
    icon: ShieldCheck,
    title: "Testing AI",
    description: "Runs unit, integration and UI testing.",
  },
  {
    icon: Rocket,
    title: "Deployment AI",
    description: "Deploys your project with one click.",
  },
];

export default function HowItWorks() {
  return (
    <section id="workflow" className="py-32">
      <div className="mx-auto max-w-5xl px-6">

        <div className="mb-20 text-center">

          <span className="rounded-full border border-cyan-500/20 bg-cyan-500/10 px-4 py-2 text-sm text-cyan-300">
            Workflow
          </span>

          <h2 className="mt-6 text-5xl font-bold text-white">
            How DevPilot AI Works
          </h2>

          <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-slate-400">
            Every AI agent specializes in one stage of software development
            and collaborates automatically to deliver production-ready
            applications.
          </p>

        </div>

        <div className="relative">

          {steps.map((step, index) => {
            const Icon = step.icon;

            return (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, x: -40 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="relative mb-12 flex items-start gap-6"
              >
                <div className="relative z-10 flex h-16 w-16 items-center justify-center rounded-2xl border border-cyan-500/30 bg-cyan-500/10">
                  <Icon className="h-8 w-8 text-cyan-400" />
                </div>

                <div className="flex-1 rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
                  <h3 className="text-2xl font-semibold text-white">
                    {step.title}
                  </h3>

                  <p className="mt-3 text-slate-400 leading-7">
                    {step.description}
                  </p>
                </div>

                {index < steps.length - 1 && (
                  <div className="absolute left-8 top-16 h-16 w-px bg-linear-to-b from-cyan-500 to-violet-500" />
                )}
              </motion.div>
            );
          })}

        </div>

      </div>
    </section>
  );
}