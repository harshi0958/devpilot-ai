"use client";

interface AnalyticsCardProps {
  title: string;
  value: string;
  change: string;
  color: string;
}

export default function AnalyticsCard({
  title,
  value,
  change,
  color,
}: AnalyticsCardProps) {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#101827] p-6 transition hover:border-cyan-500/30">

      <div className="flex items-center justify-between">

        <h3 className="text-slate-400 text-sm">
          {title}
        </h3>

        <span className={`text-xs font-semibold ${color}`}>
          {change}
        </span>

      </div>

      <h2 className="mt-4 text-4xl font-bold text-white">
        {value}
      </h2>

      {/* Fake Progress */}

      <div className="mt-6 h-2 rounded-full bg-white/10 overflow-hidden">

        <div
          className="h-full rounded-full bg-linear-to-r from-cyan-400 via-blue-500 to-purple-500"
          style={{ width: value }}
        />

      </div>

    </div>
  );
}