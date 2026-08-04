"use client";

import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";

const files = [
  "Navbar.tsx",
  "Hero.tsx",
  "DashboardPreview.tsx",
  "AuthService.ts",
];

export default function LiveCodePreview() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6 }}
      className="mt-6 overflow-hidden rounded-3xl border border-white/10 bg-slate-900/60 backdrop-blur-xl"
    >
      {/* Header */}

      <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">

        <div className="flex items-center gap-2">

          <span className="h-3 w-3 rounded-full bg-red-500"></span>
          <span className="h-3 w-3 rounded-full bg-yellow-500"></span>
          <span className="h-3 w-3 rounded-full bg-green-500"></span>

        </div>

        <p className="text-sm text-slate-400">
          Live Code Generation
        </p>

      </div>

      {/* Body */}

      <div className="space-y-4 p-5">

        <p className="font-mono text-sm text-cyan-400">
          Generating project...
        </p>

        {files.map((file, index) => (
          <motion.div
            key={file}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 * index }}
            className="flex items-center justify-between rounded-lg bg-white/5 px-4 py-3"
          >
            <span className="font-mono text-sm text-white">
              {file}
            </span>

            <CheckCircle2 className="h-5 w-5 text-green-400" />
          </motion.div>
        ))}

        {/* Progress */}

        <div className="pt-2">

          <div className="mb-2 flex justify-between text-sm">

            <span className="text-slate-400">
              AI Progress
            </span>

            <span className="text-cyan-400">
              92%
            </span>

          </div>

          <div className="h-2 rounded-full bg-slate-700">

            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "92%" }}
              transition={{ duration: 2 }}
              className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-violet-500"
            />

          </div>

        </div>

      </div>

    </motion.div>
  );
}