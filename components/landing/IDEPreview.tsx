"use client";

import { motion } from "framer-motion";
import {
  CheckCircle2,
  Clock3,
  Folder,
  FileCode2,
} from "lucide-react";

const files = [
  { name: "Navbar.tsx", done: true },
  { name: "Hero.tsx", done: true },
  { name: "Dashboard.tsx", done: true },
  { name: "AuthService.ts", done: false },
  { name: "Dockerfile", done: false },
  { name: "README.md", done: false },
];

export default function IDEPreview() {
  return (
    <div className="overflow-hidden rounded-3xl border border-white/10 bg-[#12182b]/90 shadow-2xl">

      {/* Browser Header */}
      <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">

        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-red-500" />
          <span className="h-3 w-3 rounded-full bg-yellow-500" />
          <span className="h-3 w-3 rounded-full bg-green-500" />
        </div>

        <h3 className="font-semibold text-white">
          DevPilot IDE
        </h3>

        <div className="flex items-center gap-2 text-emerald-400 text-sm">
          <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
          LIVE
        </div>

      </div>

      {/* Content */}

      <div className="grid grid-cols-3">

        {/* Explorer */}

        <div className="border-r border-white/10 p-5">

          <div className="mb-5 flex items-center gap-2 text-cyan-400">

            <Folder size={18} />

            <span className="font-semibold">
              src
            </span>

          </div>

          <div className="space-y-3">

            {files.map((file) => (

              <div
                key={file.name}
                className="flex items-center gap-2 text-sm text-slate-300"
              >
                <FileCode2 size={15} />

                <span>{file.name}</span>

              </div>

            ))}

          </div>

        </div>

        {/* Live Generation */}

        <div className="col-span-2 p-5">

          <p className="mb-5 font-medium text-cyan-400">
            Generating project...
          </p>

          <div className="space-y-4">

            {files.map((file, index) => (

              <motion.div
                key={file.name}
                initial={{ opacity: 0, x: -25 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{
                  delay: index * 0.1,
                }}
                className="flex items-center justify-between rounded-xl bg-white/5 px-4 py-3"
              >
                <span className="text-slate-200">
                  {file.name}
                </span>

                {file.done ? (
                  <CheckCircle2 className="text-emerald-400" size={18} />
                ) : (
                  <Clock3
                    className="animate-pulse text-yellow-400"
                    size={18}
                  />
                )}
              </motion.div>

            ))}

          </div>

          {/* Progress */}

          <div className="mt-8">

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
                whileInView={{ width: "92%" }}
                transition={{
                  duration: 1.5,
                }}
                className="h-full rounded-full bg-linear-to-r from-cyan-400 via-blue-500 to-violet-500"
              />

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}