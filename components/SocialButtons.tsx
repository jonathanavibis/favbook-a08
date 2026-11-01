"use client";

import { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { useAuth } from "@/context/AuthContext";

export default function SocialButtons({ redirectUrl = "/" }: { redirectUrl?: string }) {
  const { socialLogin } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleGoogleLogin = async () => {
    setLoading(true);
    // Simulating Google OAuth or invoking OAuth token endpoint
    // In production, users click Google and authenticate with Google Client ID
    try {
      await socialLogin(
        {
          name: "Jonathan Reader",
          email: "jonathan.reader@gmail.com",
          image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80",
        },
        redirectUrl
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      <button
        type="button"
        onClick={handleGoogleLogin}
        disabled={loading}
        className="flex w-full items-center justify-center gap-3 rounded-2xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900/60 py-3 px-4 text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/80 hover:border-slate-400 dark:hover:border-slate-600 transition-all shadow-sm"
      >
        <FcGoogle className="h-5 w-5" />
        <span>{loading ? "Authenticating with Google..." : "Continue with Google"}</span>
      </button>
    </div>
  );
}
