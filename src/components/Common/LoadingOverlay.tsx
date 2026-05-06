import React from "react";

interface LoadingOverlayProps {
  fullPage?: boolean;
  message?: string;
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
  fullPage = true,
  message = "Loading...",
}) => {
  return (
    <div
      className={`${
        fullPage ? "fixed inset-0 z-[9999]" : "absolute inset-0"
      } bg-[color:var(--color-surface)]/80 backdrop-blur-md flex flex-col items-center justify-center transition-all duration-500`}
    >
      <div className="flex flex-col items-center gap-6">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 border-4 border-primary/10 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>

        <div className="flex flex-col items-center gap-3">
          <p className="text-lg font-black text-primary tracking-[0.2em] uppercase animate-pulse">
            {message}
          </p>
          <div className="flex gap-1.5">
            {[0, 200, 400].map((delay) => (
              <div
                key={delay}
                className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce"
                style={{ animationDelay: `${delay}ms` }}
              ></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
