"use client";

import {
  CheckCircle2,
  Clock3,
  Globe,
  Server,
} from "lucide-react";

interface DeploymentStatusProps {
  deployment: string;
}

export default function DeploymentStatus({
  deployment,
}: DeploymentStatusProps) {
  return (
    <section className="mt-10">
      <div className="rounded-3xl border border-white/10 bg-[#111827] p-6">

        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white">
              Deployment Status
            </h2>

            <p className="mt-1 text-slate-400">
              Production environment information
            </p>
          </div>

          <span className="rounded-full bg-emerald-500/15 px-4 py-2 text-sm font-semibold text-emerald-400">
            ● Healthy
          </span>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">

          <div className="rounded-2xl border border-white/10 bg-[#0F172A] p-5">
            <div className="mb-3 flex items-center gap-3">
              <Globe className="text-cyan-400" size={22} />
              <span className="text-slate-400">
                Environment
              </span>
            </div>

            <p className="text-xl font-bold text-white">
              Production
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-[#0F172A] p-5">
            <div className="mb-3 flex items-center gap-3">
              <Clock3 className="text-yellow-400" size={22} />
              <span className="text-slate-400">
                Last Deploy
              </span>
            </div>

            <p className="text-xl font-bold text-white">
              2 mins ago
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-[#0F172A] p-5">
            <div className="mb-3 flex items-center gap-3">
              <Server className="text-purple-400" size={22} />
              <span className="text-slate-400">
                Region
              </span>
            </div>

            <p className="text-xl font-bold text-white">
              Mumbai
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-[#0F172A] p-5">
            <div className="mb-3 flex items-center gap-3">
              <CheckCircle2
                className="text-emerald-400"
                size={22}
              />
              <span className="text-slate-400">
                Status
              </span>
            </div>

            <p className="text-xl font-bold text-emerald-400">
              Live
            </p>
          </div>

        </div>

        {deployment && (
          <div className="mt-8 rounded-2xl border border-cyan-500/20 bg-cyan-500/5 p-5">
            <p className="text-sm text-slate-400">
              Deployment URL
            </p>

            <a
              href={deployment}
              target="_blank"
              className="mt-2 block break-all text-lg font-semibold text-cyan-400 hover:underline"
            >
              {deployment}
            </a>
          </div>
        )}

      </div>
    </section>
  );
}