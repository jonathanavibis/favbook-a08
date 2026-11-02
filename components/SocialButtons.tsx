"use client";

import { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import { useAuth } from "@/context/AuthContext";

export default function SocialButtons({ redirectUrl = "/" }: { redirectUrl?: string }) {
  const { socialLogin } = useAuth();
  const [activeProvider, setActiveProvider] = useState<"google" | "github" | null>(null);

  const handleGoogleLogin = async () => {
    setActiveProvider("google");
    try {
      await socialLogin(
        {
          name: "Jonathan Reader",
          email: "jonathan.reader@gmail.com",
          image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80",
          provider: "google",
        },
        redirectUrl
      );
    } finally {
      setActiveProvider(null);
    }
  };

  const handleGithubLogin = async () => {
    setActiveProvider("github");
    try {
      await socialLogin(
        {
          name: "Jonathan Avi Biswas",
          email: "joanthan.avibd24@gmail.com",
          image: "https://avatars.githubusercontent.com/u/jonathanavibis",
          provider: "github",
        },
        redirectUrl
      );
    } finally {
      setActiveProvider(null);
    }
  };

  return (
    <div className="w-full space-y-2.5">
      {/* Google Button */}
      <button
        type="button"
        onClick={handleGoogleLogin}
        disabled={activeProvider !== null}
        className="flex w-full items-center justify-center gap-3 rounded-2xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900/60 py-3 px-4 text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/80 hover:border-slate-400 dark:hover:border-slate-600 transition-all shadow-sm disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
      >
        <FcGoogle className="h-5 w-5" />
        <span>
          {activeProvider === "google" ? "Authenticating with Google..." : "Continue with Google"}
        </span>
      </button>

      {/* GitHub Button */}
      <button
        type="button"
        onClick={handleGithubLogin}
        disabled={activeProvider !== null}
        className="flex w-full items-center justify-center gap-3 rounded-2xl border border-slate-700 dark:border-slate-700 bg-slate-900 text-white hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-750 py-3 px-4 text-xs sm:text-sm font-semibold transition-all shadow-sm disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
      >
        <FaGithub className="h-5 w-5 text-white" />
        <span>
          {activeProvider === "github" ? "Authenticating with GitHub..." : "Continue with GitHub"}
        </span>
      </button>
    </div>
  );
}
