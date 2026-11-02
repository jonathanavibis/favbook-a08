"use client";

import { BookOpen } from "lucide-react";

export default function LoadingSpinner({ text = "Loading BookNook Archive..." }: { text?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 min-h-[350px]">
      <div className="relative flex items-center justify-center">
        {/* Outer pulse ring */}
        <div className="absolute h-16 w-16 rounded-full border-4 border-emerald-500/20 border-t-emerald-500 animate-spin" />
        {/* Inner book icon */}
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-500">
          <BookOpen className="h-5 w-5 animate-pulse" />
        </div>
      </div>
      <p className="mt-5 text-sm font-semibold tracking-wide text-slate-500 dark:text-slate-400 animate-pulse">
        {text}
      </p>
    </div>
  );
}
