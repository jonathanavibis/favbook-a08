"use client";

import { useState } from "react";
import Link from "next/link";
import { BookOpen, User as UserIcon, Mail, Lock, ArrowRight, Check, X, AlertCircle } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import SocialButtons from "@/components/SocialButtons";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const { register } = useAuth();
  const toast = useToast();

  // Password validation criteria checks
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasMinLength = password.length >= 6;
  const isPasswordValid = hasUpperCase && hasLowerCase && hasMinLength;

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!name || !email || !password) {
      const msg = "Please complete all required fields (Name, Email, and Password).";
      setFormError(msg);
      toast.error(msg);
      return;
    }

    // Explicit password validation requirement
    if (!isPasswordValid) {
      const msg = "Password does not meet the security criteria. Please follow the rules listed below.";
      setFormError(msg);
      toast.error(msg);
      return;
    }

    setLoading(true);
    const success = await register(name, email, password);
    setLoading(false);

    if (!success) {
      setFormError("Registration could not be completed. The email may already be in use.");
    }
  };

  return (
    <div className="flex min-h-[85vh] items-center justify-center px-4 py-12">
      <div className="w-full max-w-md rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827] p-8 shadow-2xl backdrop-blur-xl">
        
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-slate-950 shadow-md shadow-emerald-500/25">
            <BookOpen className="h-6 w-6 stroke-[2.2]" />
          </div>
          <h1 className="mt-4 text-2xl font-black text-slate-900 dark:text-white">
            Create Reader Account
          </h1>
          <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400">
            Join BookNook to borrow classics, rate books, and share personal editions.
          </p>
        </div>

        {/* In-Form Error Alert */}
        {formError && (
          <div className="mt-6 flex items-center gap-2.5 rounded-2xl bg-rose-500/10 border border-rose-500/25 p-3.5 text-xs text-rose-500 dark:text-rose-400 animate-in fade-in">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{formError}</span>
          </div>
        )}

        {/* Registration Form */}
        <form onSubmit={handleRegister} className="mt-6 space-y-4">
          {/* Name Field */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              Full Name
            </label>
            <div className="relative">
              <UserIcon className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
              <input
                type="text"
                required
                placeholder="Jonathan Biswas"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-2xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 py-3 pl-10 pr-4 text-xs font-medium text-slate-900 dark:text-white placeholder:text-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-all"
              />
            </div>
          </div>

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
                placeholder="reader@booknook.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-2xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 py-3 pl-10 pr-4 text-xs font-medium text-slate-900 dark:text-white placeholder:text-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-all"
              />
            </div>
          </div>

          {/* Password Field */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
              <input
                type="password"
                required
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-2xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 py-3 pl-10 pr-4 text-xs font-medium text-slate-900 dark:text-white placeholder:text-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-all"
              />
            </div>

            {/* Password Validation Requirements List */}
            <div className="mt-3 space-y-1.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/60 p-3 text-[11px]">
              <p className="font-bold text-slate-600 dark:text-slate-300 mb-1">
                Password Security Rules:
              </p>
              <div className="flex items-center gap-2">
                {hasUpperCase ? (
                  <Check className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                ) : (
                  <X className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                )}
                <span className={hasUpperCase ? "text-emerald-600 dark:text-emerald-400 font-semibold" : "text-slate-500 dark:text-slate-400"}>
                  Must have an Uppercase letter (A-Z)
                </span>
              </div>
              <div className="flex items-center gap-2">
                {hasLowerCase ? (
                  <Check className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                ) : (
                  <X className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                )}
                <span className={hasLowerCase ? "text-emerald-600 dark:text-emerald-400 font-semibold" : "text-slate-500 dark:text-slate-400"}>
                  Must have a Lowercase letter (a-z)
                </span>
              </div>
              <div className="flex items-center gap-2">
                {hasMinLength ? (
                  <Check className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                ) : (
                  <X className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                )}
                <span className={hasMinLength ? "text-emerald-600 dark:text-emerald-400 font-semibold" : "text-slate-500 dark:text-slate-400"}>
                  Length must be at least 6 characters
                </span>
              </div>
            </div>
          </div>

          {/* Register Button */}
          <button
            type="submit"
            disabled={loading}
            className={`mt-2 flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-400 py-3.5 text-sm font-bold text-slate-950 shadow-md shadow-emerald-500/20 hover:shadow-emerald-500/40 hover:scale-[1.01] transition-all cursor-pointer ${
              loading ? "opacity-60 cursor-not-allowed" : ""
            }`}
          >
            <span>{loading ? "Creating Account..." : "Register Account"}</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </form>

        {/* Divider */}
        <div className="relative my-6 flex items-center justify-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200 dark:border-slate-800" />
          </div>
          <span className="relative bg-white dark:bg-[#111827] px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400">
            or sign up with
          </span>
        </div>

        {/* Social Login Buttons (Google & GitHub) */}
        <SocialButtons redirectUrl="/" />

        {/* Link to Login */}
        <p className="mt-6 text-center text-xs text-slate-500 dark:text-slate-400">
          Already have a BookNook account?{" "}
          <Link
            href="/login"
            className="font-bold text-emerald-600 dark:text-emerald-400 hover:underline"
          >
            Login Here
          </Link>
        </p>
      </div>
    </div>
  );
}
