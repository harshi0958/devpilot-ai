"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Mail,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  RefreshCw,
} from "lucide-react";

import { useAuthStore } from "@/store/authStore";
import { API_URL } from "@/lib/api";

type LoginStep = "email" | "otp";

export default function LoginPage() {
  const router = useRouter();
  const { fetchCurrentUser } = useAuthStore();

  const [step, setStep] = useState<LoginStep>("email");

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");

  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [secondsLeft, setSecondsLeft] = useState(0);

  // ==========================================
  // OTP COUNTDOWN
  // ==========================================

  useEffect(() => {
    if (secondsLeft <= 0) return;

    const timer = window.setInterval(() => {
      setSecondsLeft((current) => {
        if (current <= 1) {
          window.clearInterval(timer);
          return 0;
        }

        return current - 1;
      });
    }, 1000);

    return () => window.clearInterval(timer);
  }, [secondsLeft]);

  // ==========================================
  // SEND OTP
  // ==========================================

  const sendOTP = async () => {
    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail) {
      setError("Please enter your email address.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      setError("Please enter a valid email address.");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          email: cleanEmail,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data?.message || "Unable to send OTP.");
        return;
      }

      setEmail(cleanEmail);
      setOtp("");
      setStep("otp");

      const expiry = Number(data?.expiresIn) || 50;
      setSecondsLeft(expiry);

      setSuccess(
        data?.message || "OTP sent successfully to your email."
      );
    } catch (error) {
      console.error("Send OTP Error:", error);

      setError("Unable to connect to the backend.");
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // VERIFY OTP
  // ==========================================

  const verifyOTP = async (e?: FormEvent<HTMLFormElement>) => {
    e?.preventDefault();

    if (!otp.trim()) {
      setError("Please enter the OTP.");
      return;
    }

    if (!/^\d{6}$/.test(otp.trim())) {
      setError("OTP must be exactly 6 digits.");
      return;
    }

    if (secondsLeft <= 0) {
      setError("OTP has expired. Please request a new OTP.");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch(`${API_URL}/api/auth/login/verify`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          otp: otp.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data?.message || "Invalid or expired OTP.");
        return;
      }

      // Refresh Zustand auth state using the newly-created auth cookie.
      await fetchCurrentUser();

      setSuccess("Login successful. Redirecting...");

      setTimeout(() => {
        router.push("/dashboard");
      }, 400);
    } catch (error) {
      console.error("Verify OTP Error:", error);

      setError("Unable to connect to the backend.");
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // RESEND OTP
  // ==========================================

  const resendOTP = async () => {
    if (resending || secondsLeft > 0) return;

    setResending(true);
    setError("");
    setSuccess("");
    setOtp("");

    try {
      const response = await fetch(`${API_URL}/api/auth/login/resend`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data?.message || "Unable to resend OTP.");
        return;
      }

      const expiry = Number(data?.expiresIn) || 50;

      setSecondsLeft(expiry);

      setSuccess(
        data?.message || "A new OTP has been sent to your email."
      );
    } catch (error) {
      console.error("Resend OTP Error:", error);

      setError("Unable to connect to the backend.");
    } finally {
      setResending(false);
    }
  };

  // ==========================================
  // CHANGE EMAIL
  // ==========================================

  const changeEmail = () => {
    setStep("email");
    setOtp("");
    setError("");
    setSuccess("");
    setSecondsLeft(0);
  };

  // ==========================================
  // FORMAT TIMER
  // ==========================================

  const formattedTime = `00:${secondsLeft
    .toString()
    .padStart(2, "0")}`;

  return (
    <main className="min-h-screen bg-[#05070a] text-white">
      <div className="relative flex min-h-screen overflow-hidden">

        {/* Background Glow */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/4 -top-45 h-105 w-105 rounded-full bg-cyan-500/10 blur-[120px]" />
          <div className="absolute -bottom-45 right-1/4 h-105 w-105 rounded-full bg-blue-500/10 blur-[120px]" />
        </div>

        {/* ==========================================
            LEFT BRANDING SECTION
        ========================================== */}

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
              YOUR AI SOFTWARE ENGINEERING TEAM
            </p>

            <h2 className="text-5xl font-semibold leading-tight tracking-tight">
              Build software
              <br />

              <span className="text-white/40">
                with intelligent agents.
              </span>
            </h2>

            <p className="mt-6 max-w-lg text-base leading-7 text-white/50">
              Plan, build, test, debug and document your software with
              specialized AI agents working together in one platform.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              {[
                "Architect",
                "Developer",
                "Debugger",
                "Testing",
              ].map((agent) => (
                <div
                  key={agent}
                  className="rounded-full border border-white/10 bg-white/3 px-4 py-2 text-xs text-white/60"
                >
                  {agent} Agent
                </div>
              ))}
            </div>
          </div>

          <p className="text-xs text-white/30">
            © {new Date().getFullYear()} DevPilot AI. All rights reserved.
          </p>
        </section>

        {/* ==========================================
            LOGIN SECTION
        ========================================== */}

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

            {/* Header */}
            <div className="mb-8">

              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl border border-cyan-400/20 bg-cyan-400/10">
                {step === "email" ? (
                  <Mail className="h-5 w-5 text-cyan-400" />
                ) : (
                  <ShieldCheck className="h-5 w-5 text-cyan-400" />
                )}
              </div>

              <h2 className="text-3xl font-semibold tracking-tight">
                {step === "email"
                  ? "Welcome back"
                  : "Enter your OTP"}
              </h2>

              <p className="mt-2 text-sm leading-6 text-white/45">
                {step === "email"
                  ? "Sign in securely with a one-time password sent to your email."
                  : `We sent a 6-digit OTP to ${email}.`}
              </p>
            </div>

            {/* Error */}
            {error && (
              <div className="mb-5 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm leading-5 text-red-300">
                {error}
              </div>
            )}

            {/* Success */}
            {success && (
              <div className="mb-5 rounded-xl border border-cyan-400/20 bg-cyan-400/10 px-4 py-3 text-sm leading-5 text-cyan-300">
                {success}
              </div>
            )}

            {/* ==========================================
                EMAIL STEP
            ========================================== */}

            {step === "email" && (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  sendOTP();
                }}
                className="space-y-5"
              >

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
                      onChange={(e) => {
                        setEmail(e.target.value);
                        setError("");
                      }}
                      placeholder="you@example.com"
                      autoComplete="email"
                      disabled={loading}
                      autoFocus
                      className="h-12 w-full rounded-xl border border-white/10 bg-white/3 pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-white/25 focus:border-cyan-400/40 focus:bg-white/5 disabled:cursor-not-allowed disabled:opacity-50"
                    />

                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="group flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-cyan-400 px-5 text-sm font-semibold text-black transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-60"
                >

                  {loading ? (
                    <>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-black/30 border-t-black" />
                      Sending OTP...
                    </>
                  ) : (
                    <>
                      Send OTP
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </>
                  )}

                </button>

              </form>
            )}

            {/* ==========================================
                OTP STEP
            ========================================== */}

            {step === "otp" && (
              <form
                onSubmit={verifyOTP}
                className="space-y-5"
              >

                {/* OTP Input */}
                <div>
                  <label
                    htmlFor="otp"
                    className="mb-2 block text-sm font-medium text-white/70"
                  >
                    One-Time Password
                  </label>

                  <input
                    id="otp"
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    value={otp}
                    onChange={(e) => {
                      const value = e.target.value
                        .replace(/\D/g, "")
                        .slice(0, 6);

                      setOtp(value);
                      setError("");
                    }}
                    placeholder="000000"
                    autoComplete="one-time-code"
                    autoFocus
                    disabled={loading}
                    className="h-14 w-full rounded-xl border border-white/10 bg-white/3 px-4 text-center text-2xl font-semibold tracking-[0.5em] text-cyan-300 outline-none transition placeholder:text-white/20 focus:border-cyan-400/40 focus:bg-white/5 disabled:cursor-not-allowed disabled:opacity-50"
                  />
                </div>

                {/* Timer */}
                <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/3 px-4 py-3">

                  <div className="flex items-center gap-2 text-xs text-white/40">
                    <ShieldCheck className="h-4 w-4 text-cyan-400" />

                    {secondsLeft > 0
                      ? "OTP expires in"
                      : "OTP expired"}
                  </div>

                  <span
                    className={`font-mono text-sm font-semibold ${
                      secondsLeft > 0
                        ? "text-cyan-400"
                        : "text-red-400"
                    }`}
                  >
                    {formattedTime}
                  </span>

                </div>

                {/* Verify */}
                <button
                  type="submit"
                  disabled={
                    loading ||
                    otp.length !== 6 ||
                    secondsLeft <= 0
                  }
                  className="group flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-cyan-400 px-5 text-sm font-semibold text-black transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-50"
                >

                  {loading ? (
                    <>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-black/30 border-t-black" />
                      Verifying...
                    </>
                  ) : (
                    <>
                      Verify & Sign in
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </>
                  )}

                </button>

                {/* Resend */}
                <button
                  type="button"
                  onClick={resendOTP}
                  disabled={resending || secondsLeft > 0}
                  className="flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/3 text-sm font-medium text-white/60 transition hover:bg-white/5 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
                >

                  <RefreshCw
                    className={`h-4 w-4 ${
                      resending ? "animate-spin" : ""
                    }`}
                  />

                  {resending
                    ? "Sending new OTP..."
                    : secondsLeft > 0
                    ? `Resend OTP in ${secondsLeft}s`
                    : "Resend OTP"}

                </button>

                {/* Change Email */}
                <button
                  type="button"
                  onClick={changeEmail}
                  disabled={loading}
                  className="w-full text-center text-xs text-white/30 transition hover:text-white/60"
                >
                  ← Use a different email
                </button>

              </form>
            )}

            {/* Register */}
            <p className="mt-8 text-center text-sm text-white/40">

              Don&apos;t have an account?{" "}

              <Link
                href="/register"
                className="font-medium text-cyan-400 transition hover:text-cyan-300"
              >
                Create one
              </Link>

            </p>

            {/* Forgot Password */}
            <div className="mt-4 text-center">
              <Link
                href="/forgot-password"
                className="text-xs text-white/30 transition hover:text-cyan-400"
              >
                Forgot password?
              </Link>
            </div>

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