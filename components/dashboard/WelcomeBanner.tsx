"use client";

import { ArrowRight, Sparkles } from "lucide-react";

export default function WelcomeBanner() {
  return (
    <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-linear-to-r from-cyan-500/10 via-slate-900 to-slate-950 p-8">

      {/* Background Glow */}
      <div className="absolute -top-20 -right-20 h-60 w-60 rounded-full bg-cyan-500/10 blur-3xl" />

      <div className="relative flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">

        {/* Left Content */}
        <div>

          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-cyan-500/20 bg-cyan-500/10 px-4 py-2 text-sm text-cyan-400">
            <Sparkles size={16} />
            AI Workspace Ready
          </div>

          <h1 className="text-4xl font-bold text-white">
            Welcome back,
            <span className="text-cyan-400"> Harshit 👋</span>
          </h1>

          <p className="mt-4 max-w-2xl text-slate-400">
            Manage your AI agents, monitor projects, generate code,
            deploy applications and collaborate with your autonomous
            development team from one intelligent dashboard.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">

            <button className="rounded-xl bg-cyan-500 px-6 py-3 font-semibold text-black transition hover:scale-105 hover:bg-cyan-400">
              Launch Workspace
            </button>

            <button className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-6 py-3 text-white transition hover:border-cyan-500 hover:bg-cyan-500/10">
              View Projects
              <ArrowRight size={18} />
            </button>

          </div>

        </div>

        {/* Right Card */}
        <div className="w-full max-w-sm rounded-2xl border border-white/10 bg-black/30 p-6 backdrop-blur-xl">

          <p className="text-sm text-slate-400">
            Workspace Status
          </p>

          <div className="mt-6 space-y-5">

            <div className="flex items-center justify-between">
              <span className="text-slate-300">
                AI Agents
              </span>

              <span className="font-semibold text-green-400">
                7 Active
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-slate-300">
                Running Projects
              </span>

              <span className="font-semibold text-cyan-400">
                3
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-slate-300">
                Tasks Completed
              </span>

              <span className="font-semibold text-white">
                128
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-slate-300">
                Deployment
              </span>

              <span className="font-semibold text-emerald-400">
                Healthy
              </span>
            </div>

          </div>

        </div>

      </div>

    </section>
  );
}