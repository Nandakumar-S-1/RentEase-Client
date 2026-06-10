import React from "react";
import {
  PropertyTypes,
  FurnishingStatus,
} from "../../../../types/constants/property.constant";
import type { AddPropertyFormData } from "../../types/propertyTypes";

const PROPERTY_TYPE_OPTIONS = Object.values(PropertyTypes);
const FURNISHING_OPTIONS = Object.values(FurnishingStatus);

interface StepBasicDetailsProps {
  formData: AddPropertyFormData;
  validationErrors: Record<string, string>;
  handleInputChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => void;
}

export const StepBasicDetails: React.FC<StepBasicDetailsProps> = ({
  formData,
  validationErrors,
  handleInputChange,
}) => {
  return (
    <div className="space-y-6">
      <h3 className="text-xl font-black mb-6 text-[color:var(--color-foreground)]">
        Basic Property Information
      </h3>
      <div className="space-y-2">
        <label className="text-sm font-black text-[color:var(--color-foreground)] ml-1">
          Property Title *
        </label>
        <input
          name="title"
          value={formData.title}
          onChange={handleInputChange}
          placeholder="e.g. Modern 2 BHK Flat in Kakkanad"
          className={`w-full px-6 py-4 bg-[color:var(--color-secondary)]/50 dark:bg-white/5 border ${validationErrors.title ? "border-red-500" : "border-[color:var(--color-border)]"} rounded-lg focus:ring-2 focus:ring-primary/20 text-sm`}
        />
        {validationErrors.title && (
          <p className="text-red-500 text-[10px] font-bold mt-1 ml-1">
            {validationErrors.title}
          </p>
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-black text-[color:var(--color-foreground)] ml-1">
            Property Type
          </label>
          <select
            name="propertyType"
            value={formData.propertyType}
            onChange={handleInputChange}
            className={`w-full px-6 py-4 bg-[color:var(--color-secondary)]/50 dark:bg-white/5 border ${validationErrors.propertyType ? "border-red-500" : "border-border"} rounded-lg text-sm`}
          >
            <option value="">Select Type</option>
            {PROPERTY_TYPE_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
          {validationErrors.propertyType && (
            <p className="text-red-500 text-[10px] font-bold mt-1 ml-1">
              {validationErrors.propertyType}
            </p>
          )}
        </div>
        <div className="space-y-2">
          <label className="text-sm font-black text-[color:var(--color-foreground)] ml-1">
            Area (Sq. Ft.)
          </label>
          <input
            type="number"
            min="0"
            name="areaSqft"
            value={formData.areaSqft}
            onChange={handleInputChange}
            placeholder="e.g. 1200"
            className={`w-full px-6 py-4 bg-[color:var(--color-secondary)]/50 dark:bg-white/5 border ${validationErrors.areaSqft ? "border-red-500" : "border-[color:var(--color-border)]"} rounded-lg text-sm`}
          />
          {validationErrors.areaSqft && (
            <p className="text-red-500 text-[10px] font-bold mt-1 ml-1">
              {validationErrors.areaSqft}
            </p>
          )}
        </div>
      </div>

      {formData.propertyType !== "LAND" && (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-2 gap-4">
            {formData.propertyType !== "SHOP" && (
              <div className="space-y-2">
                <label className="text-sm font-black text-[color:var(--color-foreground)] ml-1">
                  BHK
                </label>
                <input
                  type="number"
                  min="1"
                  name="bhk"
                  value={formData.bhk}
                  onChange={handleInputChange}
                  placeholder="e.g. 2"
                  className={`w-full px-6 py-4 bg-[color:var(--color-secondary)]/50 dark:bg-white/5 border ${validationErrors.bhk ? "border-red-500" : "border-[color:var(--color-border)]"} rounded-lg text-sm`}
                />
                {validationErrors.bhk && (
                  <p className="text-red-500 text-[10px] font-bold mt-1 ml-1">
                    {validationErrors.bhk}
                  </p>
                )}
              </div>
            )}
            <div className="space-y-2">
              <label className="text-sm font-black text-[color:var(--color-foreground)] ml-1">
                Bathrooms
              </label>
              <input
                type="number"
                min="1"
                name="bathrooms"
                value={formData.bathrooms}
                onChange={handleInputChange}
                placeholder="e.g. 2"
                className={`w-full px-6 py-4 bg-[color:var(--color-secondary)]/50 dark:bg-white/5 border ${validationErrors.bathrooms ? "border-red-500" : "border-[color:var(--color-border)]"} rounded-lg text-sm`}
              />
              {validationErrors.bathrooms && (
                <p className="text-red-500 text-[10px] font-bold mt-1 ml-1">
                  {validationErrors.bathrooms}
                </p>
              )}
            </div>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-black text-[color:var(--color-foreground)] ml-1">
                Floor
              </label>
              <input
                name="floorNumber"
                value={formData.floorNumber}
                onChange={handleInputChange}
                placeholder="e.g. 2nd Floor"
                className="w-full px-6 py-4 bg-[color:var(--color-secondary)]/50 dark:bg-white/5 border border-[color:var(--color-border)] rounded-lg text-sm"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-black text-[color:var(--color-foreground)] ml-1">
                Age
              </label>
              <input
                name="propertyAge"
                value={formData.propertyAge}
                onChange={handleInputChange}
                placeholder="e.g. 2 years"
                className="w-full px-6 py-4 bg-[color:var(--color-secondary)]/50 dark:bg-white/5 border border-[color:var(--color-border)] rounded-lg text-sm"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-black text-[color:var(--color-foreground)] ml-1">
                Total Floors
              </label>
              <input
                type="number"
                min="1"
                name="totalFloors"
                value={formData.totalFloors}
                onChange={handleInputChange}
                placeholder="e.g. 5"
                className={`w-full px-6 py-4 bg-[color:var(--color-secondary)]/50 dark:bg-white/5 border ${validationErrors.totalFloors ? "border-red-500" : "border-[color:var(--color-border)]"} rounded-lg text-sm`}
              />
              {validationErrors.totalFloors && (
                <p className="text-red-500 text-[10px] font-bold mt-1 ml-1">
                  {validationErrors.totalFloors}
                </p>
              )}
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-black text-[color:var(--color-foreground)] ml-1">
                Facing Direction
              </label>
              <select
                name="facingDirection"
                value={formData.facingDirection}
                onChange={handleInputChange}
                className="w-full px-6 py-4 bg-[color:var(--color-secondary)]/50 dark:bg-white/5 border border-[color:var(--color-border)] rounded-lg text-sm"
              >
                <option value="">Select Direction</option>
                {[
                  "North",
                  "South",
                  "East",
                  "West",
                  "North-East",
                  "North-West",
                  "South-East",
                  "South-West",
                ].map((direction) => (
                  <option key={direction} value={direction}>
                    {direction}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-black text-[color:var(--color-foreground)] ml-1">
                Furnishing Status
              </label>
              <select
                name="furnishingStatus"
                value={formData.furnishingStatus}
                onChange={handleInputChange}
                className={`w-full px-6 py-4 bg-[color:var(--color-secondary)]/50 dark:bg-white/5 border ${validationErrors.furnishingStatus ? "border-red-500" : "border-[color:var(--color-border)]"} rounded-lg text-sm`}
              >
                <option value="">Select Status</option>
                {(FURNISHING_OPTIONS as string[]).map((opt: string) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
              {validationErrors.furnishingStatus && (
                <p className="text-red-500 text-[10px] font-bold mt-1 ml-1">
                  {validationErrors.furnishingStatus}
                </p>
              )}
            </div>
          </div>
        </>
      )}

      <div className="space-y-2">
        <label className="text-sm font-black text-[color:var(--color-foreground)] ml-1">
          Description *
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          rows={4}
          placeholder="Tell us about your property..."
          className={`w-full px-6 py-4 bg-[color:var(--color-secondary)]/50 dark:bg-white/5 border ${validationErrors.description ? "border-red-500" : "border-[color:var(--color-border)]"} rounded-lg text-sm`}
        />
        {validationErrors.description && (
          <p className="text-red-500 text-[10px] font-bold mt-1 ml-1">
            {validationErrors.description}
          </p>
        )}
      </div>
    </div>
  );
};
