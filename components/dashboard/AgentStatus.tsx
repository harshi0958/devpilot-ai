"use client";

import {
  Boxes,
  Code2,
  Database,
  ShieldCheck,
  Rocket,
} from "lucide-react";

import AgentCard from "./AgentCard";

const agents = [
  {
    name: "Architect AI",
    description: "Designing scalable architecture",
    status: "Completed",
    progress: 100,
    color: "bg-emerald-500/10 text-emerald-400",
    icon: <Boxes size={22} />,
  },
  {
    name: "Frontend AI",
    description: "Building React UI",
    status: "Running",
    progress: 82,
    color: "bg-cyan-500/10 text-cyan-400",
    icon: <Code2 size={22} />,
  },
  {
    name: "Backend AI",
    description: "Generating APIs",
    status: "Running",
    progress: 61,
    color: "bg-cyan-500/10 text-cyan-400",
    icon: <Database size={22} />,
  },
  {
    name: "Testing AI",
    description: "Running automated tests",
    status: "Testing",
    progress: 43,
    color: "bg-yellow-500/10 text-yellow-400",
    icon: <ShieldCheck size={22} />,
  },
  {
    name: "Deployment AI",
    description: "Deploying production build",
    status: "Queued",
    progress: 18,
    color: "bg-purple-500/10 text-purple-400",
    icon: <Rocket size={22} />,
  },
];

export default function AgentStatus() {
  return (
    <section className="mt-12">

      <div className="mb-8 flex items-center justify-between">

        <div>

          <h2 className="text-2xl font-bold text-white">
            AI Agents
          </h2>

          <p className="mt-1 text-slate-400">
            Monitor your autonomous engineering team in real-time.
          </p>

        </div>

      </div>

      <div className="grid gap-6 lg:grid-cols-2">

        {agents.map((agent) => (
          <AgentCard
            key={agent.name}
            {...agent}
          />
        ))}

      </div>

    </section>
  );
}