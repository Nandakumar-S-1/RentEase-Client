import React from "react";
import { Search, Grid, List, Filter } from "lucide-react";

interface PropertySearchHeaderProps {
  searchTerm: string;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
  handleSearch: (e: React.FormEvent) => void;
  setFilters: React.Dispatch<React.SetStateAction<Record<string, unknown>>>;
  layout: "grid" | "list";
  setLayout: (l: "grid" | "list") => void;
  showFilters: boolean;
  setShowFilters: React.Dispatch<React.SetStateAction<boolean>>;
  filters: Record<string, unknown>;
}

export const PropertySearchHeader: React.FC<PropertySearchHeaderProps> = ({
  searchTerm,
  setSearchTerm,
  handleSearch,
  setFilters,
  layout,
  setLayout,
  showFilters,
  setShowFilters,
  filters,
}) => {
  return (
    <div className="flex flex-col lg:flex-row gap-4 justify-between items-center bg-[color:var(--color-surface)] p-5 rounded-[2.5rem] border border-[color:var(--color-border)] shadow-xl">
      <div className="relative w-full lg:max-w-xl">
        <Search
          className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
          size={20}
        />
        <input
          type="text"
          placeholder="Search by name, place or keywords..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-12 pr-4 py-3.5 bg-[color:var(--color-card)] border border-[color:var(--color-border)] rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm font-medium"
          onKeyDown={(e) => e.key === "Enter" && handleSearch(e)}
        />
        {searchTerm && (
          <button
            onClick={() => {
              setSearchTerm("");
              setFilters((prev) => ({ ...prev, query: "" }));
            }}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-gray-400 hover:text-red-500 uppercase tracking-widest"
          >
            Clear
          </button>
        )}
      </div>

      <div className="flex items-center gap-4 w-full lg:w-auto">
        <button
          onClick={handleSearch}
          className="px-8 py-3.5 bg-primary text-white font-black rounded-2xl shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all text-sm"
        >
          Search Now
        </button>
        <div className="flex p-1.5 bg-[color:var(--color-card)] border border-[color:var(--color-border)] rounded-2xl">
          <button
            type="button"
            onClick={() => setLayout("grid")}
            className={`p-2.5 rounded-xl transition-all ${
              layout === "grid"
                ? "bg-primary text-white shadow-md"
                : "text-gray-400 hover:text-gray-600"
            }`}
          >
            <Grid size={20} />
          </button>
          <button
            type="button"
            onClick={() => setLayout("list")}
            className={`p-2.5 rounded-xl transition-all ${
              layout === "list"
                ? "bg-primary text-white shadow-md"
                : "text-gray-400 hover:text-gray-600"
            }`}
          >
            <List size={20} />
          </button>
        </div>

        <button
          type="button"
          onClick={() => setShowFilters(!showFilters)}
          className={`flex-1 lg:flex-none flex items-center justify-center gap-2 px-8 py-3.5 border rounded-2xl text-sm font-black transition-all ${
            showFilters
              ? "bg-primary text-white border-primary shadow-xl shadow-primary/20"
              : "bg-[color:var(--color-card)] border-[color:var(--color-border)] text-gray-600 dark:text-gray-400 hover:bg-gray-100/50"
          }`}
        >
          <Filter size={18} />
          <span>Filters</span>
          {Object.keys(filters).length > (filters.query ? 1 : 0) && (
            <span className="ml-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
          )}
        </button>
      </div>
    </div>
  );
};
