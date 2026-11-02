"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  BookOpen,
  User as UserIcon,
  Mail,
  Calendar,
  Layers,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Clock,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import { Book } from "@/components/BookCard";
import BorrowModal from "@/components/BorrowModal";
import LoadingSpinner from "@/components/LoadingSpinner";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "https://favbook-a08-server.vercel.app";

export default function BookDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const bookId = resolvedParams.id;

  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  const { user } = useAuth();
  const router = useRouter();
  const toast = useToast();

  useEffect(() => {
    async function fetchBook() {
      try {
        setLoading(true);
        const res = await fetch(`${API_BASE}/books/${bookId}`);
        if (res.ok) {
          const data = await res.json();
          setBook(data);
        } else {
          toast.error("Book not found in library archive.");
        }
      } catch (err) {
        console.error("Failed to load book details", err);
        toast.error("Failed to connect to the library server.");
      } finally {
        setLoading(false);
      }
    }
    fetchBook();
  }, [bookId, toast]);

  const handleBorrowClick = () => {
    if (!user) {
      toast.info("Please sign in to borrow books from BookNook.");
      router.push(`/login?redirect=/books/${bookId}`);
      return;
    }

    if (!book || book.copies <= 0) {
      toast.error("This book currently has 0 copies available.");
      return;
    }

    setModalOpen(true);
  };

  const handleBorrowSuccess = (remainingCopies: number) => {
    if (book) {
      setBook({ ...book, copies: remainingCopies });
    }
  };

  if (loading) {
    return <LoadingSpinner text="Fetching Book Specifications..." />;
  }

  if (!book) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 text-center">
        <BookOpen className="mx-auto h-12 w-12 text-slate-400" />
        <h2 className="mt-4 text-xl font-bold text-slate-900 dark:text-white">
          Book Not Found
        </h2>
        <p className="mt-2 text-xs text-slate-500">
          The requested book ID does not match any volume in our archive.
        </p>
        <Link
          href="/books"
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-5 py-2.5 text-xs font-bold text-slate-950"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to All Books</span>
        </Link>
      </div>
    );
  }

  const isAvailable = book.copies > 0;

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-8">
      {/* Back Button */}
      <div>
        <Link
          href="/books"
          className="inline-flex items-center gap-2 rounded-xl border border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:border-emerald-500 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to All Books</span>
        </Link>
      </div>

      {/* Main Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827] p-6 sm:p-10 lg:p-12 shadow-xl">
        
        {/* Left Column: Book Cover Image */}
        <div className="lg:col-span-5 flex flex-col items-center">
          <div className="relative aspect-[3/4] w-full max-w-sm overflow-hidden rounded-2xl shadow-2xl border border-slate-200/80 dark:border-slate-800 bg-slate-100 dark:bg-slate-900">
            <img
              src={book.image}
              alt={book.title}
              className="h-full w-full object-cover object-center"
            />
            {/* Category Tag */}
            <div className="absolute top-4 left-4">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-900/85 px-3.5 py-1 text-xs font-bold text-emerald-400 border border-emerald-500/30 backdrop-blur-md">
                <Sparkles className="h-3 w-3" />
                {book.category}
              </span>
            </div>
          </div>
        </div>

        {/* Right Column: Book Information & Borrow Action */}
        <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                Author &bull; {book.author}
              </p>
              <h1 className="mt-1 text-2xl sm:text-4xl font-black text-slate-900 dark:text-white leading-tight">
                {book.title}
              </h1>
            </div>

            {/* Copies Count & Availability Status */}
            <div className="flex items-center gap-3">
              <div
                className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold border ${
                  isAvailable
                    ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30"
                    : "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30"
                }`}
              >
                <Layers className="h-4 w-4" />
                <span>
                  {isAvailable ? `${book.copies} Copies Available` : "Not Available (0 Copies Left)"}
                </span>
              </div>

              <div className="inline-flex items-center gap-1.5 rounded-xl bg-slate-100 dark:bg-slate-800/80 px-3.5 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300">
                <Clock className="h-3.5 w-3.5 text-slate-400" />
                <span>7-Day Standard Loan</span>
              </div>
            </div>

            {/* Book Description */}
            <div className="border-t border-slate-100 dark:border-slate-800 pt-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                Synopsis &amp; Details
              </h3>
              <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                {book.description}
              </p>
            </div>

            {/* Contributor / Added By Meta */}
            <div className="rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 p-4 space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Library Contributor Information
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                  <UserIcon className="h-4 w-4 text-emerald-500 shrink-0" />
                  <span className="truncate">Added by: <strong>{book.userName || "Librarian"}</strong></span>
                </div>
                <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                  <Mail className="h-4 w-4 text-emerald-500 shrink-0" />
                  <span className="truncate">Email: <strong>{book.userEmail || "catalog@bookhype.com"}</strong></span>
                </div>
                {book.createdAt && (
                  <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300 sm:col-span-2">
                    <Calendar className="h-4 w-4 text-emerald-500 shrink-0" />
                    <span>Catalogued on: <strong>{new Date(book.createdAt).toLocaleDateString()}</strong></span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Borrow Action Button & Rules Banner */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-emerald-500" />
              <span>Instant Digital Checkout &bull; Double-Borrow Prevention Active</span>
            </div>

            {/* Borrow This Book Button */}
            <button
              onClick={handleBorrowClick}
              disabled={!isAvailable}
              className={`w-full sm:w-auto inline-flex items-center justify-center gap-2.5 rounded-2xl px-8 py-3.5 text-sm font-bold shadow-lg transition-all ${
                isAvailable
                  ? "bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 shadow-emerald-500/25 hover:shadow-emerald-500/40 hover:scale-[1.02] cursor-pointer"
                  : "bg-slate-300 dark:bg-slate-800 text-slate-500 dark:text-slate-400 cursor-not-allowed shadow-none"
              }`}
            >
              <BookOpen className="h-4 w-4" />
              <span>{isAvailable ? "Borrow This Book" : "Not Available"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Borrow Modal Form */}
      {modalOpen && book && (
        <BorrowModal
          isOpen={modalOpen}
          book={book}
          onClose={() => setModalOpen(false)}
          onSuccess={handleBorrowSuccess}
        />
      )}
    </div>
  );
}
