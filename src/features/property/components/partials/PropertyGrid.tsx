import React from "react";
import { Home } from "lucide-react";
import PropertyCard from "./PropertyCard";
import PropertySkeleton from "../../../../components/common/PropertySkeleton";
import type { PropertyData } from "../../types/propertyTypes";

interface PropertyGridProps {
  loading: boolean;
  error: string | null;
  properties: PropertyData[];
  layout: "grid" | "list";
  isSearchMode: boolean;
}

export const PropertyGrid: React.FC<PropertyGridProps> = ({
  loading,
  error,
  properties,
  layout,
  isSearchMode,
}) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <PropertySkeleton key={i} />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-red-500/5 rounded-xl border border-red-500/10">
        <p className="text-red-500 font-bold mb-6">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-10 py-4 bg-red-500 text-white font-black rounded-lg shadow-xl shadow-red-500/20 hover:scale-105 transition-all"
        >
          Retry Connection
        </button>
      </div>
    );
  }

  if (properties.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-32 bg-[color:var(--color-surface)] rounded-xl border border-dashed border-[color:var(--color-border)]">
        <div className="w-24 h-24 bg-gray-100/50 dark:bg-white/5 flex items-center justify-center rounded-xl mb-6 text-gray-300">
          <Home size={48} />
        </div>
        <h3 className="text-2xl font-black text-[color:var(--color-foreground)] mb-3">
          No matching properties
        </h3>
        <p className="text-gray-500 max-w-sm text-center font-medium leading-relaxed">
          We couldn't find any properties matching your criteria. Try adjusting
          your filters or search terms.
        </p>
      </div>
    );
  }

  return (
    <div
      className={
        layout === "grid"
          ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          : "space-y-6"
      }
    >
      {properties.map((property) => (
        <PropertyCard
          key={property.id}
          property={property}
          layout={layout}
          isSearchMode={isSearchMode}
        />
      ))}
    </div>
  );
};
