"use client";

import Link from "next/link";
import { ArrowRight, BookOpen, Layers } from "lucide-react";
import { motion } from "framer-motion";

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
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -6, transition: { duration: 0.2 } }}
      className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827] shadow-sm hover:shadow-xl dark:hover:shadow-emerald-950/20 transition-all duration-300"
    >
      {/* Book Cover Image Area */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-slate-100 dark:bg-slate-900">
        <img
          src={book.image || "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=600&auto=format&fit=crop&q=80"}
          alt={book.title}
          className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
          onError={(e) => {
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
                ? "bg-slate-900/80 text-emerald-400 border border-emerald-500/30"
                : "bg-rose-950/80 text-rose-400 border border-rose-500/30"
            }`}
          >
            <Layers className="h-3 w-3" />
            <span>{isAvailable ? `${book.copies} Copies` : "Not Available"}</span>
          </span>
        </div>
      </div>

      {/* Book Information Content */}
      <div className="flex flex-1 flex-col justify-between p-5">
        <div>
          <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
            by {book.author}
          </p>
          <h3 className="mt-1 text-base font-bold text-slate-900 dark:text-white line-clamp-1 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
            {book.title}
          </h3>
          <p className="mt-2 text-xs leading-relaxed text-slate-500 dark:text-slate-400 line-clamp-2">
            {book.description}
          </p>
        </div>

        {/* View Details Action Button */}
        <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
          <Link
            href={`/books/${book._id}`}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-100 dark:bg-slate-800/80 py-2.5 text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:bg-emerald-500 group-hover:text-slate-950 dark:group-hover:bg-emerald-500 dark:group-hover:text-slate-950 transition-all"
          >
            <BookOpen className="h-3.5 w-3.5" />
            <span>View Details</span>
            <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
