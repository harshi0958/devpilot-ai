"use client";

import Link from "next/link";
import { Check, Sparkles } from "lucide-react";

const plans = [
  {
    name: "Free",
    price: "₹0",
    period: "/month",
    description: "Perfect for learning and personal projects.",
    button: "Start Free",
    href: "/register",
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
    href: "/login?plan=pro",
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
    href: "/contact",
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
    <section
      id="pricing"
      className="py-32"
    >
      <div className="mx-auto max-w-7xl px-6">

        {/* Heading */}

        <div className="mb-20 text-center">

          <span className="rounded-full border border-cyan-500/30 bg-cyan-500/10 px-5 py-2 text-sm text-cyan-400">
            Pricing
          </span>

          <h2 className="mt-6 text-5xl font-bold text-white">
            Choose Your Perfect Plan
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-zinc-400">
            Start free and upgrade whenever your projects grow.
          </p>

        </div>

        {/* Plans */}

        <div className="grid gap-8 lg:grid-cols-3">

          {plans.map((plan) => (

            <div
              key={plan.name}
              className={`relative rounded-3xl border p-8 transition-all duration-300 hover:-translate-y-2 ${
                plan.featured
                  ? "border-cyan-500 bg-linear-to-b from-[#182542] to-[#121826] shadow-[0_0_50px_rgba(0,255,255,0.15)]"
                  : "border-white/10 bg-[#171d30]"
              }`}
            >

              {/* Popular badge */}

              {plan.featured && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">

                  <div className="flex items-center gap-2 rounded-full bg-cyan-500 px-4 py-2 text-sm font-semibold text-black">

                    <Sparkles size={16} />

                    Most Popular

                  </div>

                </div>
              )}

              {/* Plan name */}

              <h3 className="text-2xl font-bold text-white">
                {plan.name}
              </h3>

              <p className="mt-3 text-zinc-400">
                {plan.description}
              </p>

              {/* Price */}

              <div className="mt-8 flex items-end gap-2">

                <span className="text-5xl font-bold text-white">
                  {plan.price}
                </span>

                <span className="text-zinc-400">
                  {plan.period}
                </span>

              </div>

              {/* Button */}

              <Link
                href={plan.href}
                className={`mt-8 flex w-full items-center justify-center rounded-xl py-3 font-semibold transition ${
                  plan.featured
                    ? "bg-cyan-500 text-black hover:bg-cyan-400"
                    : "border border-white/10 text-white hover:border-cyan-500 hover:text-cyan-400"
                }`}
              >
                {plan.button}
              </Link>

              {/* Features */}

              <div className="mt-10 space-y-4">

                {plan.features.map((feature) => (

                  <div
                    key={feature}
                    className="flex items-center gap-3"
                  >

                    <Check
                      size={18}
                      className="shrink-0 text-emerald-400"
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