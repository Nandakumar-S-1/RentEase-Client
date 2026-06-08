import React from "react";
import { MapPin, Building, RotateCcw } from "lucide-react";

interface PropertyFiltersProps {
  showFilters: boolean;
  filters: Record<string, unknown>;
  cityInput: string;
  setCityInput: React.Dispatch<React.SetStateAction<string>>;
  handleFilterChange: (newFilters: Record<string, unknown>) => void;
  showBhkFilter: boolean;
  showAreaFilter: boolean;
  minRentInput: string;
  setMinRentInput: React.Dispatch<React.SetStateAction<string>>;
  maxRentInput: string;
  setMaxRentInput: React.Dispatch<React.SetStateAction<string>>;
  minAreaInput: string;
  setMinAreaInput: React.Dispatch<React.SetStateAction<string>>;
  maxAreaInput: string;
  setMaxAreaInput: React.Dispatch<React.SetStateAction<string>>;
  resetFilters: () => void;
  setShowFilters: React.Dispatch<React.SetStateAction<boolean>>;
}

export const PropertyFilters: React.FC<PropertyFiltersProps> = ({
  showFilters,
  filters,
  cityInput,
  setCityInput,
  handleFilterChange,
  showBhkFilter,
  showAreaFilter,
  minRentInput,
  setMinRentInput,
  maxRentInput,
  setMaxRentInput,
  minAreaInput,
  setMinAreaInput,
  maxAreaInput,
  setMaxAreaInput,
  resetFilters,
  setShowFilters,
}) => {
  if (!showFilters) return null;

  return (
    <div className="p-8 bg-[color:var(--color-surface)] border border-[color:var(--color-border)] rounded-xl shadow-2xl animate-in slide-in-from-top-4 duration-500">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <div className="space-y-3">
          <label className="flex items-center gap-2 text-xs font-black text-gray-400 uppercase tracking-widest ml-1">
            <MapPin size={14} className="text-primary" /> City
          </label>
          <input
            type="text"
            placeholder="e.g. Kochi"
            className="w-full px-5 py-3.5 bg-[color:var(--color-card)] border border-[color:var(--color-border)] rounded-lg text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all font-medium"
            onChange={(e) => setCityInput(e.target.value)}
            value={cityInput}
          />
        </div>
        <div className="space-y-3">
          <label className="flex items-center gap-2 text-xs font-black text-gray-400 uppercase tracking-widest ml-1">
            <Building size={14} className="text-primary" /> Property Type
          </label>
          <select
            className="w-full px-5 py-3.5 bg-[color:var(--color-card)] border border-[color:var(--color-border)] rounded-lg text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all font-medium"
            onChange={(e) =>
              handleFilterChange({ propertyType: e.target.value })
            }
            value={(filters.propertyType as string) || ""}
          >
            <option value="">Any Type</option>
            <option value="FLAT">Flat</option>
            <option value="HOUSE">House</option>
            <option value="SHOP">Shop</option>
            <option value="PG">PG</option>
            <option value="LAND">Land</option>
          </select>
        </div>

        {showBhkFilter && (
          <div className="space-y-3 animate-in fade-in zoom-in-95 duration-300">
            <label className="flex items-center gap-2 text-xs font-black text-gray-400 uppercase tracking-widest ml-1">
              BHK Configuration
            </label>
            <div className="flex flex-wrap gap-2">
              {[1, 2, 3, 4].map((n) => (
                <button
                  key={n}
                  onClick={() =>
                    handleFilterChange({
                      bhk: filters.bhk === n ? undefined : n,
                    })
                  }
                  className={`w-11 h-11 rounded-xl text-xs font-black transition-all border ${
                    filters.bhk === n
                      ? "bg-primary text-white border-primary"
                      : "bg-[color:var(--color-card)] border-[color:var(--color-border)] text-gray-400 hover:border-primary/40"
                  }`}
                >
                  {n}
                </button>
              ))}
              <button
                onClick={() => handleFilterChange({ bhk: undefined })}
                className={`px-4 h-11 rounded-xl text-[10px] font-black uppercase transition-all border ${
                  !filters.bhk
                    ? "bg-primary text-white border-primary"
                    : "bg-[color:var(--color-card)] border-[color:var(--color-border)] text-gray-400 hover:border-primary/40"
                }`}
              >
                Any
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8 pt-8 border-t border-[color:var(--color-border)]">
        <div className="space-y-3">
          <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">
            Rent Range (₹)
          </label>
          <div className="flex items-center gap-3">
            <input
              type="number"
              placeholder="Min"
              className="w-full px-5 py-3.5 bg-[color:var(--color-card)] border border-[color:var(--color-border)] rounded-lg text-sm font-medium outline-none"
              onChange={(e) => setMinRentInput(e.target.value)}
              value={minRentInput}
            />
            <span className="text-gray-300">-</span>
            <input
              type="number"
              placeholder="Max"
              className="w-full px-5 py-3.5 bg-[color:var(--color-card)] border border-[color:var(--color-border)] rounded-lg text-sm font-medium outline-none"
              onChange={(e) => setMaxRentInput(e.target.value)}
              value={maxRentInput}
            />
          </div>
        </div>

        {showAreaFilter && (
          <div className="space-y-3 animate-in fade-in zoom-in-95 duration-300">
            <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">
              Area Range (Sq. Ft.)
            </label>
            <div className="flex items-center gap-3">
              <input
                type="number"
                placeholder="Min"
                className="w-full px-5 py-3.5 bg-[color:var(--color-card)] border border-[color:var(--color-border)] rounded-lg text-sm font-medium outline-none"
                onChange={(e) => setMinAreaInput(e.target.value)}
                value={minAreaInput}
              />
              <span className="text-gray-300">-</span>
              <input
                type="number"
                placeholder="Max"
                className="w-full px-5 py-3.5 bg-[color:var(--color-card)] border border-[color:var(--color-border)] rounded-lg text-sm font-medium outline-none"
                onChange={(e) => setMaxAreaInput(e.target.value)}
                value={maxAreaInput}
              />
            </div>
          </div>
        )}

        <div
          className={`${
            showAreaFilter ? "lg:col-span-1" : "lg:col-span-2"
          } flex items-end justify-end gap-4`}
        >
          <button
            onClick={resetFilters}
            className="flex items-center gap-2 px-6 py-3.5 text-xs font-black text-gray-400 hover:text-red-500 uppercase tracking-widest transition-colors"
          >
            <RotateCcw size={16} />
            Reset All
          </button>
          <button
            onClick={() => setShowFilters(false)}
            className="px-10 py-3.5 bg-[color:var(--color-foreground)] text-[color:var(--color-surface)] font-black rounded-lg text-xs uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-lg"
          >
            Show Results
          </button>
        </div>
      </div>
    </div>
  );
};
