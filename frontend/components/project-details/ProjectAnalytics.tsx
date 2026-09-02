"use client";

import {
  BarChart3,
  CheckCircle2,
  Rocket,
  ShieldCheck,
} from "lucide-react";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

export default function ProjectAnalytics() {
  const data = [
  { day: "Mon", progress: 18 },
  { day: "Tue", progress: 32 },
  { day: "Wed", progress: 46 },
  { day: "Thu", progress: 58 },
  { day: "Fri", progress: 71 },
  { day: "Sat", progress: 86 },
  { day: "Sun", progress: 100 },
];

  return (
    <section className="mt-10">
      <div className="rounded-3xl border border-white/10 bg-[#111827] p-6">

        <div className="mb-8 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white">
              Project Analytics
            </h2>

            <p className="mt-1 text-slate-400">
              Weekly development insights
            </p>
          </div>

          <BarChart3
            className="text-cyan-400"
            size={26}
          />
        </div>

        <div className="grid gap-8 xl:grid-cols-[2fr_1fr]">

          {/* Weekly Progress */}

          <div className="rounded-2xl border border-white/10 bg-[#0F172A] p-6">

            <h3 className="mb-6 text-lg font-semibold text-white">
              Weekly Progress
            </h3>

            <div className="h-72">
  <ResponsiveContainer width="100%" height="100%">
    <AreaChart data={data}>
      <defs>
        <linearGradient id="colorProgress" x1="0" y1="0" x2="0" y2="1">
          <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.8} />
          <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.1} />
        </linearGradient>
      </defs>

      <CartesianGrid
        stroke="#1E293B"
        strokeDasharray="3 3"
      />

      <XAxis
        dataKey="day"
        stroke="#64748B"
      />

      <YAxis
        stroke="#64748B"
      />

      <Tooltip
        contentStyle={{
          background: "#0F172A",
          border: "1px solid #334155",
          borderRadius: "12px",
        }}
      />

      <Area
        type="monotone"
        dataKey="progress"
        stroke="#06b6d4"
        strokeWidth={3}
        fill="url(#colorProgress)"
      />
    </AreaChart>
  </ResponsiveContainer>
</div>

          </div>

          {/* KPI Cards */}

          <div className="grid gap-5">

            <div className="rounded-2xl border border-white/10 bg-[#0F172A] p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">
                    Code Coverage
                  </p>

                  <h3 className="mt-2 text-3xl font-bold text-white">
                    92%
                  </h3>
                </div>

                <ShieldCheck
                  className="text-emerald-400"
                  size={28}
                />
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-[#0F172A] p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">
                    Tasks Completed
                  </p>

                  <h3 className="mt-2 text-3xl font-bold text-white">
                    48
                  </h3>
                </div>

                <CheckCircle2
                  className="text-cyan-400"
                  size={28}
                />
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-[#0F172A] p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">
                    Deployments
                  </p>

                  <h3 className="mt-2 text-3xl font-bold text-white">
                    16
                  </h3>
                </div>

                <Rocket
                  className="text-purple-400"
                  size={28}
                />
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}