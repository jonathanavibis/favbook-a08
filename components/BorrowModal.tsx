"use client";

import { useState } from "react";
import { X, Calendar, User as UserIcon, Mail, BookOpen, AlertCircle } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import { Book } from "./BookCard";

interface BorrowModalProps {
  isOpen: boolean;
  book: Book;
  onClose: () => void;
  onSuccess: (remainingCopies: number) => void;
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "https://favbook-a08-server.vercel.app";

export default function BorrowModal({
  isOpen,
  book,
  onClose,
  onSuccess,
}: BorrowModalProps) {
  const { user, getAuthHeaders } = useAuth();
  const toast = useToast();

  // Default return date set to 7 days from now
  const defaultReturn = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    .toISOString()
    .split("T")[0];

  const [returnDate, setReturnDate] = useState(defaultReturn);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!user) {
      toast.error("You must be signed in to borrow books.");
      return;
    }

    if (!returnDate) {
      setErrorMessage("Please select a valid return date.");
      return;
    }

    const todayStr = new Date().toISOString().split("T")[0];
    if (returnDate < todayStr) {
      setErrorMessage("Return date cannot be in the past.");
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch(`${API_BASE}/borrows`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({
          bookId: book._id,
          returnDate,
          userEmail: user.email,
          userName: user.name,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        const errorMsg = data.message || "Failed to borrow this book.";
        setErrorMessage(errorMsg);
        toast.error(errorMsg);
        setSubmitting(false);
        return;
      }

      toast.success(data.message || `Successfully borrowed "${book.title}"!`);
      onSuccess(data.remainingCopies ?? Math.max(0, book.copies - 1));
      onClose();
    } catch (err: unknown) {
      console.error("Borrow error", err);
      const netMsg = "Network error: Unable to submit borrow request to library server.";
      setErrorMessage(netMsg);
      toast.error(netMsg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-lg rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827] p-6 shadow-2xl animate-in zoom-in-95">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-500">
              <BookOpen className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Borrow Confirmation
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                BookNook Digital Checkout
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={submitting}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Selected Book Mini Card */}
        <div className="mt-4 flex items-center gap-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800 p-3">
          <img
            src={book.image}
            alt={book.title}
            className="h-16 w-12 rounded-lg object-cover"
          />
          <div className="min-w-0 flex-1">
            <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate">
              {book.title}
            </h4>
            <p className="text-xs text-emerald-600 dark:text-emerald-400 truncate">
              by {book.author}
            </p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
              Available Copies: <span className="font-bold text-slate-700 dark:text-slate-200">{book.copies}</span>
            </p>
          </div>
        </div>

        {/* Error Notification */}
        {errorMessage && (
          <div className="mt-4 flex items-center gap-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20 p-3 text-xs text-rose-500">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Borrow Form */}
        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          {/* Reader Name (Read Only) */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Borrower Name
            </label>
            <div className="relative">
              <UserIcon className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
              <input
                type="text"
                readOnly
                value={user?.name || ""}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900/80 py-2.5 pl-10 pr-4 text-xs font-semibold text-slate-600 dark:text-slate-300 cursor-not-allowed"
              />
            </div>
          </div>

          {/* Reader Email (Read Only) */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Borrower Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
              <input
                type="email"
                readOnly
                value={user?.email || ""}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900/80 py-2.5 pl-10 pr-4 text-xs font-semibold text-slate-600 dark:text-slate-300 cursor-not-allowed"
              />
            </div>
          </div>

          {/* Return Date Picker */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Scheduled Return Date
            </label>
            <div className="relative">
              <Calendar className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
              <input
                type="date"
                required
                value={returnDate}
                onChange={(e) => setReturnDate(e.target.value)}
                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#111827] py-2.5 pl-10 pr-4 text-xs font-medium text-slate-900 dark:text-white focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>
            <p className="mt-1 text-[11px] text-slate-400">
              Default borrowing period is 7 days. You may return anytime.
            </p>
          </div>

          {/* Actions */}
          <div className="mt-6 flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="rounded-xl border border-slate-300 dark:border-slate-700 px-4 py-2.5 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className={`rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 px-6 py-2.5 text-xs font-bold text-slate-950 shadow-md shadow-emerald-500/20 hover:shadow-emerald-500/35 hover:scale-[1.02] transition-all ${
                submitting ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {submitting ? "Processing Borrow..." : "Confirm Borrow"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
