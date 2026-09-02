"use client";

import { Check, Sparkles } from "lucide-react";

const plans = [
  {
    name: "Free",
    price: "₹0",
    period: "/month",
    description: "Perfect for learning and personal projects.",
    button: "Start Free",
    featured: false,
    features: [
      "5 AI Projects",
      "2 AI Agents",
      "Basic Templates",
      "Community Support",
      "1 GB Storage",
    ],
  },
  {
    name: "Pro",
    price: "₹999",
    period: "/month",
    description: "Best choice for professionals and startups.",
    button: "Upgrade to Pro",
    featured: true,
    features: [
      "Unlimited Projects",
      "All AI Agents",
      "GitHub Integration",
      "One-click Deployment",
      "Unlimited Storage",
      "Priority Support",
      "AI Code Review",
    ],
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    description: "For large engineering teams and organizations.",
    button: "Contact Sales",
    featured: false,
    features: [
      "Unlimited Everything",
      "Private AI Models",
      "Dedicated Workspace",
      "SSO Authentication",
      "API Access",
      "Premium Support",
      "Custom Integrations",
    ],
  },
];

export default function Pricing() {
  return (
    <section className="py-32">
      <div className="max-w-7xl mx-auto px-6">

        <div className="text-center mb-20">

          <span className="px-5 py-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-cyan-400">
            Pricing
          </span>

          <h2 className="text-5xl font-bold mt-6">
            Choose Your Perfect Plan
          </h2>

          <p className="text-zinc-400 mt-5 max-w-2xl mx-auto">
            Start free and upgrade whenever your projects grow.
          </p>

        </div>

        <div className="grid lg:grid-cols-3 gap-8">

          {plans.map((plan) => (

            <div
              key={plan.name}
              className={`relative rounded-3xl border p-8 transition-all duration-300 hover:-translate-y-2
              ${
                plan.featured
                  ? "border-cyan-500 bg-linear-to-b from-[#182542] to-[#121826] shadow-[0_0_50px_rgba(0,255,255,0.15)]"
                  : "border-white/10 bg-[#171d30]"
              }`}
            >

              {plan.featured && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">

                  <div className="flex items-center gap-2 rounded-full bg-cyan-500 px-4 py-2 text-sm font-semibold text-black">

                    <Sparkles size={16} />

                    Most Popular

                  </div>

                </div>
              )}

              <h3 className="text-2xl font-bold">
                {plan.name}
              </h3>

              <p className="text-zinc-400 mt-3">
                {plan.description}
              </p>

              <div className="mt-8 flex items-end gap-2">

                <span className="text-5xl font-bold">
                  {plan.price}
                </span>

                <span className="text-zinc-400">
                  {plan.period}
                </span>

              </div>

              <button
                className={`mt-8 w-full rounded-xl py-3 font-semibold transition
                ${
                  plan.featured
                    ? "bg-cyan-500 text-black hover:bg-cyan-400"
                    : "border border-white/10 hover:border-cyan-500"
                }`}
              >
                {plan.button}
              </button>

              <div className="mt-10 space-y-4">

                {plan.features.map((feature) => (

                  <div
                    key={feature}
                    className="flex items-center gap-3"
                  >

                    <Check
                      size={18}
                      className="text-emerald-400"
                    />

                    <span className="text-zinc-300">
                      {feature}
                    </span>

                  </div>

                ))}

              </div>

            </div>

          ))}

        </div>

      </div>
    </section>
  );
}