import React, { useState, useRef } from "react";
import DashboardLayout from "../../../components/common/DashboardLayout";
import { useAppSelector } from "../../../hooks/useAppSelector";
import type { RootState } from "../../../app/store/store";
import type { RoleType } from "../../../types/constants/role.constant";
import { PAGE_ROUTES } from "../../../config/routes";
import { useNavigate } from "react-router-dom";
import {
  createProperty,
  getPropertyPhotoUploadUrls,
} from "../services/propertyService";
import type { CreatePropertyData } from "../types/propertyTypes";
import { getApiErrorMessage } from "../../../types/common";
import {
  X,
  Plus,
  CheckCircle2,
  AlertCircle,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";
import { toast } from "react-hot-toast";
import {
  PropertyTypes,
  type PropertyType,
  FurnishingStatus,
  AMENITIES_OPTIONS,
  LAND_AMENITIES,
  TenantTypePref,
} from "../../../types/constants/property.constant";
import { propertySchema } from "../schemas/propertySchemas";

const PROPERTY_TYPE_OPTIONS = Object.values(PropertyTypes);
const TENANT_PREF_OPTIONS = Object.values(TenantTypePref);
const FURNISHING_OPTIONS = Object.values(FurnishingStatus);

const STEPS = ["Basic Details", "Location", "Amenities", "Photos", "Pricing"];

const AddProperty: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAppSelector((state: RootState) => state.auth);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    propertyType: PropertyTypes.FLAT as PropertyType,
    bhk: "",
    bathrooms: "",
    floorNumber: "",
    propertyAge: "",
    facingDirection: "",
    totalFloors: "",
    furnishingStatus: "" as string,

    locationDistrict: "",
    locationCity: "",
    locationPinCode: "",
    fullAddress: "",
    nearbyLandmarks: "",
    latitude: 10.8505,
    longitude: 76.2711,

    amenities: [] as string[],
    preferredTenantType: [] as string[],
    petsAllowed: false,
    smokingAllowed: false,
    maximumOccupants: "",
    landType: "RESIDENTIAL" as string,
    isCornerPlot: false,
    roadWidthFeet: "",
    shopType: "" as string,
    hasParking: false,

    monthlyRent: "",
    depositAmount: "",
    maintenanceCharges: "0",
    maintenanceIncluded: false,
    areaSqft: "",
  });

  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const target = e.target as HTMLInputElement;
    const { name, value, type, checked } = target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (validationErrors[name])
      setValidationErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
  };

  const handleCheckboxArray = (
    field: "amenities" | "preferredTenantType",
    value: string,
  ) => {
    setFormData((prev) => {
      const current = prev[field];
      const updated = current.includes(value)
        ? current.filter((item) => item !== value)
        : [...current, value];
      return { ...prev, [field]: updated };
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      const updatedFiles = [...files, ...newFiles].slice(0, 5);
      setFiles(updatedFiles);
      const newPreviews = updatedFiles.map((file) => URL.createObjectURL(file));
      setPreviews(newPreviews);
    }
  };
  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
    setPreviews(previews.filter((_, i) => i !== index));
  };
  const validateCurrentStep = () => {
    const numericData = {
      ...formData,
      monthlyRent: Number(formData.monthlyRent),
      depositAmount: Number(formData.depositAmount),
      maintenanceCharges: Number(formData.maintenanceCharges),
      areaSqft: formData.areaSqft ? Number(formData.areaSqft) : null,
      bhk: formData.bhk ? Number(formData.bhk) : null,
      bathrooms: formData.bathrooms ? Number(formData.bathrooms) : null,
    };

    const result = propertySchema.safeParse(numericData);
    if (result.success) {
      setValidationErrors({});
      return true;
    }

    const errors: Record<string, string> = {};
    const relevantIssues = result.error.issues.filter((issue) => {
      const field = issue.path[0]?.toString();
      if (!field) return false;

      if (step === 1)
        return ["title", "description", "propertyType"].includes(field);
      if (step === 2)
        return [
          "locationDistrict",
          "locationCity",
          "locationPinCode",
          "fullAddress",
        ].includes(field);
      if (step === 5) return ["monthlyRent", "depositAmount"].includes(field);
      return false;
    });

    if (step === 4 && files.length === 0) {
      toast.error("At least 1 photo is required.");
      return false;
    }

    if (relevantIssues.length > 0) {
      relevantIssues.forEach((issue) => {
        errors[issue.path[0]?.toString() || "unknown"] = issue.message;
      });
      setValidationErrors(errors);
      toast.error("Please fill required fields correctly.");
      return false;
    }

    setValidationErrors({});
    return true;
  };

  const nextStep = () => {
    if (validateCurrentStep()) setStep((s) => Math.min(5, s + 1));
  };
  const prevStep = () => setStep((s) => Math.max(1, s - 1));

  const handleSubmit = async () => {
    setValidationErrors({});

    // Parse numeric fields
    const validationData = {
      ...formData,
      monthlyRent: Number(formData.monthlyRent),
      depositAmount: Number(formData.depositAmount),
      maintenanceCharges: Number(formData.maintenanceCharges),
      areaSqft: formData.areaSqft ? Number(formData.areaSqft) : null,
      bhk: formData.bhk ? Number(formData.bhk) : null,
      bathrooms: formData.bathrooms ? Number(formData.bathrooms) : null,
      totalFloors: formData.totalFloors ? Number(formData.totalFloors) : null,
    };

    const result = propertySchema.safeParse(validationData);
    if (!result.success) {
      const errors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        errors[issue.path[0]?.toString() || "unknown"] = issue.message;
      });
      setValidationErrors(errors);
      toast.error("Please fix the errors before submitting");
      return;
    }

    try {
      setLoading(true);
      const filesMeta = files.map((f) => ({
        fileName: f.name,
        contentType: f.type || "image/jpeg",
      }));
      const uploadRes = await getPropertyPhotoUploadUrls(filesMeta);
      const uploads = uploadRes.data.uploads;

      await Promise.all(
        uploads.map((u, idx) =>
          fetch(u.uploadUrl, {
            method: "PUT",
            headers: { "Content-Type": files[idx].type || "image/jpeg" },
            body: files[idx],
          }).then((r) => {
            if (!r.ok) throw new Error(`Upload failed for file ${idx + 1}`);
          }),
        ),
      );

      const payload: CreatePropertyData = {
        ...result.data,
        photos: uploads.map((u) => u.publicUrl),
        primaryPhotoIndex: 0,
      };

      await createProperty(payload);
      toast.success("Property added successfully!");
      navigate(PAGE_ROUTES.OWNER_PROPERTIES);
    } catch (err) {
      toast.error(getApiErrorMessage(err, "Failed to add property"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout
      role={user?.role as RoleType}
      userName={user?.fullname || "Owner"}
    >
      <div className="max-w-4xl mx-auto space-y-8 pb-20">
        <div className="flex justify-between items-end">
          <div className="space-y-1">
            <h1 className="text-4xl font-black text-[color:var(--color-foreground)] tracking-tight">
              Add New Property
            </h1>
            <p className="text-gray-500 font-medium tracking-wide">
              Step {step} of 5: {STEPS[step - 1]}
            </p>
          </div>
          <button
            onClick={() => navigate(PAGE_ROUTES.OWNER_PROPERTIES)}
            className="px-6 py-2.5 bg-gray-100 h-fit dark:bg-white/5 text-gray-600 dark:text-gray-400 font-bold rounded-2xl hover:bg-gray-200 transition-all text-sm"
          >
            Cancel
          </button>
        </div>

        {/* Progress Bar */}
        <div className="flex items-center gap-2 mb-8">
          {STEPS.map((s, idx) => (
            <React.Fragment key={s}>
              <div
                className={`flex flex-col items-center gap-2 ${step >= idx + 1 ? "text-primary" : "text-gray-400"}`}
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${step >= idx + 1 ? "bg-primary text-white shadow-lg shadow-primary/30" : "bg-gray-100 dark:bg-white/5"}`}
                >
                  {step > idx + 1 ? <CheckCircle2 size={18} /> : idx + 1}
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest">
                  {s}
                </span>
              </div>
              {idx < STEPS.length - 1 && (
                <div
                  className={`flex-1 h-1 rounded-full ${step > idx + 1 ? "bg-primary" : "bg-gray-100 dark:bg-white/5"}`}
                />
              )}
            </React.Fragment>
          ))}
        </div>

        <div className="bg-white dark:bg-card border border-[color:var(--color-border)] rounded-[2.5rem] p-8 shadow-sm">
          {/* STEP 1: Basic Details */}
          {step === 1 && (
            <div className="space-y-6">
              <h3 className="text-xl font-black mb-6">
                Basic Property Information
              </h3>
              <div className="space-y-2">
                <label className="text-sm font-black text-gray-700 ml-1">
                  Property Title *
                </label>
                <input
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="e.g. Modern 2 BHK Flat in Kakkanad"
                  className={`w-full px-6 py-4 bg-gray-50/50 dark:bg-white/5 border ${validationErrors.title ? "border-red-500" : "border-[color:var(--color-border)]"} rounded-2xl focus:ring-2 focus:ring-primary/20 text-sm`}
                />
                {validationErrors.title && (
                  <p className="text-red-500 text-[10px] font-bold mt-1 ml-1">
                    {validationErrors.title}
                  </p>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-black text-gray-700 ml-1">
                    Property Type
                  </label>
                  <select
                    name="propertyType"
                    value={formData.propertyType}
                    onChange={handleInputChange}
                    className={`w-full px-6 py-4 bg-gray-50/50 dark:bg-white/5 border ${validationErrors.propertyType ? "border-red-500" : "border-border"} rounded-2xl text-sm`}
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
                  <label className="text-sm font-black text-gray-700 ml-1">
                    Area (Sq. Ft.)
                  </label>
                  <input
                    type="number"
                    name="areaSqft"
                    value={formData.areaSqft}
                    onChange={handleInputChange}
                    placeholder="e.g. 1200"
                    className="w-full px-6 py-4 bg-gray-50/50 dark:bg-white/5 border border-[color:var(--color-border)] rounded-2xl text-sm"
                  />
                </div>
              </div>

              {formData.propertyType !== "LAND" && (
                <>
                  {formData.propertyType !== "SHOP" && (
                    <div className="grid grid-cols-2 lg:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-black text-gray-700 ml-1">
                          BHK
                        </label>
                        <input
                          type="number"
                          name="bhk"
                          value={formData.bhk}
                          onChange={handleInputChange}
                          placeholder="e.g. 2"
                          className="w-full px-6 py-4 bg-gray-50/50 dark:bg-white/5 border border-[color:var(--color-border)] rounded-2xl text-sm"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-black text-gray-700 ml-1">
                          Bathrooms
                        </label>
                        <input
                          type="number"
                          name="bathrooms"
                          value={formData.bathrooms}
                          onChange={handleInputChange}
                          placeholder="e.g. 2"
                          className="w-full px-6 py-4 bg-gray-50/50 dark:bg-white/5 border border-[color:var(--color-border)] rounded-2xl text-sm"
                        />
                      </div>
                    </div>
                  )}
                  <div className="grid grid-cols-2 lg:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-black text-gray-700 ml-1">
                        Floor
                      </label>
                      <input
                        name="floorNumber"
                        value={formData.floorNumber}
                        onChange={handleInputChange}
                        placeholder="e.g. 2nd Floor"
                        className="w-full px-6 py-4 bg-gray-50/50 dark:bg-white/5 border border-[color:var(--color-border)] rounded-2xl text-sm"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-black text-gray-700 ml-1">
                        Age
                      </label>
                      <input
                        name="propertyAge"
                        value={formData.propertyAge}
                        onChange={handleInputChange}
                        placeholder="e.g. 2 years"
                        className="w-full px-6 py-4 bg-gray-50/50 dark:bg-white/5 border border-[color:var(--color-border)] rounded-2xl text-sm"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-black text-gray-700 ml-1">
                        Total Floors
                      </label>
                      <input
                        type="number"
                        name="totalFloors"
                        value={formData.totalFloors}
                        onChange={handleInputChange}
                        placeholder="e.g. 5"
                        className="w-full px-6 py-4 bg-gray-50/50 dark:bg-white/5 border border-[color:var(--color-border)] rounded-2xl text-sm"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-black text-gray-700 ml-1">
                        Facing
                      </label>
                      <input
                        name="facingDirection"
                        value={formData.facingDirection}
                        onChange={handleInputChange}
                        placeholder="e.g. East"
                        className="w-full px-6 py-4 bg-gray-50/50 dark:bg-white/5 border border-[color:var(--color-border)] rounded-2xl text-sm"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-black text-gray-700 ml-1">
                        Furnishing Status
                      </label>
                      <select
                        name="furnishingStatus"
                        value={formData.furnishingStatus}
                        onChange={handleInputChange}
                        className={`w-full px-6 py-4 bg-gray-50/50 dark:bg-white/5 border ${validationErrors.furnishingStatus ? "border-red-500" : "border-[color:var(--color-border)]"} rounded-2xl text-sm`}
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
                <label className="text-sm font-black text-gray-700 ml-1">
                  Description *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={4}
                  placeholder="Tell us about your property..."
                  className="w-full px-6 py-4 bg-gray-50/50 dark:bg-white/5 border border-[color:var(--color-border)] rounded-2xl text-sm"
                />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <h3 className="text-xl font-black mb-6">Location Details</h3>
              <div className="h-72 rounded-3xl overflow-hidden border-2 border-gray-100 relative bg-gray-50 flex items-center justify-center text-gray-400 font-bold">
                Map functionality temporarily disabled
              </div>
              <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm p-3 rounded-2xl shadow-xl text-xs font-bold text-gray-600 pointer-events-none">
                Click on the map to pin exact location
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-black text-gray-700 ml-1">
                    District *
                  </label>
                  <input
                    name="locationDistrict"
                    value={formData.locationDistrict}
                    onChange={handleInputChange}
                    className={`w-full px-6 py-4 bg-gray-50/50 dark:bg-white/5 border ${validationErrors.locationDistrict ? "border-red-500" : "border-[color:var(--color-border)]"} rounded-2xl text-sm`}
                  />
                  {validationErrors.locationDistrict && (
                    <p className="text-red-500 text-[10px] font-bold mt-1 ml-1">
                      {validationErrors.locationDistrict}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-black text-gray-700 ml-1">
                    City *
                  </label>
                  <input
                    name="locationCity"
                    value={formData.locationCity}
                    onChange={handleInputChange}
                    className={`w-full px-6 py-4 bg-gray-50/50 dark:bg-white/5 border ${validationErrors.locationCity ? "border-red-500" : "border-[color:var(--color-border)]"} rounded-2xl text-sm`}
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
                  <label className="text-sm font-black text-gray-700 ml-1">
                    Pincode *
                  </label>
                  <input
                    name="locationPinCode"
                    value={formData.locationPinCode}
                    onChange={handleInputChange}
                    className={`w-full px-6 py-4 bg-gray-50/50 dark:bg-white/5 border ${validationErrors.locationPinCode ? "border-red-500" : "border-[color:var(--color-border)]"} rounded-2xl text-sm`}
                  />
                  {validationErrors.locationPinCode && (
                    <p className="text-red-500 text-[10px] font-bold mt-1 ml-1">
                      {validationErrors.locationPinCode}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-black text-gray-700 ml-1">
                    Nearby Landmarks
                  </label>
                  <input
                    name="nearbyLandmarks"
                    value={formData.nearbyLandmarks}
                    onChange={handleInputChange}
                    className="w-full px-6 py-4 bg-gray-50/50 dark:bg-white/5 border border-[color:var(--color-border)] rounded-2xl text-sm"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-black text-gray-700 ml-1">
                  Full Address *
                </label>
                <textarea
                  name="fullAddress"
                  value={formData.fullAddress}
                  onChange={handleInputChange}
                  rows={2}
                  className={`w-full px-6 py-4 bg-gray-50/50 dark:bg-white/5 border ${validationErrors.fullAddress ? "border-red-500" : "border-[color:var(--color-border)]"} rounded-2xl text-sm`}
                />
                {validationErrors.fullAddress && (
                  <p className="text-red-500 text-[10px] font-bold mt-1 ml-1">
                    {validationErrors.fullAddress}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* STEP 3: Amenities */}
          {step === 3 && (
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
                      className={`flex items-center gap-3 p-4 rounded-2xl border-2 cursor-pointer transition-all ${formData.amenities.includes(amenity as string) ? "border-primary bg-primary/5 text-primary" : "border-gray-100 hover:border-gray-200 text-gray-600"}`}
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
                        className={`w-5 h-5 rounded flex items-center justify-center ${formData.amenities.includes(amenity as string) ? "bg-primary text-white" : "bg-gray-100"}`}
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
                <h3 className="text-xl font-black mb-4">
                  Preferred Tenant Type
                </h3>
                <div className="flex flex-wrap gap-4">
                  {TENANT_PREF_OPTIONS.map((type) => (
                    <label
                      key={type}
                      className={`px-6 py-3 rounded-2xl border-2 cursor-pointer transition-all text-sm font-bold ${formData.preferredTenantType.includes(type) ? "border-primary bg-primary text-white shadow-lg shadow-primary/30" : "border-gray-100 bg-white text-gray-500 hover:border-gray-200"}`}
                    >
                      <input
                        type="checkbox"
                        className="hidden"
                        checked={formData.preferredTenantType.includes(type)}
                        onChange={() =>
                          handleCheckboxArray("preferredTenantType", type)
                        }
                      />
                      {type}
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-xl font-black mb-4">
                  House Rules & Occupancy
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <label className="flex items-center gap-3 cursor-pointer p-4 rounded-xl border border-gray-100 hover:bg-gray-50">
                    <input
                      type="checkbox"
                      name="petsAllowed"
                      checked={formData.petsAllowed}
                      onChange={handleInputChange}
                      className="w-5 h-5 rounded text-primary focus:ring-primary"
                    />
                    <span className="text-sm font-bold text-gray-700">
                      Pets Allowed
                    </span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer p-4 rounded-xl border border-gray-100 hover:bg-gray-50">
                    <input
                      type="checkbox"
                      name="smokingAllowed"
                      checked={formData.smokingAllowed}
                      onChange={handleInputChange}
                      className="w-5 h-5 rounded text-primary focus:ring-primary"
                    />
                    <span className="text-sm font-bold text-gray-700">
                      Smoking Allowed
                    </span>
                  </label>
                  <div className="space-y-2">
                    <label className="text-xs font-black text-gray-500 uppercase tracking-widest ml-1">
                      Max Occupants
                    </label>
                    <input
                      type="number"
                      name="maximumOccupants"
                      value={formData.maximumOccupants}
                      onChange={handleInputChange}
                      placeholder="e.g. 4"
                      className="w-full px-4 py-3 bg-gray-50/50 dark:bg-white/5 border border-gray-100 rounded-xl text-sm"
                    />
                  </div>
                </div>
              </div>

              {formData.propertyType === "LAND" && (
                <div>
                  <h3 className="text-xl font-black mb-4">Land Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-black text-gray-500 uppercase tracking-widest ml-1">
                        Land Type
                      </label>
                      <input
                        name="landType"
                        value={formData.landType}
                        onChange={handleInputChange}
                        placeholder="e.g. Residential, Commercial"
                        className="w-full px-4 py-3 bg-gray-50/50 dark:bg-white/5 border border-gray-100 rounded-xl text-sm"
                      />
                    </div>
                    <label className="flex items-center gap-3 cursor-pointer p-4 rounded-xl border border-gray-100 hover:bg-gray-50 h-fit self-end">
                      <input
                        type="checkbox"
                        name="isCornerPlot"
                        checked={formData.isCornerPlot}
                        onChange={handleInputChange}
                        className="w-5 h-5 rounded text-primary focus:ring-primary"
                      />
                      <span className="text-sm font-bold text-gray-700">
                        Corner Plot
                      </span>
                    </label>
                    <div className="space-y-2">
                      <label className="text-xs font-black text-gray-500 uppercase tracking-widest ml-1">
                        Road Width (ft)
                      </label>
                      <input
                        type="number"
                        name="roadWidthFeet"
                        value={formData.roadWidthFeet}
                        onChange={handleInputChange}
                        placeholder="e.g. 30"
                        className="w-full px-4 py-3 bg-gray-50/50 dark:bg-white/5 border border-gray-100 rounded-xl text-sm"
                      />
                    </div>
                  </div>
                </div>
              )}

              {formData.propertyType === "SHOP" && (
                <div>
                  <h3 className="text-xl font-black mb-4">Business Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-black text-gray-500 uppercase tracking-widest ml-1">
                        Shop/Office Type
                      </label>
                      <input
                        name="shopType"
                        value={formData.shopType}
                        onChange={handleInputChange}
                        placeholder="e.g. Retail, Office Space"
                        className="w-full px-4 py-3 bg-gray-50/50 dark:bg-white/5 border border-gray-100 rounded-xl text-sm"
                      />
                    </div>
                    <label className="flex items-center gap-3 cursor-pointer p-4 rounded-xl border border-gray-100 hover:bg-gray-50 h-fit self-end">
                      <input
                        type="checkbox"
                        name="hasParking"
                        checked={formData.hasParking}
                        onChange={handleInputChange}
                        className="w-5 h-5 rounded text-primary focus:ring-primary"
                      />
                      <span className="text-sm font-bold text-gray-700">
                        Dedicated Parking Area
                      </span>
                    </label>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* STEP 4: Photos */}
          {step === 4 && (
            <div className="space-y-6">
              <h3 className="text-xl font-black mb-2">
                Upload Property Photos
              </h3>
              <p className="text-sm text-gray-500 font-bold mb-6">
                Upload up to 5 high-quality images. The first image will be set
                as primary.
              </p>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {previews.map((src, idx) => (
                  <div
                    key={src}
                    className="relative aspect-video md:aspect-square rounded-3xl overflow-hidden group border-2 border-gray-100 shadow-sm"
                  >
                    <img
                      src={src}
                      className="w-full h-full object-cover"
                      alt="Preview"
                    />
                    <button
                      type="button"
                      onClick={() => removeFile(idx)}
                      className="absolute top-2 right-2 p-1.5 bg-white/90 text-red-500 rounded-xl opacity-0 group-hover:opacity-100 transition-all shadow-sm"
                    >
                      <X size={14} />
                    </button>
                    {idx === 0 && (
                      <div className="absolute bottom-2 left-2 px-2 py-1 bg-primary text-white text-[8px] font-black uppercase rounded-lg">
                        Primary Cover
                      </div>
                    )}
                  </div>
                ))}

                {files.length < 5 && (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="aspect-video md:aspect-square rounded-3xl border-2 border-dashed border-gray-200 hover:border-primary hover:bg-primary/5 transition-all flex flex-col items-center justify-center gap-2 text-gray-400 hover:text-primary"
                  >
                    <Plus size={32} />
                    <span className="text-xs font-black uppercase tracking-widest">
                      Add Photo
                    </span>
                  </button>
                )}
              </div>
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                multiple
                accept="image/*"
                onChange={handleFileChange}
              />
            </div>
          )}

          {/* STEP 5: Pricing */}
          {step === 5 && (
            <div className="space-y-6">
              <h3 className="text-xl font-black mb-6">Pricing & Maintenance</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-black text-gray-700 ml-1">
                    Monthly Rent *
                  </label>
                  <div className="relative">
                    <span className="absolute left-6 top-1/2 -translate-y-1/2 font-black text-gray-400">
                      ₹
                    </span>
                    <input
                      type="number"
                      name="monthlyRent"
                      value={formData.monthlyRent}
                      onChange={handleInputChange}
                      className={`w-full pl-10 pr-6 py-4 bg-gray-50/50 dark:bg-white/5 border ${validationErrors.monthlyRent ? "border-red-500" : "border-[color:var(--color-border)]"} rounded-2xl text-sm`}
                    />
                  </div>
                  {validationErrors.monthlyRent && (
                    <p className="text-red-500 text-[10px] font-bold mt-1 ml-1">
                      {validationErrors.monthlyRent}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-black text-gray-700 ml-1">
                    Security Deposit *
                  </label>
                  <div className="relative">
                    <span className="absolute left-6 top-1/2 -translate-y-1/2 font-black text-gray-400">
                      ₹
                    </span>
                    <input
                      type="number"
                      name="depositAmount"
                      value={formData.depositAmount}
                      onChange={handleInputChange}
                      className={`w-full pl-10 pr-6 py-4 bg-gray-50/50 dark:bg-white/5 border ${validationErrors.depositAmount ? "border-red-500" : "border-[color:var(--color-border)]"} rounded-2xl text-sm`}
                    />
                  </div>
                  {validationErrors.depositAmount && (
                    <p className="text-red-500 text-[10px] font-bold mt-1 ml-1">
                      {validationErrors.depositAmount}
                    </p>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-gray-100">
                <div className="space-y-2">
                  <label className="text-sm font-black text-gray-700 ml-1">
                    Maintenance Charges
                  </label>
                  <div className="relative">
                    <span className="absolute left-6 top-1/2 -translate-y-1/2 font-black text-gray-400">
                      ₹
                    </span>
                    <input
                      type="number"
                      name="maintenanceCharges"
                      value={formData.maintenanceCharges}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-6 py-4 bg-gray-50/50 dark:bg-white/5 border border-[color:var(--color-border)] rounded-2xl text-sm"
                    />
                  </div>
                </div>
                <div className="space-y-2 flex flex-col justify-center pt-6">
                  <label className="flex items-center gap-3 cursor-pointer p-4 rounded-xl border border-gray-100 hover:bg-gray-50">
                    <input
                      type="checkbox"
                      name="maintenanceIncluded"
                      checked={formData.maintenanceIncluded}
                      onChange={handleInputChange}
                      className="w-5 h-5 rounded text-primary focus:ring-primary inline-block"
                    />
                    <span className="text-sm font-bold text-gray-700">
                      Maintenance is included in Rent
                    </span>
                  </label>
                </div>
              </div>

              <div className="bg-primary/5 border border-primary/20 rounded-3xl p-6 mt-8">
                <div className="flex items-center gap-3 text-primary mb-3">
                  <AlertCircle size={20} />
                  <h4 className="font-black">Submission Rules</h4>
                </div>
                <ul className="space-y-2 text-xs font-bold text-gray-600">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 size={12} className="text-primary" /> All
                    listings are moderated by AI for safety.
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 size={12} className="text-primary" /> Verified
                    owners get 3x higher response rates.
                  </li>
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* Wizard Controls */}
        <div className="flex justify-between items-center bg-white dark:bg-card border border-[color:var(--color-border)] rounded-[2.5rem] p-6 shadow-sm">
          <button
            type="button"
            onClick={prevStep}
            disabled={step === 1 || loading}
            className="flex items-center gap-2 px-6 py-3 font-bold text-gray-500 hover:bg-gray-100 rounded-2xl transition-all disabled:opacity-30"
          >
            <ChevronLeft size={20} /> Back
          </button>

          {step < 5 ? (
            <button
              type="button"
              onClick={nextStep}
              className="flex items-center gap-2 px-8 py-3 bg-primary text-white font-bold rounded-2xl shadow-lg shadow-primary/30 hover:scale-105 transition-all"
            >
              Next Step <ChevronRight size={20} />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading}
              className="flex items-center gap-2 px-8 py-3 bg-green-500 text-white font-black rounded-2xl shadow-xl shadow-green-500/30 hover:scale-105 transition-all disabled:opacity-50"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <CheckCircle2 size={20} />
              )}
              Publish Listing
            </button>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AddProperty;
