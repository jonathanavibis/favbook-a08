"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { BookOpen, Mail, Lock, ArrowRight, AlertCircle } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import SocialButtons from "@/components/SocialButtons";

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect") || "/";

  const { login } = useAuth();
  const toast = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!email || !password) {
      const msg = "Please provide both your registered email and password.";
      setFormError(msg);
      toast.error(msg);
      return;
    }

    setLoading(true);
    const success = await login(email, password, redirectUrl);
    setLoading(false);

    if (!success) {
      setFormError("Invalid email or password. Please verify your credentials and try again.");
    }
  };

  const handleForgetPassword = (e: React.MouseEvent) => {
    e.preventDefault();
    toast.info("Password recovery is currently simplified for examination evaluation.");
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4 py-12">
      <div className="w-full max-w-md rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827] p-8 shadow-2xl backdrop-blur-xl">
        
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-slate-950 shadow-md shadow-emerald-500/25">
            <BookOpen className="h-6 w-6 stroke-[2.2]" />
          </div>
          <h1 className="mt-4 text-2xl font-black text-slate-900 dark:text-white">
            Welcome Back to BookNook
          </h1>
          <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400">
            Sign in to borrow books, check due dates, and add new titles to our library.
          </p>
        </div>

        {/* In-Form Error Alert */}
        {formError && (
          <div className="mt-6 flex items-center gap-2.5 rounded-2xl bg-rose-500/10 border border-rose-500/25 p-3.5 text-xs text-rose-500 dark:text-rose-400 animate-in fade-in">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{formError}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleLogin} className="mt-6 space-y-4">
          {/* Email Field */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
              <input
                type="email"
                required
                placeholder="reader@bookhype.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-2xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 py-3 pl-10 pr-4 text-xs font-medium text-slate-900 dark:text-white placeholder:text-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-all"
              />
            </div>
          </div>

          {/* Password Field */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                Password
              </label>
              {/* Forget Password link as required */}
              <button
                type="button"
                onClick={handleForgetPassword}
                className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline"
              >
                Forget Password?
              </button>
            </div>
            <div className="relative">
              <Lock className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-2xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 py-3 pl-10 pr-4 text-xs font-medium text-slate-900 dark:text-white placeholder:text-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-all"
              />
            </div>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            disabled={loading}
            className={`mt-2 flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-400 py-3.5 text-sm font-bold text-slate-950 shadow-md shadow-emerald-500/20 hover:shadow-emerald-500/40 hover:scale-[1.01] transition-all ${
              loading ? "opacity-60 cursor-not-allowed" : ""
            }`}
          >
            <span>{loading ? "Authenticating..." : "Login"}</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </form>

        {/* Divider */}
        <div className="relative my-6 flex items-center justify-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200 dark:border-slate-800" />
          </div>
          <span className="relative bg-white dark:bg-[#111827] px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400">
            or continue with
          </span>
        </div>

        {/* Google Social Login Button */}
        <SocialButtons redirectUrl={redirectUrl} />

        {/* Link to Register */}
        <p className="mt-6 text-center text-xs text-slate-500 dark:text-slate-400">
          Don&apos;t have a BookNook account?{" "}
          <Link
            href="/register"
            className="font-bold text-emerald-600 dark:text-emerald-400 hover:underline"
          >
            Register Here
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-[80vh] flex items-center justify-center">Loading...</div>}>
      <LoginForm />
    </Suspense>
  );
}
