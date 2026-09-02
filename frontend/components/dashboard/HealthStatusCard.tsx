"use client";

import { CheckCircle2, AlertCircle } from "lucide-react";

interface HealthStatusCardProps {
  title: string;
  status: string;
  online: boolean;
}

export default function HealthStatusCard({
  title,
  status,
  online,
}: HealthStatusCardProps) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-[#101827] p-4 hover:border-cyan-500/30 transition">

      <div>

        <h3 className="text-white font-semibold">
          {title}
        </h3>

        <p className="mt-1 text-sm text-slate-400">
          {status}
        </p>

      </div>

      {online ? (
        <CheckCircle2 className="text-emerald-400" size={22} />
      ) : (
        <AlertCircle className="text-yellow-400" size={22} />
      )}
    </div>
  );
}