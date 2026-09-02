"use client";

import { motion } from "framer-motion";
import LiveCodePreview from "./LiveCodePreview";
import {
  Bot,
  Database,
  Code2,
  Rocket,
  ShieldCheck,
  Cpu,
} from "lucide-react";

const agents = [
  {
    icon: <Bot className="h-5 w-5 text-cyan-400" />,
    title: "Architect AI",
    status: "Completed",
    color: "bg-green-500",
  },
  {
    icon: <Code2 className="h-5 w-5 text-cyan-400" />,
    title: "Frontend",
    status: "Building UI...",
    color: "bg-cyan-500",
  },
  {
    icon: <Cpu className="h-5 w-5 text-cyan-400" />,
    title: "Backend",
    status: "Generating APIs...",
    color: "bg-cyan-500",
  },
  {
    icon: <Database className="h-5 w-5 text-cyan-400" />,
    title: "Database",
    status: "Schema Ready",
    color: "bg-green-500",
  },
  {
    icon: <ShieldCheck className="h-5 w-5 text-cyan-400" />,
    title: "Testing",
    status: "Running...",
    color: "bg-yellow-500",
  },
  {
    icon: <Rocket className="h-5 w-5 text-cyan-400" />,
    title: "Deployment",
    status: "Queued",
    color: "bg-yellow-500",
  },
];

export default function HeroVisual() {
  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8 }}
      className="relative"
    >
      <div className="rounded-3xl border border-white/10 bg-slate-900/60 p-6 backdrop-blur-xl shadow-2xl">

        <div className="mb-6 flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-white">
              AI Workflow
            </h3>

            <p className="text-sm text-slate-400">
              Live Multi-Agent Execution
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-green-500 animate-pulse" />
            <span className="text-sm text-green-400">
              Online
            </span>
          </div>
        </div>

        <div className="space-y-4">

          {agents.map((agent) => (
            <div
              key={agent.title}
              className="flex items-center justify-between rounded-xl bg-white/5 p-4 transition hover:bg-white/10"
            >
              <div className="flex items-center gap-4">
                {agent.icon}

                <div>
                  <h4 className="font-medium text-white">
                    {agent.title}
                  </h4>

                  <p className="text-sm text-slate-400">
                    {agent.status}
                  </p>
                </div>
              </div>

              <span
                className={`h-3 w-3 rounded-full ${agent.color} animate-pulse`}
              />
            </div>
          ))}

        </div>

      </div>
       <LiveCodePreview />
    
    </motion.div>
    
  );
}