"use client";

import { ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";

interface AuthGuardProps {
  children: ReactNode;
}

export default function AuthGuard({ children }: AuthGuardProps) {
  const router = useRouter();

  const {
    user,
    loading,
    initialized,
    fetchCurrentUser,
  } = useAuthStore();

  useEffect(() => {
    if (!initialized) {
      fetchCurrentUser();
    }
  }, [initialized, fetchCurrentUser]);

  useEffect(() => {
    if (initialized && !user) {
      router.replace("/login");
    }
  }, [initialized, user, router]);

  // Check authentication while session is being restored
  if (!initialized || loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#05070a] text-white">
        <div className="flex flex-col items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-cyan-400/20 bg-cyan-400/10">
            <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/20 border-t-cyan-400" />
          </div>

          <div className="text-center">
            <p className="text-sm font-medium text-white/80">
              Checking your session
            </p>

            <p className="mt-1 text-xs text-white/35">
              Connecting to DevPilot AI...
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Don't render protected content for unauthenticated users
  if (!user) {
    return null;
  }

  return <>{children}</>;
}