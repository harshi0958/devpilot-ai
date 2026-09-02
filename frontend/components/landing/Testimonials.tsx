"use client";

import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Alex Chen",
    role: "Founder • SaaS Startup",
    review:
      "DevPilot AI reduced our development time by nearly 70%. It feels like having a full engineering team available 24/7.",
  },
  {
    name: "Sarah Johnson",
    role: "Product Manager",
    review:
      "The AI agents collaborate incredibly well. Architecture, frontend and backend were generated within minutes.",
  },
  {
    name: "David Kumar",
    role: "CTO • Tech Company",
    review:
      "One of the most impressive AI development platforms I've used. Beautiful UI and extremely productive workflow.",
  },
];

export default function Testimonials() {
  return (
    <section className="py-32">

      <div className="max-w-7xl mx-auto px-6">

        <div className="text-center mb-20">

          <span className="px-5 py-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-cyan-400">
            Testimonials
          </span>

          <h2 className="text-5xl font-bold mt-6">
            Loved by Modern Engineering Teams
          </h2>

          <p className="text-zinc-400 mt-5 max-w-3xl mx-auto">
            Thousands of developers and startups trust DevPilot AI to build
            software faster than ever before.
          </p>

        </div>

        <div className="grid lg:grid-cols-3 gap-8">

          {testimonials.map((item) => (

            <div
              key={item.name}
              className="rounded-3xl border border-white/10 bg-[#171d30] p-8 hover:border-cyan-500/40 transition-all duration-300 hover:-translate-y-2"
            >

              <div className="flex mb-6">

                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-5 h-5 fill-yellow-400 text-yellow-400"
                  />
                ))}

              </div>

              <p className="text-zinc-300 leading-8">
                "{item.review}"
              </p>

              <div className="mt-8">

                <h4 className="font-semibold text-lg">
                  {item.name}
                </h4>

                <p className="text-zinc-500">
                  {item.role}
                </p>

              </div>

            </div>

          ))}

        </div>

      </div>

    </section>
  );
}