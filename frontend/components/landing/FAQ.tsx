"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    question: "What is DevPilot AI?",
    answer:
      "DevPilot AI is an autonomous multi-agent software engineering platform that plans, designs, develops, tests and deploys applications using specialized AI agents.",
  },
  {
    question: "How many AI agents are available?",
    answer:
      "DevPilot AI includes Architect AI, Frontend AI, Backend AI, Database AI, Testing AI and Deployment AI working together in one workflow.",
  },
  {
    question: "Can I deploy applications directly?",
    answer:
      "Yes. DevPilot AI supports one-click deployment to modern cloud platforms and automates the deployment pipeline.",
  },
  {
    question: "Does DevPilot AI integrate with GitHub?",
    answer:
      "Yes. You can connect GitHub repositories, generate code, create commits and manage projects directly from DevPilot AI.",
  },
  {
    question: "Is there a free plan?",
    answer:
      "Absolutely. You can start with the Free plan and upgrade anytime as your projects grow.",
  },
  {
    question: "Can I use my own AI model?",
    answer:
      "Enterprise customers can integrate their own LLMs and private AI infrastructure for maximum flexibility.",
  },
];

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="py-32">
      <div className="mx-auto max-w-6xl px-6">
        <div className="text-center mb-16">
          <div className="inline-flex rounded-full border border-cyan-500/30 bg-cyan-500/10 px-5 py-2 text-cyan-400">
            FAQ
          </div>

          <h2 className="mt-6 text-5xl font-bold text-white">
            Frequently Asked Questions
          </h2>

          <p className="mt-5 text-lg text-slate-400 max-w-2xl mx-auto">
            Everything you need to know about DevPilot AI.
          </p>
        </div>

        <div className="space-y-5">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md"
            >
              <button
                onClick={() =>
                  setOpen(open === index ? null : index)
                }
                className="flex w-full items-center justify-between px-8 py-6 text-left"
              >
                <span className="text-lg font-semibold text-white">
                  {faq.question}
                </span>

                <ChevronDown
                  className={`transition-transform duration-300 ${
                    open === index ? "rotate-180" : ""
                  }`}
                />
              </button>

              {open === index && (
                <div className="px-8 pb-6 text-slate-400 leading-8">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}