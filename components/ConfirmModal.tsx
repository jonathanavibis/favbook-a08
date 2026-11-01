"use client";

import { AlertTriangle, X } from "lucide-react";

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  isDestructive?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  loading?: boolean;
}

export default function ConfirmModal({
  isOpen,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  isDestructive = true,
  onConfirm,
  onCancel,
  loading = false,
}: ConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-md rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827] p-6 shadow-2xl animate-in zoom-in-95">
        <div className="flex items-center justify-between pb-3">
          <div className="flex items-center gap-3">
            <div
              className={`flex h-10 w-10 items-center justify-center rounded-2xl ${
                isDestructive
                  ? "bg-rose-500/10 text-rose-500"
                  : "bg-emerald-500/10 text-emerald-500"
              }`}
            >
              <AlertTriangle className="h-5 w-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              {title}
            </h3>
          </div>
          <button
            onClick={onCancel}
            disabled={loading}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <p className="py-3 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
          {message}
        </p>

        <div className="mt-5 flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="rounded-xl border border-slate-300 dark:border-slate-700 px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className={`rounded-xl px-5 py-2 text-xs font-bold text-white shadow-md transition-all ${
              isDestructive
                ? "bg-rose-600 hover:bg-rose-700 shadow-rose-600/20"
                : "bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/20"
            } ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            {loading ? "Processing..." : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
