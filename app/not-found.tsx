import Link from "next/link";
import { BookX, Home, ArrowLeft } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "BookHype | 404 Not Found",
};

export default function NotFound() {
  return (
    <div className="flex min-h-[75vh] flex-col items-center justify-center px-4 py-16 text-center">
      <div className="relative flex items-center justify-center">
        <div className="h-28 w-28 rounded-3xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-500">
          <BookX className="h-14 w-14 stroke-[1.8]" />
        </div>
      </div>

      <h1 className="mt-8 text-4xl sm:text-5xl font-black text-slate-900 dark:text-white">
        404 — Page Not Found
      </h1>

      <p className="mt-3 max-w-md text-sm sm:text-base text-slate-500 dark:text-slate-400 leading-relaxed">
        Oops! The book chapter or library shelf you were searching for has either been relocated or never existed in our catalogue.
      </p>

      <div className="mt-8 flex items-center gap-4">
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-400 px-6 py-3.5 text-sm font-bold text-slate-950 shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 hover:scale-[1.02] transition-all"
        >
          <Home className="h-4 w-4" />
          <span>Back to Home</span>
        </Link>
        <Link
          href="/books"
          className="inline-flex items-center gap-2 rounded-2xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-6 py-3.5 text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Browse All Books</span>
        </Link>
      </div>
    </div>
  );
}
