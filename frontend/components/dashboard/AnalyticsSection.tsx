"use client";

import AnalyticsCard from "./AnalyticsCard";

export default function AnalyticsSection() {
  return (
    <section className="mt-12">

      <div className="mb-8">

        <h2 className="text-3xl font-bold text-white">
          Analytics
        </h2>

        <p className="text-slate-400 mt-2">
          Overview of your AI workspace performance.
        </p>

      </div>

      <div className="grid gap-6 lg:grid-cols-3">

        <AnalyticsCard
          title="Project Progress"
          value="78%"
          change="+12%"
          color="text-emerald-400"
        />

        <AnalyticsCard
          title="AI Usage"
          value="64%"
          change="+8%"
          color="text-cyan-400"
        />

        <AnalyticsCard
          title="Deployment Success"
          value="92%"
          change="+4%"
          color="text-purple-400"
        />

      </div>

    </section>
  );
}