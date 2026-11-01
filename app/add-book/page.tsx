"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  BookPlus,
  Image as ImageIcon,
  User as UserIcon,
  Mail,
  Layers,
  ArrowRight,
  Upload,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import LoadingSpinner from "@/components/LoadingSpinner";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
const IMGBB_API_KEY = process.env.NEXT_PUBLIC_IMGBB_API_KEY || "6d207e02198a847aa5a0a0333f443b32";

const CATEGORIES = ["Fiction", "Science", "History", "Kids", "Others"];

export default function AddBookPage() {
  const { user, loading: authLoading, getAuthHeaders } = useAuth();
  const router = useRouter();
  const toast = useToast();

  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [category, setCategory] = useState("Fiction");
  const [image, setImage] = useState("");
  const [copies, setCopies] = useState<number>(3);
  const [description, setDescription] = useState("");

  const [uploadingImage, setUploadingImage] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Authentication protection: redirect unauthenticated users to login with return redirect
  useEffect(() => {
    if (!authLoading && !user) {
      toast.info("Please sign in to access the Add Book contributor portal.");
      router.push("/login?redirect=/add-book");
    }
  }, [user, authLoading, router, toast]);

  // ImgBB Upload Handler
  const handleImageFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    setFormError(null);

    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (data.success && data.data?.url) {
        setImage(data.data.url);
        toast.success("Cover image uploaded to ImgBB successfully!");
      } else {
        toast.error("ImgBB upload failed. You can also paste an image URL directly.");
      }
    } catch (err) {
      console.error("ImgBB upload error", err);
      toast.error("Unable to upload image file. Please paste an image URL directly.");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!title || !author || !category || !image || !description) {
      const msg = "Please fill in all required book details.";
      setFormError(msg);
      toast.error(msg);
      return;
    }

    if (copies < 1) {
      const msg = "Total Copies count must be at least 1.";
      setFormError(msg);
      toast.error(msg);
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch(`${API_BASE}/books`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({
          title,
          author,
          category,
          image,
          description,
          copies: Number(copies),
          userName: user?.name,
          userEmail: user?.email,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        const errorMsg = data.message || "Failed to add book to the library archive.";
        setFormError(errorMsg);
        toast.error(errorMsg);
        setSubmitting(false);
        return;
      }

      toast.success(data.message || `"${title}" has been catalogued successfully!`);
      router.push("/books");
    } catch (err: unknown) {
      console.error("Add book error", err);
      const netMsg = "Network error: Unable to submit book to backend server.";
      setFormError(netMsg);
      toast.error(netMsg);
      setSubmitting(false);
    }
  };

  if (authLoading) {
    return <LoadingSpinner text="Checking Contributor Permissions..." />;
  }

  if (!user) {
    return null; // Will redirect via useEffect
  }

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-8">
      {/* Header */}
      <div className="text-center max-w-xl mx-auto">
        <span className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
          <BookPlus className="h-4 w-4" />
          Library Contributor Studio
        </span>
        <h1 className="mt-4 text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
          Add a New Book
        </h1>
        <p className="mt-2 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          Contribute a literary title, specify stock copies, and make it available for the BookHype community to borrow.
        </p>
      </div>

      {/* Main Form Container */}
      <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827] p-6 sm:p-10 shadow-xl">
        {formError && (
          <div className="mb-6 flex items-center gap-2.5 rounded-2xl bg-rose-500/10 border border-rose-500/25 p-4 text-xs text-rose-500 dark:text-rose-400 animate-in fade-in">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{formError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Book Title */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                Book Title <span className="text-emerald-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Sapiens: A Brief History of Humankind"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full rounded-2xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 py-3 px-4 text-xs font-medium text-slate-900 dark:text-white placeholder:text-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-all"
              />
            </div>

            {/* Author Name */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                Author Name <span className="text-emerald-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Yuval Noah Harari"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                className="w-full rounded-2xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 py-3 px-4 text-xs font-medium text-slate-900 dark:text-white placeholder:text-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Category Select Box */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                Book Category <span className="text-emerald-500">*</span>
              </label>
              <select
                required
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full rounded-2xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 py-3 px-4 text-xs font-semibold text-slate-900 dark:text-white focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-all"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Total Copies Input */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                Total Copies <span className="text-emerald-500">*</span>
              </label>
              <div className="relative">
                <Layers className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
                <input
                  type="number"
                  required
                  min={1}
                  max={100}
                  value={copies}
                  onChange={(e) => setCopies(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-full rounded-2xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 py-3 pl-10 pr-4 text-xs font-bold text-slate-900 dark:text-white focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-all"
                />
              </div>
            </div>
          </div>

          {/* Book Image: ImgBB File Upload + URL Input */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
              Book Cover Image (Upload via ImgBB or Direct URL) <span className="text-emerald-500">*</span>
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* File upload input */}
              <label className="flex flex-col items-center justify-center p-4 rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-emerald-500 bg-slate-50 dark:bg-slate-900 cursor-pointer transition-colors">
                <Upload className="h-6 w-6 text-emerald-500 mb-1" />
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-200">
                  {uploadingImage ? "Uploading to ImgBB..." : "Click to Upload Cover Image"}
                </span>
                <span className="text-[10px] text-slate-400 mt-0.5">PNG, JPG, or WEBP</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageFileUpload}
                  disabled={uploadingImage}
                  className="hidden"
                />
              </label>

              {/* URL paste input */}
              <div className="flex flex-col justify-center">
                <div className="relative">
                  <ImageIcon className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
                  <input
                    type="url"
                    required
                    placeholder="or paste image URL: https://..."
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
                    className="w-full rounded-2xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 py-3 pl-10 pr-4 text-xs font-medium text-slate-900 dark:text-white placeholder:text-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-all"
                  />
                </div>
                {image && (
                  <p className="mt-2 text-[11px] text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    Cover image ready for preview
                  </p>
                )}
              </div>
            </div>

            {/* Live Image Preview */}
            {image && (
              <div className="mt-4 flex items-center gap-4 rounded-2xl border border-slate-200 dark:border-slate-800 p-3 bg-slate-50/50 dark:bg-slate-900/50">
                <img
                  src={image}
                  alt="Cover preview"
                  className="h-20 w-16 rounded-xl object-cover border border-slate-300 dark:border-slate-700 shadow-md"
                />
                <div className="text-xs">
                  <p className="font-bold text-slate-900 dark:text-white">Cover Preview</p>
                  <p className="text-slate-400 text-[11px] truncate max-w-xs">{image}</p>
                </div>
              </div>
            )}
          </div>

          {/* Short Description */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
              Short Description <span className="text-emerald-500">*</span>
            </label>
            <textarea
              required
              rows={4}
              placeholder="Provide a compelling overview, key themes, and background of the book..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full rounded-2xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 p-4 text-xs font-medium text-slate-900 dark:text-white placeholder:text-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-all leading-relaxed"
            />
          </div>

          {/* Read-Only Contributor Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1.5">
                Contributor Name (Read-Only)
              </label>
              <div className="relative">
                <UserIcon className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  readOnly
                  value={user.name}
                  className="w-full rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900/60 py-3 pl-10 pr-4 text-xs font-semibold text-slate-600 dark:text-slate-400 cursor-not-allowed"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1.5">
                Contributor Email (Read-Only)
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
                <input
                  type="email"
                  readOnly
                  value={user.email}
                  className="w-full rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900/60 py-3 pl-10 pr-4 text-xs font-semibold text-slate-600 dark:text-slate-400 cursor-not-allowed"
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end">
            <button
              type="submit"
              disabled={submitting || uploadingImage}
              className={`flex items-center gap-2.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-400 px-8 py-3.5 text-sm font-bold text-slate-950 shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 hover:scale-[1.02] transition-all ${
                submitting || uploadingImage ? "opacity-60 cursor-not-allowed" : ""
              }`}
            >
              <span>{submitting ? "Cataloguing Book..." : "Add Book to Library"}</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
