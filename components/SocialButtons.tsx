"use client";

import { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import { authClient } from "@/lib/auth-client";
import { useToast } from "@/context/ToastContext";

export default function SocialButtons({ redirectUrl = "/" }: { redirectUrl?: string }) {
  const [activeProvider, setActiveProvider] = useState<"google" | "github" | null>(null);
  const toast = useToast();

  const handleSocialSignIn = async (provider: "google" | "github") => {
    setActiveProvider(provider);
    try {
      const fullCallback = redirectUrl.startsWith("http")
        ? redirectUrl
        : `${window.location.origin}${redirectUrl.startsWith("/") ? redirectUrl : `/${redirectUrl}`}`;

      // Invokes BetterAuth social sign-in with user's real Google / GitHub Client credentials
      await authClient.signIn.social({
        provider,
        callbackURL: fullCallback,
      });
    } catch (err: unknown) {
      console.error(`${provider} OAuth redirect error:`, err);
      toast.error(`Could not initiate ${provider} sign in. Please verify OAuth callback URL.`);
      setActiveProvider(null);
    }
  };

  return (
    <div className="w-full space-y-2.5">
      {/* Google Sign In Button */}
      <button
        type="button"
        onClick={() => handleSocialSignIn("google")}
        disabled={activeProvider !== null}
        className="flex w-full items-center justify-center gap-3 rounded-2xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900/60 py-3 px-4 text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/80 hover:border-slate-400 dark:hover:border-slate-600 transition-all shadow-sm disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
      >
        <FcGoogle className="h-5 w-5 shrink-0" />
        <span>
          {activeProvider === "google" ? "Redirecting to Google..." : "Continue with Google"}
        </span>
      </button>

      {/* GitHub Sign In Button */}
      <button
        type="button"
        onClick={() => handleSocialSignIn("github")}
        disabled={activeProvider !== null}
        className="flex w-full items-center justify-center gap-3 rounded-2xl border border-slate-700 dark:border-slate-700 bg-slate-900 text-white hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-750 py-3 px-4 text-xs sm:text-sm font-semibold transition-all shadow-sm disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
      >
        <FaGithub className="h-5 w-5 shrink-0 text-white" />
        <span>
          {activeProvider === "github" ? "Redirecting to GitHub..." : "Continue with GitHub"}
        </span>
      </button>
    </div>
  );
}
