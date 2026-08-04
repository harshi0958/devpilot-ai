"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, PlayCircle } from "lucide-react";
import HeroVisual from "./HeroVisual";

export default function Hero() {
  return (
    <section className="relative overflow-hidden pt-32">

      <div className="mx-auto max-w-7xl px-6">

        <div className="grid min-h-[85vh] items-center gap-16 lg:grid-cols-2">

          {/* LEFT SIDE */}

          <div>

            {/* Badge */}

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-8 inline-flex rounded-full border border-cyan-500/30 bg-cyan-500/10 px-5 py-2 text-sm text-cyan-300"
            >
              ✨ Autonomous Multi-Agent Software Engineering Platform
            </motion.div>

            {/* Heading */}

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="max-w-4xl text-5xl font-black leading-tight text-white md:text-6xl xl:text-7xl"
            >
              Build Software

              <span className="mt-2 block bg-gradient-to-r from-cyan-400 via-blue-500 to-violet-500 bg-clip-text text-transparent">
                with Autonomous AI Agents
              </span>
            </motion.h1>

            {/* Subtitle */}

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="mt-8 max-w-2xl text-lg leading-8 text-slate-400 lg:text-xl"
            >
              DevPilot AI is your complete AI engineering team that plans,
              designs, develops, reviews, tests and deploys applications
              automatically.
            </motion.p>

            {/* Buttons */}

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="mt-10 flex flex-wrap gap-5"
            >

              <Button
                size="lg"
                className="h-14 rounded-xl bg-cyan-500 px-8 text-lg font-semibold text-black shadow-lg shadow-cyan-500/30 transition-all hover:scale-105 hover:bg-cyan-400"
              >
                Get Started

                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>

              <Button
                variant="outline"
                size="lg"
                className="h-14 rounded-xl border border-zinc-700 bg-white/5 px-8 text-lg text-white backdrop-blur-md transition-all hover:scale-105 hover:border-cyan-500 hover:bg-white/10"
              >
                <PlayCircle className="mr-2 h-5 w-5" />

                Watch Demo
              </Button>

            </motion.div>

            {/* Stats */}

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="mt-14 flex flex-wrap gap-10"
            >

              <div>
                <h3 className="text-3xl font-bold text-cyan-400">
                  50K+
                </h3>

                <p className="text-sm text-slate-400">
                  Projects Generated
                </p>
              </div>

              <div>
                <h3 className="text-3xl font-bold text-cyan-400">
                  98%
                </h3>

                <p className="text-sm text-slate-400">
                  Deployment Success
                </p>
              </div>

              <div>
                <h3 className="text-3xl font-bold text-cyan-400">
                  24/7
                </h3>

                <p className="text-sm text-slate-400">
                  AI Agents Working
                </p>
              </div>

            </motion.div>

          </div>

          {/* RIGHT SIDE */}

          <motion.div
            initial={{ opacity: 0, x: 80 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="hidden lg:block"
          >
            <HeroVisual />
          </motion.div>

        </div>

      </div>

    </section>
  );
}