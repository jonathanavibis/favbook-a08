"use client";

import { useEffect, useState, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Search, Filter, BookOpen, Layers } from "lucide-react";
import BookCard, { Book } from "@/components/BookCard";
import LoadingSpinner from "@/components/LoadingSpinner";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "https://favbook-a08-server.vercel.app";

const CATEGORIES = ["All", "Fiction", "Science", "History", "Kids", "Others"];

function BooksCatalog() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category") || "All";

  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    async function loadBooks() {
      try {
        setLoading(true);
        const res = await fetch(`${API_BASE}/books`);
        if (res.ok) {
          const data = await res.json();
          setBooks(Array.isArray(data) ? data : []);
        }
      } catch (err) {
        console.error("Failed to load catalog", err);
      } finally {
        setLoading(false);
      }
    }
    loadBooks();
  }, []);

  // Sync category param if changes in URL
  useEffect(() => {
    const cat = searchParams.get("category");
    if (cat) {
      setSelectedCategory(cat);
    }
  }, [searchParams]);

  // Client-side search and category filtering
  const filteredBooks = useMemo(() => {
    return books.filter((book) => {
      const matchesCategory =
        selectedCategory === "All" ||
        book.category.toLowerCase() === selectedCategory.toLowerCase();

      const matchesSearch =
        searchTerm.trim() === "" ||
        book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.author.toLowerCase().includes(searchTerm.toLowerCase());

      return matchesCategory && matchesSearch;
    });
  }, [books, selectedCategory, searchTerm]);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-8">
      {/* Page Header */}
      <div className="text-center max-w-2xl mx-auto">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
          <BookOpen className="h-3.5 w-3.5" />
          Complete Library Archive
        </span>
        <h1 className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
          Browse All Books
        </h1>
        <p className="mt-2 text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
          Search, filter by genre, check copy counts, and read book summaries across our community library.
        </p>
      </div>

      {/* Search & Category Filter Controls */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827] p-4 sm:p-5 shadow-sm">
        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none">
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory.toLowerCase() === cat.toLowerCase();
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`
                  rounded-full px-4 py-2 text-xs font-bold transition-all whitespace-nowrap
                  ${
                    isSelected
                      ? "bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20 scale-[1.02]"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                  }
                `}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search title or author..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-2xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 py-2.5 pl-10 pr-4 text-xs font-medium text-slate-900 dark:text-white placeholder:text-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-all"
          />
        </div>
      </div>

      {/* Results Header Counter */}
      <div className="flex items-center justify-between text-xs font-semibold text-slate-500 dark:text-slate-400 px-1">
        <span>
          Showing <span className="text-slate-900 dark:text-white font-bold">{filteredBooks.length}</span> titles
          {selectedCategory !== "All" && ` in ${selectedCategory}`}
        </span>
        <span className="flex items-center gap-1">
          <Layers className="h-3.5 w-3.5 text-emerald-500" />
          Real-Time Inventory
        </span>
      </div>

      {/* Books Grid: 3 cards per row on desktop as required */}
      {loading ? (
        <LoadingSpinner text="Fetching Library Catalog..." />
      ) : filteredBooks.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredBooks.map((book) => (
            <BookCard key={book._id} book={book} />
          ))}
        </div>
      ) : (
        <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827] p-16 text-center shadow-sm">
          <BookOpen className="mx-auto h-12 w-12 text-slate-400" />
          <h3 className="mt-4 text-base font-bold text-slate-900 dark:text-white">
            No Books Found
          </h3>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            No books match the category &quot;{selectedCategory}&quot; or search query &quot;{searchTerm}&quot;.
          </p>
          <button
            onClick={() => {
              setSelectedCategory("All");
              setSearchTerm("");
            }}
            className="mt-5 rounded-xl bg-slate-100 dark:bg-slate-800 px-5 py-2.5 text-xs font-bold text-slate-800 dark:text-slate-200 hover:bg-emerald-500 hover:text-slate-950 transition-colors"
          >
            Clear Filters
          </button>
        </div>
      )}
    </div>
  );
}

export default function BooksPage() {
  return (
    <Suspense fallback={<LoadingSpinner text="Loading Library..." />}>
      <BooksCatalog />
    </Suspense>
  );
}
