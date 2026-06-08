import React from "react";
import { CheckCircle2 } from "lucide-react";
import {
  AMENITIES_OPTIONS,
  LAND_AMENITIES,
  TenantTypePref,
} from "../../../../types/constants/property.constant";
import type { AddPropertyFormData } from "../../types/propertyTypes";

const TENANT_PREF_OPTIONS = Object.values(TenantTypePref);

interface StepAmenitiesProps {
  formData: AddPropertyFormData;
  validationErrors: Record<string, string>;
  handleInputChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => void;
  handleCheckboxArray: (
    field: "amenities" | "preferredTenantType",
    value: string
  ) => void;
}

export const StepAmenities: React.FC<StepAmenitiesProps> = ({
  formData,
  validationErrors,
  handleInputChange,
  handleCheckboxArray,
}) => {
  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-xl font-black mb-4">Amenities</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {(formData.propertyType === "LAND"
            ? LAND_AMENITIES
            : AMENITIES_OPTIONS
          ).map((amenity) => (
            <label
              key={amenity}
              className={`flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all ${formData.amenities.includes(amenity as string) ? "border-primary bg-primary/5 text-primary" : "border-[color:var(--color-border)] hover:border-[color:var(--color-muted)] text-[color:var(--color-muted-foreground)]"}`}
            >
              <input
                type="checkbox"
                className="hidden"
                checked={formData.amenities.includes(amenity as string)}
                onChange={() =>
                  handleCheckboxArray("amenities", amenity as string)
                }
              />
              <div
                className={`w-5 h-5 rounded flex items-center justify-center ${formData.amenities.includes(amenity as string) ? "bg-primary text-white" : "bg-[color:var(--color-secondary)]"}`}
              >
                {formData.amenities.includes(amenity as string) && (
                  <CheckCircle2 size={14} />
                )}
              </div>
              <span className="text-sm font-bold">{amenity}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-xl font-black mb-4">Preferred Tenant Type</h3>
        <div className="flex flex-wrap gap-4">
          {TENANT_PREF_OPTIONS.map((type) => (
            <label
              key={type}
              className={`px-6 py-3 rounded-lg border-2 cursor-pointer transition-all text-sm font-bold ${formData.preferredTenantType.includes(type) ? "border-primary bg-primary text-white shadow-lg shadow-primary/30" : "border-[color:var(--color-border)] bg-white text-[color:var(--color-muted-foreground)] hover:border-[color:var(--color-muted)]"}`}
            >
              <input
                type="checkbox"
                className="hidden"
                checked={formData.preferredTenantType.includes(type)}
                onChange={() => handleCheckboxArray("preferredTenantType", type)}
              />
              {type}
            </label>
          ))}
        </div>
      </div>

      {formData.propertyType !== "LAND" && (
        <div>
          <h3 className="text-xl font-black mb-4">Property Rules & Occupancy</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <label className="flex items-center gap-3 cursor-pointer p-4 rounded-xl border border-[color:var(--color-border)] hover:bg-[color:var(--color-secondary)]">
              <input
                type="checkbox"
                name="petsAllowed"
                checked={formData.petsAllowed}
                onChange={handleInputChange}
                className="w-5 h-5 rounded text-primary focus:ring-primary"
              />
              <span className="text-sm font-bold text-[color:var(--color-foreground)]">
                Pets Allowed
              </span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer p-4 rounded-xl border border-[color:var(--color-border)] hover:bg-[color:var(--color-secondary)]">
              <input
                type="checkbox"
                name="smokingAllowed"
                checked={formData.smokingAllowed}
                onChange={handleInputChange}
                className="w-5 h-5 rounded text-primary focus:ring-primary"
              />
              <span className="text-sm font-bold text-[color:var(--color-foreground)]">
                Smoking Allowed
              </span>
            </label>
            {formData.propertyType !== "SHOP" && (
              <div className="space-y-2">
                <label className="text-xs font-black text-[color:var(--color-muted-foreground)] uppercase tracking-widest ml-1">
                  Max Occupants *
                </label>
                <input
                  type="number"
                  min="1"
                  name="maximumOccupants"
                  value={formData.maximumOccupants}
                  onChange={handleInputChange}
                  placeholder="e.g. 4"
                  className={`w-full px-4 py-3 bg-[color:var(--color-secondary)]/50 dark:bg-white/5 border ${validationErrors.maximumOccupants ? "border-red-500" : "border-[color:var(--color-border)]"} rounded-xl text-sm`}
                />
                {validationErrors.maximumOccupants && (
                  <p className="text-red-500 text-[10px] font-bold mt-1 ml-1">
                    {validationErrors.maximumOccupants}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {formData.propertyType === "LAND" && (
        <div>
          <h3 className="text-xl font-black mb-4">Land Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-black text-[color:var(--color-muted-foreground)] uppercase tracking-widest ml-1">
                Land Type
              </label>
              <input
                name="landType"
                value={formData.landType}
                onChange={handleInputChange}
                placeholder="e.g. Residential, Commercial"
                className="w-full px-4 py-3 bg-[color:var(--color-secondary)]/50 dark:bg-white/5 border border-[color:var(--color-border)] rounded-xl text-sm"
              />
            </div>
            <label className="flex items-center gap-3 cursor-pointer p-4 rounded-xl border border-[color:var(--color-border)] hover:bg-[color:var(--color-secondary)] h-fit self-end">
              <input
                type="checkbox"
                name="isCornerPlot"
                checked={formData.isCornerPlot}
                onChange={handleInputChange}
                className="w-5 h-5 rounded text-primary focus:ring-primary"
              />
              <span className="text-sm font-bold text-[color:var(--color-foreground)]">
                Corner Plot
              </span>
            </label>
            <div className="space-y-2">
              <label className="text-xs font-black text-[color:var(--color-muted-foreground)] uppercase tracking-widest ml-1">
                Road Width (Feet)
              </label>
              <input
                type="number"
                min="0"
                name="roadWidthFeet"
                value={formData.roadWidthFeet}
                onChange={handleInputChange}
                placeholder="e.g. 30"
                className="w-full px-4 py-3 bg-[color:var(--color-secondary)]/50 dark:bg-white/5 border border-[color:var(--color-border)] rounded-xl text-sm"
              />
            </div>
          </div>
        </div>
      )}

      {formData.propertyType === "SHOP" && (
        <div>
          <h3 className="text-xl font-black mb-4">Shop Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-black text-[color:var(--color-muted-foreground)] uppercase tracking-widest ml-1">
                Shop Type
              </label>
              <input
                name="shopType"
                value={formData.shopType}
                onChange={handleInputChange}
                placeholder="e.g. Retail, Showroom"
                className="w-full px-4 py-3 bg-[color:var(--color-secondary)]/50 dark:bg-white/5 border border-[color:var(--color-border)] rounded-xl text-sm"
              />
            </div>
            <label className="flex items-center gap-3 cursor-pointer p-4 rounded-xl border border-[color:var(--color-border)] hover:bg-[color:var(--color-secondary)] h-fit self-end">
              <input
                type="checkbox"
                name="hasParking"
                checked={formData.hasParking}
                onChange={handleInputChange}
                className="w-5 h-5 rounded text-primary focus:ring-primary"
              />
              <span className="text-sm font-bold text-[color:var(--color-foreground)]">
                Parking Space Available
              </span>
            </label>
          </div>
        </div>
      )}
    </div>
  );
};
