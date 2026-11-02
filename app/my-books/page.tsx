"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  BookMarked,
  Edit3,
  Trash2,
  PlusCircle,
  X,
  Layers,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import { Book } from "@/components/BookCard";
import ConfirmModal from "@/components/ConfirmModal";
import LoadingSpinner from "@/components/LoadingSpinner";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "https://favbook-a08-server.vercel.app";
const CATEGORIES = ["Fiction", "Science", "History", "Kids", "Others"];

export default function MyBooksPage() {
  const { user, loading: authLoading, getAuthHeaders } = useAuth();
  const router = useRouter();
  const toast = useToast();

  const [myBooks, setMyBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  // Edit Modal State
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editAuthor, setEditAuthor] = useState("");
  const [editCategory, setEditCategory] = useState("Fiction");
  const [editImage, setEditImage] = useState("");
  const [editCopies, setEditCopies] = useState(1);
  const [editDescription, setEditDescription] = useState("");
  const [updating, setUpdating] = useState(false);

  // Delete Confirm Modal State
  const [deletingBook, setDeletingBook] = useState<Book | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Auth Protection
  useEffect(() => {
    if (!authLoading && !user) {
      toast.info("Please sign in to manage your contributed books.");
      router.push("/login?redirect=/my-books");
    }
  }, [user, authLoading, router, toast]);

  const loadMyBooks = useCallback(async () => {
    if (!user?.email) return;
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/books?userEmail=${encodeURIComponent(user.email)}`);
      if (res.ok) {
        const data = await res.json();
        setMyBooks(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      console.error("Failed to fetch user books", err);
      toast.error("Failed to load your books archive.");
    } finally {
      setLoading(false);
    }
  }, [user?.email, toast]);

  useEffect(() => {
    if (user?.email) {
      loadMyBooks();
    }
  }, [user?.email, loadMyBooks]);

  // Open Edit Modal
  const handleOpenEdit = (book: Book) => {
    setEditingBook(book);
    setEditTitle(book.title);
    setEditAuthor(book.author);
    setEditCategory(book.category);
    setEditImage(book.image);
    setEditCopies(book.copies);
    setEditDescription(book.description);
  };

  // Submit Edit Form
  const handleUpdateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBook) return;

    setUpdating(true);
    try {
      const res = await fetch(`${API_BASE}/books/${editingBook._id}`, {
        method: "PATCH",
        headers: getAuthHeaders(),
        body: JSON.stringify({
          title: editTitle,
          author: editAuthor,
          category: editCategory,
          image: editImage,
          copies: Number(editCopies),
          description: editDescription,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        toast.error(data.message || "Failed to update book.");
        setUpdating(false);
        return;
      }

      toast.success(data.message || `"${editTitle}" updated successfully!`);
      setEditingBook(null);
      loadMyBooks();
    } catch (err) {
      console.error("Update book error", err);
      toast.error("Network error while updating book.");
    } finally {
      setUpdating(false);
    }
  };

  // Confirm Delete
  const handleConfirmDelete = async () => {
    if (!deletingBook) return;

    setDeleting(true);
    try {
      const res = await fetch(`${API_BASE}/books/${deletingBook._id}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        toast.error(data.message || "Failed to delete book.");
        setDeleting(false);
        return;
      }

      toast.success(data.message || "Book deleted from library.");
      setDeletingBook(null);
      setMyBooks((prev) => prev.filter((b) => b._id !== deletingBook._id));
    } catch (err) {
      console.error("Delete book error", err);
      toast.error("Network error while deleting book.");
    } finally {
      setDeleting(false);
    }
  };

  if (authLoading) {
    return <LoadingSpinner text="Checking Reader Identity..." />;
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
            <BookMarked className="h-4 w-4" />
            Personal Library Dashboard
          </span>
          <h1 className="mt-1 text-2xl sm:text-4xl font-black text-slate-900 dark:text-white">
            My Contributed Books
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Manage your personal additions, update book specifications, and monitor catalog inventory.
          </p>
        </div>

        <Link
          href="/add-book"
          className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-400 px-5 py-3 text-xs font-bold text-slate-950 shadow-md shadow-emerald-500/20 hover:shadow-emerald-500/35 transition-all w-fit"
        >
          <PlusCircle className="h-4 w-4" />
          <span>Add New Book</span>
        </Link>
      </div>

      {/* Content */}
      {loading ? (
        <LoadingSpinner text="Loading Your Contributions..." />
      ) : myBooks.length > 0 ? (
        <div className="overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827] shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                <tr>
                  <th className="px-6 py-4">Book Details</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Available Copies</th>
                  <th className="px-6 py-4">Catalogued Date</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                {myBooks.map((book) => (
                  <tr key={book._id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
                    {/* Book Cover + Title */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3.5">
                        <img
                          src={book.image}
                          alt={book.title}
                          className="h-16 w-12 rounded-lg object-cover border border-slate-200 dark:border-slate-700 shadow-sm shrink-0"
                        />
                        <div>
                          <Link
                            href={`/books/${book._id}`}
                            className="font-bold text-slate-900 dark:text-white hover:text-emerald-500 text-sm line-clamp-1 transition-colors"
                          >
                            {book.title}
                          </Link>
                          <p className="text-slate-500 dark:text-slate-400 text-xs mt-0.5">
                            by {book.author}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center rounded-full bg-emerald-500/10 px-3 py-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                        {book.category}
                      </span>
                    </td>

                    {/* Copies */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-1.5 font-bold text-slate-700 dark:text-slate-300">
                        <Layers className="h-4 w-4 text-emerald-500" />
                        <span>{book.copies} Copies</span>
                      </div>
                    </td>

                    {/* Date */}
                    <td className="px-6 py-4 whitespace-nowrap text-slate-500 dark:text-slate-400">
                      {book.createdAt ? new Date(book.createdAt).toLocaleDateString() : "Recent"}
                    </td>

                    {/* Actions: Edit & Delete buttons */}
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenEdit(book)}
                          className="inline-flex items-center gap-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:border-emerald-500 hover:text-emerald-500 transition-all"
                        >
                          <Edit3 className="h-3.5 w-3.5" />
                          <span>Edit</span>
                        </button>

                        <button
                          onClick={() => setDeletingBook(book)}
                          className="inline-flex items-center gap-1.5 rounded-xl border border-rose-300 dark:border-rose-900/60 bg-rose-50 dark:bg-rose-950/30 px-3 py-1.5 text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-600 hover:text-white transition-all"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          <span>Delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827] p-16 text-center shadow-sm">
          <BookMarked className="mx-auto h-12 w-12 text-slate-400" />
          <h3 className="mt-4 text-lg font-bold text-slate-900 dark:text-white">
            You Haven&apos;t Contributed Any Books Yet
          </h3>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
            Share your books with the community! Every title you add can be discovered and borrowed by readers.
          </p>
          <Link
            href="/add-book"
            className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-emerald-500 px-6 py-3 text-xs font-bold text-slate-950 shadow-md shadow-emerald-500/20"
          >
            <PlusCircle className="h-4 w-4" />
            <span>Add Your First Book</span>
          </Link>
        </div>
      )}

      {/* Edit Book Modal */}
      {editingBook && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm animate-in fade-in overflow-y-auto">
          <div className="w-full max-w-lg rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827] p-6 shadow-2xl my-8">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Edit3 className="h-5 w-5 text-emerald-500" />
                Edit Book Information
              </h3>
              <button
                onClick={() => setEditingBook(null)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateSubmit} className="mt-5 space-y-4 text-left">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Book Title
                </label>
                <input
                  type="text"
                  required
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 py-2.5 px-3.5 text-xs font-medium text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Author
                  </label>
                  <input
                    type="text"
                    required
                    value={editAuthor}
                    onChange={(e) => setEditAuthor(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 py-2.5 px-3.5 text-xs font-medium text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Category
                  </label>
                  <select
                    value={editCategory}
                    onChange={(e) => setEditCategory(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 py-2.5 px-3.5 text-xs font-semibold text-slate-900 dark:text-white"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Total Copies
                  </label>
                  <input
                    type="number"
                    min={0}
                    required
                    value={editCopies}
                    onChange={(e) => setEditCopies(parseInt(e.target.value) || 0)}
                    className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 py-2.5 px-3.5 text-xs font-bold text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Image URL
                  </label>
                  <input
                    type="url"
                    required
                    value={editImage}
                    onChange={(e) => setEditImage(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 py-2.5 px-3.5 text-xs font-medium text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  required
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 p-3 text-xs font-medium text-slate-900 dark:text-white"
                />
              </div>

              <div className="mt-5 flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditingBook(null)}
                  disabled={updating}
                  className="rounded-xl border border-slate-300 dark:border-slate-700 px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updating}
                  className="rounded-xl bg-emerald-500 hover:bg-emerald-600 px-6 py-2 text-xs font-bold text-slate-950 shadow-md"
                >
                  {updating ? "Saving Changes..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal (Custom Modal, NOT window.confirm) */}
      {deletingBook && (
        <ConfirmModal
          isOpen={!!deletingBook}
          title="Delete Book from Library"
          message={`Are you sure you want to delete "${deletingBook.title}"? This will permanently remove the volume and its inventory records from BookNook.`}
          confirmText="Yes, Delete Book"
          cancelText="Keep Book"
          isDestructive={true}
          loading={deleting}
          onConfirm={handleConfirmDelete}
          onCancel={() => setDeletingBook(null)}
        />
      )}
    </div>
  );
}
