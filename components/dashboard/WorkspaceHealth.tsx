"use client";

import HealthStatusCard from "./HealthStatusCard";

export default function WorkspaceHealth() {
  return (
    <section className="mt-12">

      <div className="mb-8">

        <h2 className="text-3xl font-bold text-white">
          Workspace Health
        </h2>

        <p className="mt-2 text-slate-400">
          Monitor integrations and workspace resources.
        </p>

      </div>

      <div className="grid gap-6 lg:grid-cols-2">

        <div className="space-y-4">

          <HealthStatusCard
            title="OpenAI API"
            status="Connected"
            online
          />

          <HealthStatusCard
            title="GitHub"
            status="Repository Connected"
            online
          />

          <HealthStatusCard
            title="Supabase"
            status="Database Connected"
            online
          />

          <HealthStatusCard
            title="Vercel"
            status="Deployment Pending"
            online={false}
          />

        </div>

        <div className="rounded-2xl border border-white/10 bg-[#101827] p-6">

          <h3 className="text-xl font-semibold text-white">
            Resource Usage
          </h3>

          <div className="mt-8 space-y-6">

            <div>
              <div className="flex justify-between text-sm text-slate-400">
                <span>Storage</span>
                <span>72%</span>
              </div>

              <div className="mt-2 h-2 rounded-full bg-white/10">
                <div className="h-full w-[72%] rounded-full bg-cyan-400"></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-sm text-slate-400">
                <span>API Credits</span>
                <span>2400 / 5000</span>
              </div>

              <div className="mt-2 h-2 rounded-full bg-white/10">
                <div className="h-full w-[48%] rounded-full bg-purple-500"></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-sm text-slate-400">
                <span>Workspace Usage</span>
                <span>81%</span>
              </div>

              <div className="mt-2 h-2 rounded-full bg-white/10">
                <div className="h-full w-[81%] rounded-full bg-emerald-400"></div>
              </div>
            </div>

          </div>

        </div>

      </div>

    </section>
  );
}