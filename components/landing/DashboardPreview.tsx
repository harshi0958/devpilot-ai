"use client";

import { motion } from "framer-motion";
import {
  Blocks,
  Database,
  Rocket,
  ShieldCheck,
  MonitorSmartphone,
  PencilRuler,
} from "lucide-react";

import AgentStatusCard from "./AgentStatusCard";
import ProgressBar from "./ProgressBar";

const agents = [
  {
    title: "Architect Agent",
    status: "System Design Completed",
    icon: <PencilRuler className="h-6 w-6 text-cyan-400" />,
    color: "bg-green-500",
  },
  {
    title: "Frontend Agent",
    status: "Generating Responsive UI",
    icon: <MonitorSmartphone className="h-6 w-6 text-cyan-400" />,
    color: "bg-cyan-500",
  },
  {
    title: "Backend Agent",
    status: "Creating REST APIs",
    icon: <Blocks className="h-6 w-6 text-cyan-400" />,
    color: "bg-cyan-500",
  },
  {
    title: "Database Agent",
    status: "Schema Ready",
    icon: <Database className="h-6 w-6 text-cyan-400" />,
    color: "bg-green-500",
  },
  {
    title: "Testing Agent",
    status: "Waiting for Build",
    icon: <ShieldCheck className="h-6 w-6 text-cyan-400" />,
    color: "bg-yellow-500",
  },
  {
    title: "Deployment Agent",
    status: "Queued",
    icon: <Rocket className="h-6 w-6 text-cyan-400" />,
    color: "bg-yellow-500",
  },
];

export default function DashboardPreview() {
  return (
    <section className="relative mx-auto mt-20 max-w-6xl px-6">

      <motion.div
        initial={{ opacity: 0, y: 60 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="overflow-hidden rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl"
      >

        {/* Header */}

        <div className="flex items-center justify-between border-b border-white/10 px-8 py-6">

          <div>

            <h2 className="text-2xl font-bold text-white">
              DevPilot AI
            </h2>

            <p className="text-sm text-zinc-400">
              Multi-Agent Development Dashboard
            </p>

          </div>

          <div className="flex items-center gap-2">

            <div className="h-3 w-3 rounded-full bg-green-500 animate-pulse" />

            <span className="text-sm text-green-400">
              Connected
            </span>

          </div>

        </div>

        {/* Agents */}

        <div className="grid gap-5 p-8 md:grid-cols-2">

          {agents.map((agent, index) => (
            <motion.div
              key={agent.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{
                delay: index * 0.1,
              }}
              viewport={{ once: true }}
            >
              <AgentStatusCard
                title={agent.title}
                status={agent.status}
                icon={agent.icon}
                color={agent.color}
              />
            </motion.div>
          ))}

        </div>

        {/* Footer */}

        <div className="border-t border-white/10 px-8 py-6">

          <ProgressBar value={72} />

        </div>

      </motion.div>

    </section>
  );
}