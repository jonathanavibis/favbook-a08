"use client";

import Link from "next/link";
import { ArrowRight, BookOpen, Layers } from "lucide-react";

export interface Book {
  _id: string;
  title: string;
  author: string;
  category: "Fiction" | "Science" | "History" | "Kids" | "Others" | string;
  image: string;
  description: string;
  copies: number;
  userName?: string;
  userEmail?: string;
  rating?: number;
  createdAt?: string;
}

const categoryColors: Record<string, string> = {
  Fiction: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
  Science: "bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/20",
  History: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
  Kids: "bg-pink-500/10 text-pink-600 dark:text-pink-400 border-pink-500/20",
  Others: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
};

export default function BookCard({ book }: { book: Book }) {
  const badgeStyle = categoryColors[book.category] || categoryColors.Others;
  const isAvailable = book.copies > 0;

  return (
    <div className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827] shadow-sm hover:shadow-xl dark:hover:shadow-emerald-950/20 transition-all duration-300 hover:-translate-y-1">
      {/* Book Cover Image Area */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-slate-100 dark:bg-slate-900">
        <img
          src={book.image || "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=600&auto=format&fit=crop&q=80"}
          alt={book.title}
          className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
          onError={(e) => {
            // Fallback image if broken
            (e.target as HTMLImageElement).src =
              "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=600&auto=format&fit=crop&q=80";
          }}
        />

        {/* Category Pill Tag */}
        <div className="absolute top-3 left-3">
          <span
            className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wider backdrop-blur-md border ${badgeStyle}`}
          >
            {book.category}
          </span>
        </div>

        {/* Copies Availability Tag */}
        <div className="absolute top-3 right-3">
          <span
            className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold backdrop-blur-md ${
              isAvailable
                ? "bg-emerald-500/90 text-slate-950 shadow-sm"
                : "bg-rose-500/90 text-white shadow-sm"
            }`}
          >
            <Layers className="h-3 w-3" />
            {isAvailable ? `${book.copies} Copies` : "Not Available"}
          </span>
        </div>
      </div>

      {/* Book Metadata Area */}
      <div className="flex flex-1 flex-col justify-between p-5">
        <div>
          <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
            by {book.author}
          </p>
          <h3 className="mt-1 line-clamp-1 text-base font-bold text-slate-900 dark:text-white group-hover:text-emerald-500 transition-colors">
            {book.title}
          </h3>
          <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
            {book.description}
          </p>
        </div>

        {/* View Details Action Button */}
        <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
          <span className="text-[11px] font-medium text-slate-400">
            {isAvailable ? "Ready to Borrow" : "Currently Checked Out"}
          </span>
          <Link
            href={`/books/${book._id}`}
            className="inline-flex items-center gap-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 px-4 py-2 text-xs font-bold text-slate-800 dark:text-slate-200 hover:bg-emerald-500 hover:text-slate-950 dark:hover:bg-emerald-500 dark:hover:text-slate-950 transition-all"
          >
            <span>View Details</span>
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
