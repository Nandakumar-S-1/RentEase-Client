import React from "react";
import { X } from "lucide-react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  isDestructive?: boolean;
  isLoading?: boolean;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = "Confirm",
  cancelText = "Cancel",
  isDestructive = false,
  isLoading = false,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 transition-all duration-300">
      <div className="relative w-full max-w-md transform overflow-hidden rounded-xl bg-[color:var(--color-surface)] border border-[color:var(--color-border)] p-8 text-left align-middle shadow-2xl shadow-slate-900/20 transition-all">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-xl font-extrabold tracking-tight text-[color:var(--color-foreground)]">
            {title}
          </h3>
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="rounded-xl p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-slate-600 dark:hover:text-white transition-all"
          >
            <X size={20} />
          </button>
        </div>

        <div className="mb-8">
          <p className="text-base text-[color:var(--color-muted-foreground)] leading-relaxed font-medium">
            {description}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="w-full sm:w-auto inline-flex justify-center rounded-xl border border-[color:var(--color-border)] bg-transparent px-6 py-2.5 text-sm font-bold text-[color:var(--color-foreground)] hover:bg-slate-50 dark:hover:bg-white/5 focus:outline-none transition-all disabled:opacity-50"
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className={`w-full sm:w-auto inline-flex min-w-[100px] justify-center rounded-xl px-6 py-2.5 text-sm font-bold text-white shadow-lg transition-all disabled:opacity-50 ${isDestructive
                ? "bg-red-600 hover:bg-red-700 shadow-red-600/20"
                : "bg-primary hover:bg-primary/90 shadow-primary/20"
              }`}
          >
            {isLoading ? (
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
            ) : (
              confirmText
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
