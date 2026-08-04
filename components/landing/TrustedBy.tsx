"use client";

import { motion } from "framer-motion";

const companies = [
  "OpenAI",
  "Vercel",
  "GitHub",
  "Docker",
  "Next.js",
  "PostgreSQL",
];

export default function TrustedBy() {
  return (
    <section className="py-24">

      <div className="mx-auto max-w-7xl px-6">

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <p className="mb-12 text-sm font-medium uppercase tracking-[0.35em] text-slate-500">
            Built using modern technologies
          </p>
        </motion.div>

        <div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-6">

          {companies.map((company, index) => (
            <motion.div
              key={company}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.08 }}
              viewport={{ once: true }}
              className="group rounded-2xl border border-white/10 bg-white/5 p-6 text-center backdrop-blur-xl transition-all duration-300 hover:-translate-y-2 hover:border-cyan-500/40 hover:bg-white/10"
            >
              <h3 className="text-lg font-semibold text-slate-300 transition group-hover:text-cyan-400">
                {company}
              </h3>
            </motion.div>
          ))}

        </div>

      </div>

    </section>
  );
}