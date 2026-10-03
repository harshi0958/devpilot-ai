"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Eye,
  EyeOff,
  Lock,
  Mail,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

import { API_URL } from "@/lib/api";

type Step = "email" | "otp" | "password";

export default function ForgotPasswordPage() {
  const router = useRouter();

  const [step, setStep] = useState<Step>("email");

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const [loading, setLoading] = useState(false);

  const [countdown, setCountdown] = useState(0);
  const [otpVerified, setOtpVerified] = useState(false);

  const startCountdown = () => {
    setCountdown(50);

    const timer = setInterval(() => {
      setCountdown((previous) => {
        if (previous <= 1) {
          clearInterval(timer);
          return 0;
        }

        return previous - 1;
      });
    }, 1000);
  };

  // SEND RESET OTP
  const handleSendOTP = async (event: FormEvent) => {
    event.preventDefault();

    setError("");
    setMessage("");

    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail) {
      setError("Please enter your email address.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        `${API_URL}/api/auth/forgot-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            email: normalizedEmail,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data?.message || "Unable to send reset OTP.");
        return;
      }

      setEmail(normalizedEmail);
      setStep("otp");
      setOtp("");
      startCountdown();

      setMessage(
        data?.message || "Password reset OTP sent to your email."
      );
    } catch (error) {
      console.error("Forgot Password Error:", error);
      setError("Unable to connect to the backend.");
    } finally {
      setLoading(false);
    }
  };

  // VERIFY OTP
  const handleVerifyOTP = async (event: FormEvent) => {
    event.preventDefault();

    setError("");
    setMessage("");

    if (!/^\d{6}$/.test(otp.trim())) {
      setError("Please enter a valid 6-digit OTP.");
      return;
    }

    if (countdown <= 0) {
      setError("OTP has expired. Please request a new OTP.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        `${API_URL}/api/auth/forgot-password/verify`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            email,
            otp: otp.trim(),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data?.message || "Invalid or expired OTP.");
        return;
      }

      setOtpVerified(true);
      setStep("password");
      setMessage("OTP verified successfully.");
    } catch (error) {
      console.error("Verify Reset OTP Error:", error);
      setError("Unable to connect to the backend.");
    } finally {
      setLoading(false);
    }
  };

  // RESEND OTP
  const handleResendOTP = async () => {
    setError("");
    setMessage("");

    if (countdown > 0) {
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        `${API_URL}/api/auth/forgot-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            email,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data?.message || "Unable to resend OTP.");
        return;
      }

      setOtp("");
      startCountdown();

      setMessage("A new OTP has been sent to your email.");
    } catch (error) {
      console.error("Resend Reset OTP Error:", error);
      setError("Unable to connect to the backend.");
    } finally {
      setLoading(false);
    }
  };

  // RESET PASSWORD
  const handleResetPassword = async (event: FormEvent) => {
    event.preventDefault();

    setError("");
    setMessage("");

    if (!otpVerified) {
      setError("Please verify your OTP first.");
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

    setLoading(true);

    try {
      const response = await fetch(
        `${API_URL}/api/auth/reset-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            email,
            otp,
            newPassword: password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data?.message || "Unable to reset password.");
        return;
      }

      setMessage(
        data?.message || "Password reset successfully."
      );

      setTimeout(() => {
        router.push("/login");
      }, 1200);
    } catch (error) {
      console.error("Reset Password Error:", error);
      setError("Unable to connect to the backend.");
    } finally {
      setLoading(false);
    }
  };

  const getStepTitle = () => {
    if (step === "email") return "Forgot your password?";
    if (step === "otp") return "Verify your OTP";
    return "Create new password";
  };

  const getStepDescription = () => {
    if (step === "email") {
      return "Enter your registered email and we'll send you a secure OTP.";
    }

    if (step === "otp") {
      return `Enter the 6-digit OTP sent to ${email}.`;
    }

    return "Your identity has been verified. Set a new password for your account.";
  };

  return (
    <main className="min-h-screen bg-[#05070a] text-white relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 h-96 w-96 rounded-full bg-cyan-500/10 blur-3xl" />
        <div className="absolute -bottom-40 -right-40 h-96 w-96 rounded-full bg-blue-500/10 blur-3xl" />
      </div>

      {/* Header */}
      <div className="relative z-10 flex items-center justify-between px-6 py-6 lg:px-10">
        <Link
          href="/"
          className="flex items-center gap-3"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-400/10 border border-cyan-400/20">
            <Sparkles className="h-5 w-5 text-cyan-300" />
          </div>

          <span className="text-lg font-semibold tracking-tight">
            DevPilot <span className="text-cyan-300">AI</span>
          </span>
        </Link>

        <Link
          href="/login"
          className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Login
        </Link>
      </div>

      {/* Main */}
      <div className="relative z-10 flex min-h-[calc(100vh-100px)] items-center justify-center px-6 py-10">
        <div className="w-full max-w-md">

          {/* Card */}
          <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-7 shadow-2xl backdrop-blur-xl sm:p-9">

            {/* Icon */}
            <div className="mb-6 flex justify-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-cyan-400/20 bg-cyan-400/10">
                {step === "email" && (
                  <Mail className="h-7 w-7 text-cyan-300" />
                )}

                {step === "otp" && (
                  <ShieldCheck className="h-7 w-7 text-cyan-300" />
                )}

                {step === "password" && (
                  <Lock className="h-7 w-7 text-cyan-300" />
                )}
              </div>
            </div>

            {/* Heading */}
            <div className="text-center">
              <h1 className="text-2xl font-semibold tracking-tight">
                {getStepTitle()}
              </h1>

              <p className="mt-2 text-sm leading-6 text-gray-400">
                {getStepDescription()}
              </p>
            </div>

            {/* Step Indicator */}
            <div className="mt-7 flex items-center justify-center gap-2">
              {["email", "otp", "password"].map(
                (item, index) => {
                  const currentIndex =
                    step === "email"
                      ? 0
                      : step === "otp"
                      ? 1
                      : 2;

                  const active = index <= currentIndex;

                  return (
                    <div
                      key={item}
                      className={`h-1.5 rounded-full transition-all ${
                        active
                          ? "w-12 bg-cyan-400"
                          : "w-8 bg-white/10"
                      }`}
                    />
                  );
                }
              )}
            </div>

            {/* Error */}
            {error && (
              <div className="mt-6 rounded-xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm text-red-300">
                {error}
              </div>
            )}

            {/* Success */}
            {message && (
              <div className="mt-6 rounded-xl border border-emerald-400/20 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-300">
                {message}
              </div>
            )}

            {/* EMAIL STEP */}
            {step === "email" && (
              <form
                onSubmit={handleSendOTP}
                className="mt-7 space-y-5"
              >
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-300">
                    Email Address
                  </label>

                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-500" />

                    <input
                      type="email"
                      value={email}
                      onChange={(event) =>
                        setEmail(event.target.value)
                      }
                      placeholder="you@example.com"
                      autoComplete="email"
                      className="w-full rounded-xl border border-white/10 bg-black/20 py-3.5 pl-12 pr-4 text-sm text-white outline-none transition placeholder:text-gray-600 focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-400/10"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-cyan-400 px-5 py-3.5 text-sm font-semibold text-black transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {loading ? "Sending OTP..." : "Send Reset OTP"}

                  {!loading && (
                    <ArrowRight className="h-4 w-4" />
                  )}
                </button>
              </form>
            )}

            {/* OTP STEP */}
            {step === "otp" && (
              <form
                onSubmit={handleVerifyOTP}
                className="mt-7 space-y-5"
              >
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-300">
                    6-Digit OTP
                  </label>

                  <input
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    value={otp}
                    onChange={(event) =>
                      setOtp(
                        event.target.value
                          .replace(/\D/g, "")
                          .slice(0, 6)
                      )
                    }
                    placeholder="000000"
                    className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-4 text-center text-2xl font-semibold tracking-[0.5em] text-white outline-none transition placeholder:text-gray-700 focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-400/10"
                    required
                  />
                </div>

                <div className="text-center text-sm">
                  {countdown > 0 ? (
                    <span className="text-gray-400">
                      OTP expires in{" "}
                      <span className="font-semibold text-cyan-300">
                        {countdown}s
                      </span>
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={handleResendOTP}
                      disabled={loading}
                      className="font-medium text-cyan-300 hover:text-cyan-200 disabled:opacity-50"
                    >
                      Resend OTP
                    </button>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={loading || countdown <= 0}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-cyan-400 px-5 py-3.5 text-sm font-semibold text-black transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {loading ? "Verifying..." : "Verify OTP"}

                  {!loading && (
                    <ShieldCheck className="h-4 w-4" />
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setStep("email");
                    setOtp("");
                    setError("");
                    setMessage("");
                    setCountdown(0);
                  }}
                  className="w-full text-sm text-gray-500 hover:text-gray-300 transition"
                >
                  Use a different email
                </button>
              </form>
            )}

            {/* PASSWORD STEP */}
            {step === "password" && (
              <form
                onSubmit={handleResetPassword}
                className="mt-7 space-y-5"
              >
                {/* New password */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-300">
                    New Password
                  </label>

                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-500" />

                    <input
                      type={
                        showPassword
                          ? "text"
                          : "password"
                      }
                      value={password}
                      onChange={(event) =>
                        setPassword(event.target.value)
                      }
                      placeholder="Minimum 8 characters"
                      autoComplete="new-password"
                      className="w-full rounded-xl border border-white/10 bg-black/20 py-3.5 pl-12 pr-12 text-sm text-white outline-none transition placeholder:text-gray-600 focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-400/10"
                      required
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowPassword(!showPassword)
                      }
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Confirm password */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-300">
                    Confirm Password
                  </label>

                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-500" />

                    <input
                      type={
                        showConfirmPassword
                          ? "text"
                          : "password"
                      }
                      value={confirmPassword}
                      onChange={(event) =>
                        setConfirmPassword(
                          event.target.value
                        )
                      }
                      placeholder="Re-enter your password"
                      autoComplete="new-password"
                      className="w-full rounded-xl border border-white/10 bg-black/20 py-3.5 pl-12 pr-12 text-sm text-white outline-none transition placeholder:text-gray-600 focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-400/10"
                      required
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(
                          !showConfirmPassword
                        )
                      }
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-cyan-400 px-5 py-3.5 text-sm font-semibold text-black transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {loading
                    ? "Resetting Password..."
                    : "Reset Password"}

                  {!loading && (
                    <ArrowRight className="h-4 w-4" />
                  )}
                </button>
              </form>
            )}

            {/* Login link */}
            <div className="mt-7 border-t border-white/10 pt-6 text-center">
              <Link
                href="/login"
                className="text-sm text-gray-400 transition hover:text-cyan-300"
              >
                Remember your password?{" "}
                <span className="font-medium text-cyan-300">
                  Login
                </span>
              </Link>
            </div>
          </div>

          {/* Footer */}
          <p className="mt-6 text-center text-xs text-gray-600">
            Secured by DevPilot AI authentication
          </p>
        </div>
      </div>
    </main>
  );
}