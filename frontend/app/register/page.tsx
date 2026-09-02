"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Eye,
  EyeOff,
  Lock,
  Mail,
  User,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { useAuthStore } from "@/store/authStore";

export default function RegisterPage() {
  const router = useRouter();
  const { register, loading } = useAuthStore();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [error, setError] = useState("");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (!name.trim() || !email.trim() || !password || !confirmPassword) {
      setError("Please fill in all fields.");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    const result = await register(name, email, password);

    if (!result.success) {
      setError(result.message);
      return;
    }

    router.push("/dashboard");
  };

  return (
    <main className="min-h-screen bg-[#05070a] text-white">
      <div className="relative flex min-h-screen overflow-hidden">
        {/* Background Glow */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/4 -top-45 h-105 w-105 rounded-full bg-cyan-500/10 blur-[120px]" />
          <div className="absolute -bottom-45 right-1/4 h-105 w-105 rounded-full bg-blue-500/10 blur-[120px]" />
        </div>

        {/* Left Branding Section */}
        <section className="relative hidden w-1/2 flex-col justify-between border-r border-white/10 p-10 lg:flex">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-cyan-400/20 bg-cyan-400/10">
              <Sparkles className="h-5 w-5 text-cyan-400" />
            </div>

            <div>
              <h1 className="text-lg font-semibold tracking-tight">
                DevPilot AI
              </h1>

              <p className="text-xs text-white/40">
                AI Software Engineering Team
              </p>
            </div>
          </Link>

          <div className="max-w-xl">
            <p className="mb-4 text-sm font-medium text-cyan-400">
              START BUILDING WITH AI
            </p>

            <h2 className="text-5xl font-semibold leading-tight tracking-tight">
              Your AI team
              <br />
              <span className="text-white/40">
                is ready to build.
              </span>
            </h2>

            <p className="mt-6 max-w-lg text-base leading-7 text-white/50">
              Create your DevPilot AI account and bring specialized AI
              software engineering agents into your development workflow.
            </p>

            <div className="mt-8 space-y-3">
              {[
                "Plan and architect your projects",
                "Generate production-ready code",
                "Test, debug and document automatically",
              ].map((feature) => (
                <div
                  key={feature}
                  className="flex items-center gap-3 text-sm text-white/50"
                >
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-cyan-400/10 text-xs text-cyan-400">
                    ✓
                  </span>

                  {feature}
                </div>
              ))}
            </div>
          </div>

          <p className="text-xs text-white/30">
            © {new Date().getFullYear()} DevPilot AI. All rights reserved.
          </p>
        </section>

        {/* Register Section */}
        <section className="relative flex w-full items-center justify-center px-6 py-12 lg:w-1/2">
          <div className="w-full max-w-md">
            {/* Mobile Logo */}
            <div className="mb-10 lg:hidden">
              <Link href="/" className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-cyan-400/20 bg-cyan-400/10">
                  <Sparkles className="h-5 w-5 text-cyan-400" />
                </div>

                <div>
                  <h1 className="text-lg font-semibold">
                    DevPilot AI
                  </h1>

                  <p className="text-xs text-white/40">
                    AI Software Engineering Team
                  </p>
                </div>
              </Link>
            </div>

            {/* Heading */}
            <div className="mb-8">
              <h2 className="text-3xl font-semibold tracking-tight">
                Create your account
              </h2>

              <p className="mt-2 text-sm text-white/45">
                Start building smarter with your AI engineering team.
              </p>
            </div>

            {/* Error */}
            {error && (
              <div className="mb-5 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Name */}
              <div>
                <label
                  htmlFor="name"
                  className="mb-2 block text-sm font-medium text-white/70"
                >
                  Full name
                </label>

                <div className="relative">
                  <User className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />

                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your name"
                    autoComplete="name"
                    disabled={loading}
                    className="h-12 w-full rounded-xl border border-white/10 bg-white/3 pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-white/25 focus:border-cyan-400/40 focus:bg-white/5 disabled:cursor-not-allowed disabled:opacity-50"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-medium text-white/70"
                >
                  Email address
                </label>

                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />

                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    autoComplete="email"
                    disabled={loading}
                    className="h-12 w-full rounded-xl border border-white/10 bg-white/3 pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-white/25 focus:border-cyan-400/40 focus:bg-white/5 disabled:cursor-not-allowed disabled:opacity-50"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label
                  htmlFor="password"
                  className="mb-2 block text-sm font-medium text-white/70"
                >
                  Password
                </label>

                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />

                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Create a password"
                    autoComplete="new-password"
                    disabled={loading}
                    className="h-12 w-full rounded-xl border border-white/10 bg-white/3 pl-11 pr-12 text-sm text-white outline-none transition placeholder:text-white/25 focus:border-cyan-400/40 focus:bg-white/5 disabled:cursor-not-allowed disabled:opacity-50"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    disabled={loading}
                    aria-label={
                      showPassword
                        ? "Hide password"
                        : "Show password"
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-2 text-white/30 transition hover:bg-white/5 hover:text-white/70"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>

                <p className="mt-2 text-xs text-white/25">
                  Minimum 8 characters
                </p>
              </div>

              {/* Confirm Password */}
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="mb-2 block text-sm font-medium text-white/70"
                >
                  Confirm password
                </label>

                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />

                  <input
                    id="confirmPassword"
                    type={
                      showConfirmPassword ? "text" : "password"
                    }
                    value={confirmPassword}
                    onChange={(e) =>
                      setConfirmPassword(e.target.value)
                    }
                    placeholder="Confirm your password"
                    autoComplete="new-password"
                    disabled={loading}
                    className="h-12 w-full rounded-xl border border-white/10 bg-white/3 pl-11 pr-12 text-sm text-white outline-none transition placeholder:text-white/25 focus:border-cyan-400/40 focus:bg-white/5 disabled:cursor-not-allowed disabled:opacity-50"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowConfirmPassword((prev) => !prev)
                    }
                    disabled={loading}
                    aria-label={
                      showConfirmPassword
                        ? "Hide password"
                        : "Show password"
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-2 text-white/30 transition hover:bg-white/5 hover:text-white/70"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="group flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-cyan-400 px-5 text-sm font-semibold text-black transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-black/30 border-t-black" />
                    Creating account...
                  </>
                ) : (
                  <>
                    Create account
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </>
                )}
              </button>
            </form>

            {/* Login */}
            <p className="mt-8 text-center text-sm text-white/40">
              Already have an account?{" "}
              <Link
                href="/login"
                className="font-medium text-cyan-400 transition hover:text-cyan-300"
              >
                Sign in
              </Link>
            </p>

            {/* Back Home */}
            <div className="mt-6 text-center">
              <Link
                href="/"
                className="text-xs text-white/25 transition hover:text-white/50"
              >
                ← Back to homepage
              </Link>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}