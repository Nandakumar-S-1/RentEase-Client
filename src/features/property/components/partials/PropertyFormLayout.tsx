import React from "react";
import { ChevronLeft, ChevronRight, CheckCircle2 } from "lucide-react";

const STEPS = [
  "Basic Details",
  "Location",
  "Amenities",
  "Photos",
  "Pricing",
];

interface PropertyFormLayoutProps {
  step: number;
  loading: boolean;
  prevStep: () => void;
  nextStep: () => void;
  handleSubmit: () => void;
  isEdit?: boolean;
  children: React.ReactNode;
}

export const PropertyFormLayout: React.FC<PropertyFormLayoutProps> = ({
  step,
  loading,
  prevStep,
  nextStep,
  handleSubmit,
  isEdit = false,
  children,
}) => {
  return (
    <>
      {/* Wizard Stepper Progress */}
      <div className="bg-white dark:bg-card border border-[color:var(--color-border)] rounded-xl p-8 shadow-sm">
        <div className="flex justify-between items-center relative">
          <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-0.5 bg-[color:var(--color-border)] -z-10" />
          <div
            className="absolute left-0 top-1/2 -translate-y-1/2 h-0.5 bg-primary -z-10 transition-all duration-500"
            style={{ width: `${((step - 1) / (STEPS.length - 1)) * 100}%` }}
          />
          {STEPS.map((name, index) => {
            const currentStepNumber = index + 1;
            const isCompleted = step > currentStepNumber;
            const isActive = step === currentStepNumber;

            return (
              <div key={name} className="flex flex-col items-center gap-2">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-black text-xs transition-all duration-500 ${
                    isCompleted
                      ? "bg-primary text-white scale-105"
                      : isActive
                        ? "bg-primary text-white ring-4 ring-primary/20 scale-110"
                        : "bg-[color:var(--color-secondary)] text-[color:var(--color-muted-foreground)]"
                  }`}
                >
                  {isCompleted ? (
                    <CheckCircle2 size={16} />
                  ) : (
                    currentStepNumber
                  )}
                </div>
                <span
                  className={`text-[9px] font-black uppercase tracking-widest hidden md:inline transition-colors duration-500 ${
                    isActive
                      ? "text-primary"
                      : "text-[color:var(--color-muted-foreground)]"
                  }`}
                >
                  {name}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Wizard Form Viewport */}
      <div className="bg-white dark:bg-card border border-[color:var(--color-border)] rounded-xl p-8 lg:p-12 shadow-sm min-h-[500px]">
        {children}
      </div>

      {/* Wizard Controls */}
      <div className="flex justify-between items-center bg-white dark:bg-card border border-[color:var(--color-border)] rounded-xl p-6 shadow-sm">
        <button
          type="button"
          onClick={prevStep}
          disabled={step === 1 || loading}
          className="flex items-center gap-2 px-6 py-3 font-bold text-[color:var(--color-muted-foreground)] hover:bg-[color:var(--color-secondary)] rounded-lg transition-all disabled:opacity-30"
        >
          <ChevronLeft size={20} /> Back
        </button>

        {step < 5 ? (
          <button
            type="button"
            onClick={nextStep}
            className="flex items-center gap-2 px-8 py-3 bg-primary text-white font-bold rounded-lg shadow-lg shadow-primary/30 hover:scale-105 transition-all"
          >
            Next Step <ChevronRight size={20} />
          </button>
        ) : (
          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading}
            className={`flex items-center gap-2 px-8 py-3 text-white font-black rounded-lg shadow-xl hover:scale-105 transition-all disabled:opacity-50 ${
              isEdit ? "bg-primary shadow-primary/30" : "bg-green-500 shadow-green-500/30"
            }`}
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : isEdit ? null : (
              <CheckCircle2 size={20} />
            )}
            {loading
              ? isEdit
                ? "Updating..."
                : ""
              : isEdit
                ? "Save Changes"
                : "Publish Listing"}
          </button>
        )}
      </div>
    </>
  );
};
