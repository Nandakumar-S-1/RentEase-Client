import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  page: number;
  total: number;
  totalPages: number;
  limit?: number;
  itemName?: string;
  onPageChange: (newPage: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({
  page,
  total,
  totalPages,
  limit = 10,
  itemName = "results",
  onPageChange,
}) => {
  if (totalPages <= 1) return null;

  const startItem = (page - 1) * limit + 1;
  const endItem = Math.min(page * limit, total);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between border-t border-[color:var(--color-border)] pt-8 mt-8 gap-6 w-full">
      <p className="text-sm text-gray-500 font-bold">
        Showing{" "}
        <span className="text-[color:var(--color-foreground)]">
          {startItem}
        </span>{" "}
        to{" "}
        <span className="text-[color:var(--color-foreground)]">{endItem}</span>{" "}
        of <span className="text-[color:var(--color-foreground)]">{total}</span>{" "}
        {itemName}
      </p>

      <div className="flex items-center gap-3">
        <button
          onClick={() => {
            onPageChange(Math.max(1, page - 1));
            window.scrollTo(0, 0);
          }}
          disabled={page === 1}
          className="w-10 h-10 flex items-center justify-center border border-[color:var(--color-border)] rounded-xl hover:bg-primary/5 hover:border-primary/30 disabled:opacity-20 transition-all text-gray-400 hover:text-primary"
        >
          <ChevronLeft size={20} />
        </button>

        <div className="flex gap-2">
          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i + 1}
              onClick={() => {
                onPageChange(i + 1);
                window.scrollTo(0, 0);
              }}
              className={`w-10 h-10 rounded-xl font-black text-sm transition-all ${
                page === i + 1
                  ? "bg-primary text-white shadow-lg shadow-primary/25 scale-110"
                  : "hover:bg-gray-100 dark:hover:bg-white/5 text-gray-400"
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>

        <button
          onClick={() => {
            onPageChange(Math.min(totalPages, page + 1));
            window.scrollTo(0, 0);
          }}
          disabled={page === totalPages}
          className="w-10 h-10 flex items-center justify-center border border-[color:var(--color-border)] rounded-xl hover:bg-primary/5 hover:border-primary/30 disabled:opacity-20 transition-all text-gray-400 hover:text-primary"
        >
          <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );
};
