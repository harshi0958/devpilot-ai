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

const features = [
  {
    title: "Architect AI",
    description:
      "Designs scalable software architecture, workflows and technical decisions.",
    icon: BrainCircuit,
  },
  {
    title: "Frontend AI",
    description:
      "Generates beautiful React, Next.js and responsive user interfaces.",
    icon: Code2,
  },
  {
    title: "Backend AI",
    description:
      "Creates secure REST APIs, authentication and business logic.",
    icon: ServerCog,
  },
  {
    title: "Database AI",
    description:
      "Designs optimized database schemas, relationships and queries.",
    icon: Database,
  },
  {
    title: "Testing AI",
    description:
      "Automatically performs unit, integration and UI testing.",
    icon: ShieldCheck,
  },
  {
    title: "Deployment AI",
    description:
      "Builds production-ready applications and deploys them automatically.",
    icon: Rocket,
  },
];

export default function Features() {
  return (
    <section
      id="features"
      className="py-32"
    >
      <div className="mx-auto max-w-7xl px-6">

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mx-auto mb-16 max-w-3xl text-center"
        >
          <span className="rounded-full border border-cyan-500/20 bg-cyan-500/10 px-4 py-2 text-sm text-cyan-300">
            Why DevPilot AI
          </span>

          <h2 className="mt-6 text-5xl font-bold text-white">
            Your Complete AI Engineering Team
          </h2>

          <p className="mt-6 text-lg leading-8 text-slate-400">
            DevPilot AI replaces repetitive engineering tasks with autonomous
            AI agents that collaborate to design, develop, test and deploy
            software faster than traditional workflows.
          </p>
        </motion.div>

        <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">

          {features.map((feature, index) => {
            const Icon = feature.icon;

            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl transition-all duration-300 hover:-translate-y-3 hover:border-cyan-500/40 hover:bg-white/10"
              >
                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-500/10 text-cyan-400 transition group-hover:scale-110">
                  <Icon className="h-7 w-7" />
                </div>

                <h3 className="mb-3 text-2xl font-semibold text-white">
                  {feature.title}
                </h3>

                <p className="leading-7 text-slate-400">
                  {feature.description}
                </p>
              </motion.div>
            );
          })}

        </div>
      </div>
    </section>
  );
}