"use client";

import ActivityItem from "./ActivityItem";

const activities = [
  {
    title: "Frontend AI",
    description: "Completed Navbar.tsx",
    time: "2 min ago",
    color: "bg-cyan-400",
  },
  {
    title: "Backend AI",
    description: "Generated Authentication API",
    time: "7 min ago",
    color: "bg-emerald-400",
  },
  {
    title: "Architect AI",
    description: "Created Database Schema",
    time: "15 min ago",
    color: "bg-purple-400",
  },
  {
    title: "Testing AI",
    description: "Executed 128 Test Cases",
    time: "24 min ago",
    color: "bg-yellow-400",
  },
  {
    title: "Deployment AI",
    description: "Queued Production Build",
    time: "1 hour ago",
    color: "bg-pink-400",
  },
];

export default function ActivityTimeline() {
  return (
    <section className="mt-12">

      <div className="mb-8">

        <h2 className="text-2xl font-bold text-white">
          Recent Activity
        </h2>

        <p className="mt-1 text-slate-400">
          Live updates from your AI engineering team.
        </p>

      </div>

      <div className="space-y-6">

        {activities.map((activity) => (
          <ActivityItem
            key={activity.title + activity.time}
            {...activity}
          />
        ))}

      </div>

    </section>
  );
}