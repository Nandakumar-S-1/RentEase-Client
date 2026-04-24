import React from "react";
import { Home } from "lucide-react";

interface LoadingOverlayProps {
  fullPage?: boolean;
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
  fullPage = true,
}) => {
  return (
    <div
      className={`${
        fullPage ? "fixed inset-0 z-[9999]" : "absolute inset-0"
      } bg-[color:var(--color-surface)]/80 backdrop-blur-sm flex flex-col items-center justify-center transition-all duration-500`}
    >
      <div className="relative">
        <div className="p-6 bg-primary/10 rounded-full animate-pulse-house">
          <Home size={60} className="text-primary" />
        </div>
        <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
          <p className="text-sm font-bold text-primary tracking-widest uppercase">
            Finding your home
          </p>
          <div className="flex gap-1">
            <div
              className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce"
              style={{ animationDelay: "0ms" }}
            ></div>
            <div
              className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce"
              style={{ animationDelay: "200ms" }}
            ></div>
            <div
              className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce"
              style={{ animationDelay: "400ms" }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};
