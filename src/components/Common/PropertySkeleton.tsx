import React from "react";

const PropertySkeleton: React.FC = () => {
  return (
    <div className="bg-[color:var(--color-surface)] rounded-2xl overflow-hidden border border-[color:var(--color-border)] shadow-sm animate-pulse">
      <div className="w-full h-48 bg-gray-200 dark:bg-gray-800 animate-shimmer"></div>

      <div className="p-4 space-y-3">
        <div className="flex justify-between items-center">
          <div className="h-4 w-3/4 bg-gray-200 dark:bg-gray-800 rounded animate-shimmer"></div>
          <div className="h-4 w-12 bg-gray-200 dark:bg-gray-800 rounded animate-shimmer"></div>
        </div>

        <div className="h-3 w-1/2 bg-gray-200 dark:bg-gray-800 rounded animate-shimmer opacity-50"></div>

        <div className="pt-4 flex justify-between items-center border-t border-[color:var(--color-border)] mt-4">
          <div className="h-5 w-20 bg-primary/20 rounded animate-shimmer"></div>
          <div className="h-5 w-5 bg-gray-200 dark:bg-gray-800 rounded-full animate-shimmer"></div>
        </div>
      </div>
    </div>
  );
};

export default PropertySkeleton;
