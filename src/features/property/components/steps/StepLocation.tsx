import React from "react";
import { PropertyLocationMap } from "../PropertyLocationMap";
import type { AddPropertyFormData } from "../../types/propertyTypes";

interface StepLocationProps {
  formData: AddPropertyFormData;
  validationErrors: Record<string, string>;
  handleInputChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => void;
  onLocationChange: (lat: number, lng: number) => void;
  onAddressFetch: (addr: { district: string; city: string; pincode: string; formattedAddress: string; }) => void;
}

export const StepLocation: React.FC<StepLocationProps> = ({
  formData,
  validationErrors,
  handleInputChange,
  onLocationChange,
  onAddressFetch,
}) => {
  return (
    <div className="space-y-6">
      <h3 className="text-xl font-black mb-6">Location Details</h3>
      <PropertyLocationMap
        latitude={formData.latitude}
        longitude={formData.longitude}
        onLocationChange={onLocationChange}
        onAddressFetch={onAddressFetch}
      />
      <div className="flex flex-wrap gap-4 text-xs text-[color:var(--color-muted-foreground)]">
        <span>
          Lat:{" "}
          <span className="font-mono font-semibold">
            {formData.latitude.toFixed(6)}
          </span>
        </span>
        <span>
          Lng:{" "}
          <span className="font-mono font-semibold">
            {formData.longitude.toFixed(6)}
          </span>
        </span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-black text-[color:var(--color-foreground)] ml-1">
            District *
          </label>
          <input
            name="locationDistrict"
            value={formData.locationDistrict}
            onChange={handleInputChange}
            className={`w-full px-6 py-4 bg-[color:var(--color-secondary)]/50 dark:bg-white/5 border ${validationErrors.locationDistrict ? "border-red-500" : "border-[color:var(--color-border)]"} rounded-2xl text-sm`}
          />
          {validationErrors.locationDistrict && (
            <p className="text-red-500 text-[10px] font-bold mt-1 ml-1">
              {validationErrors.locationDistrict}
            </p>
          )}
        </div>
        <div className="space-y-2">
          <label className="text-sm font-black text-[color:var(--color-foreground)] ml-1">
            City *
          </label>
          <input
            name="locationCity"
            value={formData.locationCity}
            onChange={handleInputChange}
            className={`w-full px-6 py-4 bg-[color:var(--color-secondary)]/50 dark:bg-white/5 border ${validationErrors.locationCity ? "border-red-500" : "border-[color:var(--color-border)]"} rounded-2xl text-sm`}
          />
          {validationErrors.locationCity && (
            <p className="text-red-500 text-[10px] font-bold mt-1 ml-1">
              {validationErrors.locationCity}
            </p>
          )}
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-black text-[color:var(--color-foreground)] ml-1">
            Pincode *
          </label>
          <input
            name="locationPinCode"
            value={formData.locationPinCode}
            onChange={handleInputChange}
            className={`w-full px-6 py-4 bg-[color:var(--color-secondary)]/50 dark:bg-white/5 border ${validationErrors.locationPinCode ? "border-red-500" : "border-[color:var(--color-border)]"} rounded-2xl text-sm`}
          />
          {validationErrors.locationPinCode && (
            <p className="text-red-500 text-[10px] font-bold mt-1 ml-1">
              {validationErrors.locationPinCode}
            </p>
          )}
        </div>
        <div className="space-y-2">
          <label className="text-sm font-black text-[color:var(--color-foreground)] ml-1">
            Nearby Landmarks
          </label>
          <input
            name="nearbyLandmarks"
            value={formData.nearbyLandmarks}
            onChange={handleInputChange}
            className="w-full px-6 py-4 bg-[color:var(--color-secondary)]/50 dark:bg-white/5 border border-[color:var(--color-border)] rounded-2xl text-sm"
          />
        </div>
      </div>
      <div className="space-y-2">
        <label className="text-sm font-black text-[color:var(--color-foreground)] ml-1">
          Full Address *
        </label>
        <textarea
          name="fullAddress"
          value={formData.fullAddress}
          onChange={handleInputChange}
          rows={2}
          className={`w-full px-6 py-4 bg-[color:var(--color-secondary)]/50 dark:bg-white/5 border ${validationErrors.fullAddress ? "border-red-500" : "border-[color:var(--color-border)]"} rounded-2xl text-sm`}
        />
        {validationErrors.fullAddress && (
          <p className="text-red-500 text-[10px] font-bold mt-1 ml-1">
            {validationErrors.fullAddress}
          </p>
        )}
      </div>
    </div>
  );
};
