"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  BookCheck,
  Calendar,
  RotateCcw,
  Library,
  ArrowRight,
  Sparkles,
  CheckCircle2,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import ConfirmModal from "@/components/ConfirmModal";
import LoadingSpinner from "@/components/LoadingSpinner";

export interface BorrowRecord {
  _id: string;
  bookId: {
    _id: string;
    title: string;
    author: string;
    image: string;
    copies: number;
    category: string;
  } | string;
  bookTitle: string;
  bookImage: string;
  userEmail: string;
  userName: string;
  borrowDate: string;
  returnDate: string;
  status: "borrowed" | "returned";
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "https://bookhive-server-a08.vercel.app";

export default function MyBorrowsPage() {
  const { user, loading: authLoading, getAuthHeaders } = useAuth();
  const router = useRouter();
  const toast = useToast();

  const [borrows, setBorrows] = useState<BorrowRecord[]>([]);
  const [loading, setLoading] = useState(true);

  // Return Book Confirmation Modal
  const [returningRecord, setReturningRecord] = useState<BorrowRecord | null>(null);
  const [returning, setReturning] = useState(false);

  // Auth Protection
  useEffect(() => {
    if (!authLoading && !user) {
      toast.info("Please sign in to view your borrowed books.");
      router.push("/login?redirect=/my-borrows");
    }
  }, [user, authLoading, router, toast]);

  const loadBorrows = useCallback(async () => {
    if (!user?.email) return;

    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/borrows`, {
        headers: getAuthHeaders(),
      });

      if (res.ok) {
        const data = await res.json();
        setBorrows(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      console.error("Failed to fetch borrows", err);
      toast.error("Failed to load your borrow history.");
    } finally {
      setLoading(false);
    }
  }, [user?.email, getAuthHeaders, toast]);

  useEffect(() => {
    if (user?.email) {
      loadBorrows();
    }
  }, [user?.email, loadBorrows]);

  // Handle Returning Book
  const handleConfirmReturn = async () => {
    if (!returningRecord) return;

    setReturning(true);
    try {
      const res = await fetch(`${API_BASE}/borrows/${returningRecord._id}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        toast.error(data.message || "Failed to process book return.");
        setReturning(false);
        return;
      }

      toast.success(
        data.message || `"${returningRecord.bookTitle}" has been returned! 1 copy added back to library.`
      );
      setReturningRecord(null);
      setBorrows((prev) => prev.filter((b) => b._id !== returningRecord._id));
    } catch (err) {
      console.error("Return error", err);
      toast.error("Network error while returning book.");
    } finally {
      setReturning(false);
    }
  };

  if (authLoading) {
    return <LoadingSpinner text="Checking Reader Borrow Records..." />;
  }

  if (!user) {
    return null;
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
            <BookCheck className="h-4 w-4" />
            Reader Loan Ledger
          </span>
          <h1 className="mt-1 text-2xl sm:text-4xl font-black text-slate-900 dark:text-white">
            My Borrowed Books
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Manage your currently borrowed volumes, track scheduled return dates, and return books to replenish stock.
          </p>
        </div>

        <Link
          href="/books"
          className="inline-flex items-center gap-2 rounded-2xl bg-slate-100 dark:bg-slate-800 px-5 py-3 text-xs font-bold text-slate-800 dark:text-slate-200 hover:bg-emerald-500 hover:text-slate-950 transition-all w-fit"
        >
          <Library className="h-4 w-4" />
          <span>Browse More Books</span>
        </Link>
      </div>

      {/* Borrowed Books Table */}
      {loading ? (
        <LoadingSpinner text="Retrieving Active Borrows..." />
      ) : borrows.length > 0 ? (
        <div className="overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827] shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                <tr>
                  <th className="px-6 py-4">Book</th>
                  <th className="px-6 py-4">Borrow Date</th>
                  <th className="px-6 py-4">Return Due Date</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                {borrows.map((record) => {
                  const targetBookId =
                    typeof record.bookId === "object" && record.bookId !== null
                      ? record.bookId._id
                      : record.bookId;

                  return (
                    <tr
                      key={record._id}
                      className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors"
                    >
                      {/* Image & Title */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3.5">
                          <img
                            src={record.bookImage}
                            alt={record.bookTitle}
                            className="h-16 w-12 rounded-lg object-cover border border-slate-200 dark:border-slate-700 shadow-sm shrink-0"
                          />
                          <div>
                            <Link
                              href={`/books/${targetBookId}`}
                              className="font-bold text-slate-900 dark:text-white hover:text-emerald-500 text-sm line-clamp-1 transition-colors"
                            >
                              {record.bookTitle}
                            </Link>
                            <p className="text-slate-400 text-xs mt-0.5">
                              Borrowed by {record.userName}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Borrow Date */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
                          <Calendar className="h-3.5 w-3.5 text-emerald-500" />
                          <span>{new Date(record.borrowDate).toLocaleDateString()}</span>
                        </div>
                      </td>

                      {/* Return Due Date */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-1.5 font-bold text-slate-800 dark:text-slate-200">
                          <Calendar className="h-3.5 w-3.5 text-amber-500" />
                          <span>{new Date(record.returnDate).toLocaleDateString()}</span>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-3 py-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                          <CheckCircle2 className="h-3 w-3" />
                          Active Loan
                        </span>
                      </td>

                      {/* Return Book Action Button */}
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <button
                          onClick={() => setReturningRecord(record)}
                          className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 px-4 py-2 text-xs font-bold text-slate-950 shadow-md shadow-emerald-500/20 hover:shadow-emerald-500/35 hover:scale-[1.02] transition-all"
                        >
                          <RotateCcw className="h-3.5 w-3.5" />
                          <span>Return Book</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827] p-16 text-center shadow-sm">
          <BookCheck className="mx-auto h-12 w-12 text-slate-400" />
          <h3 className="mt-4 text-lg font-bold text-slate-900 dark:text-white">
            No Active Book Borrows
          </h3>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
            Your bookshelf is currently clear. Explore the library catalog to borrow your next read!
          </p>
          <Link
            href="/books"
            className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-emerald-500 px-6 py-3 text-xs font-bold text-slate-950 shadow-md shadow-emerald-500/20"
          >
            <Library className="h-4 w-4" />
            <span>Browse Library Catalog</span>
          </Link>
        </div>
      )}

      {/* Return Book Confirmation Modal */}
      {returningRecord && (
        <ConfirmModal
          isOpen={!!returningRecord}
          title="Return Borrowed Book"
          message={`Are you ready to return "${returningRecord.bookTitle}"? This will complete your loan and restore 1 copy back into the BookNook public archive.`}
          confirmText="Yes, Return Book"
          cancelText="Keep Reading"
          isDestructive={false}
          loading={returning}
          onConfirm={handleConfirmReturn}
          onCancel={() => setReturningRecord(null)}
        />
      )}
    </div>
  );
}
