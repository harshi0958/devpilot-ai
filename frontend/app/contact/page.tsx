"use client";

import Link from "next/link";
import { ArrowLeft, Mail, Send } from "lucide-react";
import { useState } from "react";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(true);
  };

  return (
    <main className="min-h-screen bg-[#070B14] px-6 py-12 text-white">
      <div className="mx-auto max-w-4xl">

        {/* Back */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-slate-400 transition hover:text-cyan-400"
        >
          <ArrowLeft size={16} />
          Back to DevPilot AI
        </Link>

        {/* Header */}
        <div className="mt-12 text-center">

          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-500/10">
            <Mail className="text-cyan-400" size={28} />
          </div>

          <h1 className="mt-6 text-4xl font-bold">
            Contact Sales
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-slate-400">
            Tell us about your team and requirements. Our team will get
            back to you with more information about DevPilot AI.
          </p>

        </div>

        {/* Form */}
        <div className="mx-auto mt-12 max-w-2xl rounded-3xl border border-white/10 bg-[#0B1220] p-8">

          {submitted ? (
            <div className="py-12 text-center">

              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10">
                <Send className="text-emerald-400" size={28} />
              </div>

              <h2 className="mt-6 text-2xl font-semibold">
                Request Received
              </h2>

              <p className="mt-3 text-slate-400">
                Thank you for contacting DevPilot AI.
                Our team will get back to you soon.
              </p>

              <Link
                href="/"
                className="mt-8 inline-flex rounded-xl bg-cyan-500 px-6 py-3 font-semibold text-black transition hover:bg-cyan-400"
              >
                Back to Home
              </Link>

            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="space-y-6"
            >

              {/* Name */}
              <div>
                <label
                  htmlFor="name"
                  className="mb-2 block text-sm font-medium text-slate-300"
                >
                  Full Name
                </label>

                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  placeholder="Enter your name"
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-500"
                />
              </div>

              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-medium text-slate-300"
                >
                  Email Address
                </label>

                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  placeholder="you@example.com"
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-500"
                />
              </div>

              {/* Company */}
              <div>
                <label
                  htmlFor="company"
                  className="mb-2 block text-sm font-medium text-slate-300"
                >
                  Company / Organization
                </label>

                <input
                  id="company"
                  name="company"
                  type="text"
                  placeholder="Company name"
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-500"
                />
              </div>

              {/* Message */}
              <div>
                <label
                  htmlFor="message"
                  className="mb-2 block text-sm font-medium text-slate-300"
                >
                  Message
                </label>

                <textarea
                  id="message"
                  name="message"
                  required
                  rows={5}
                  placeholder="Tell us about your requirements..."
                  className="w-full resize-none rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-500"
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-cyan-500 py-3 font-semibold text-black transition hover:bg-cyan-400"
              >
                <Send size={18} />
                Submit Request
              </button>

            </form>
          )}

        </div>

      </div>
    </main>
  );
}