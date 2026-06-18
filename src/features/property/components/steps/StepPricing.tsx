import React from "react";
import type { AddPropertyFormData } from "../../types/propertyTypes";

interface StepPricingProps {
  formData: AddPropertyFormData;
  validationErrors: Record<string, string>;
  handleInputChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => void;
}

export const StepPricing: React.FC<StepPricingProps> = ({
  formData,
  validationErrors,
  handleInputChange,
}) => {
  return (
    <div className="space-y-6">
      <h3 className="text-xl font-black mb-6 text-[color:var(--color-foreground)]">
        Rental & Financial Structure
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-black text-[color:var(--color-foreground)] ml-1">
            Monthly Rent (₹) *
          </label>
          <input
            type="number"
            min="0"
            name="monthlyRent"
            value={formData.monthlyRent}
            onChange={handleInputChange}
            placeholder="e.g. 15000"
            className={`w-full px-6 py-4 bg-[color:var(--color-secondary)]/50 dark:bg-white/5 border ${validationErrors.monthlyRent ? "border-red-500" : "border-[color:var(--color-border)]"} rounded-lg focus:ring-2 focus:ring-primary/20 text-sm`}
          />
          {validationErrors.monthlyRent && (
            <p className="text-red-500 text-[10px] font-bold mt-1 ml-1">
              {validationErrors.monthlyRent}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-black text-[color:var(--color-foreground)] ml-1">
            Security Deposit (₹) *
          </label>
          <input
            type="number"
            min="0"
            name="depositAmount"
            value={formData.depositAmount}
            onChange={handleInputChange}
            placeholder="e.g. 50000"
            className={`w-full px-6 py-4 bg-[color:var(--color-secondary)]/50 dark:bg-white/5 border ${validationErrors.depositAmount ? "border-red-500" : "border-[color:var(--color-border)]"} rounded-lg focus:ring-2 focus:ring-primary/20 text-sm`}
          />
          {validationErrors.depositAmount && (
            <p className="text-red-500 text-[10px] font-bold mt-1 ml-1">
              {validationErrors.depositAmount}
            </p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-black text-[color:var(--color-foreground)] ml-1">
            Maintenance Charges (₹ / Month)
          </label>
          <input
            type="number"
            min="0"
            name="maintenanceCharges"
            value={formData.maintenanceCharges}
            onChange={handleInputChange}
            placeholder="e.g. 1500"
            className={`w-full px-6 py-4 bg-[color:var(--color-secondary)]/50 dark:bg-white/5 border ${validationErrors.maintenanceCharges ? "border-red-500" : "border-[color:var(--color-border)]"} rounded-lg text-sm`}
          />
          {validationErrors.maintenanceCharges && (
            <p className="text-red-500 text-[10px] font-bold mt-1 ml-1">
              {validationErrors.maintenanceCharges}
            </p>
          )}
        </div>

        <label className="flex items-center gap-3 cursor-pointer p-5 rounded-lg border border-[color:var(--color-border)] hover:bg-[color:var(--color-secondary)]/30 h-fit self-end">
          <input
            type="checkbox"
            name="maintenanceIncluded"
            checked={formData.maintenanceIncluded}
            onChange={handleInputChange}
            className="w-5 h-5 rounded text-primary focus:ring-primary"
          />
          <div>
            <span className="text-sm font-black text-[color:var(--color-foreground)] block">
              Maintenance Included in Rent
            </span>
            <span className="text-[10px] text-[color:var(--color-muted-foreground)] font-semibold mt-0.5 block">
              Rent amount above includes any recurring society or maintenance
              fees.
            </span>
          </div>
        </label>
      </div>
    </div>
  );
};
