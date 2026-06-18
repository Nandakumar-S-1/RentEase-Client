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

import { toast } from "react-hot-toast";
import {
  PropertyTypes,
  type PropertyType,
} from "../../../types/constants/property.constant";
import { propertySchema } from "../schemas/propertySchemas";
import { PropertyFormLayout } from "./partials/PropertyFormLayout";

// Step components
import { StepBasicDetails } from "./steps/StepBasicDetails";
import { StepLocation } from "./steps/StepLocation";
import { StepAmenities } from "./steps/StepAmenities";
import { StepPhotos } from "./steps/StepPhotos";
import { StepPricing } from "./steps/StepPricing";

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

    setFormData((prev) => {
      const updates: Record<string, unknown> = {
        [name]: type === "checkbox" ? checked : value,
      };

      // If property type changes to SHOP or LAND, clear maximumOccupants
      if (name === "propertyType" && (value === "SHOP" || value === "LAND")) {
        updates.maximumOccupants = "";
      }

      return { ...prev, ...updates };
    });

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
      monthlyRent: formData.monthlyRent
        ? Number(formData.monthlyRent)
        : undefined,
      depositAmount: formData.depositAmount
        ? Number(formData.depositAmount)
        : undefined,
      maintenanceCharges: Number(formData.maintenanceCharges || 0),
      areaSqft: formData.areaSqft ? Number(formData.areaSqft) : null,
      bhk: formData.bhk ? Number(formData.bhk) : null,
      bathrooms: formData.bathrooms ? Number(formData.bathrooms) : null,
      maximumOccupants: formData.maximumOccupants
        ? Number(formData.maximumOccupants)
        : null,
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
      if (step === 3) return ["maximumOccupants"].includes(field);
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

    const validationData = {
      ...formData,
      monthlyRent: Number(formData.monthlyRent),
      depositAmount: Number(formData.depositAmount),
      maintenanceCharges: Number(formData.maintenanceCharges || 0),
      areaSqft: formData.areaSqft ? Number(formData.areaSqft) : null,
      bhk: formData.bhk ? Number(formData.bhk) : null,
      bathrooms: formData.bathrooms ? Number(formData.bathrooms) : null,
      totalFloors: formData.totalFloors ? Number(formData.totalFloors) : null,
      maximumOccupants: formData.maximumOccupants
        ? Number(formData.maximumOccupants)
        : null,
      roadWidthFeet: formData.roadWidthFeet
        ? Number(formData.roadWidthFeet)
        : null,
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
      const error = err as {
        response?: { data?: { errors?: Record<string, string | string[]> } };
      };
      const apiErrors = error?.response?.data?.errors;
      if (apiErrors) {
        const errors: Record<string, string> = {};
        Object.entries(apiErrors).forEach(([key, messages]) => {
          errors[key] = Array.isArray(messages)
            ? messages[0]
            : (messages as string);
        });
        setValidationErrors(errors);
        toast.error("Please fix the validation errors");
      } else {
        toast.error(getApiErrorMessage(err, "Failed to add property"));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout
      role={user?.role as RoleType}
      userName={user?.fullname || "User"}
    >
      <div className="max-w-4xl mx-auto pb-20 space-y-8 animate-in fade-in duration-500">
        <PropertyFormLayout
          step={step}
          loading={loading}
          prevStep={prevStep}
          nextStep={nextStep}
          handleSubmit={handleSubmit}
        >
          {step === 1 && (
            <StepBasicDetails
              formData={formData}
              validationErrors={validationErrors}
              handleInputChange={handleInputChange}
            />
          )}

          {step === 2 && (
            <StepLocation
              formData={formData}
              validationErrors={validationErrors}
              handleInputChange={handleInputChange}
              onLocationChange={(lat, lng) =>
                setFormData((prev) => ({
                  ...prev,
                  latitude: lat,
                  longitude: lng,
                }))
              }
              onAddressFetch={(addr) => {
                setFormData((prev) => ({
                  ...prev,
                  locationDistrict: addr.district || prev.locationDistrict,
                  locationCity: addr.city || prev.locationCity,
                  locationPinCode: addr.pincode || prev.locationPinCode,
                  fullAddress: addr.formattedAddress || prev.fullAddress,
                }));
              }}
            />
          )}

          {step === 3 && (
            <StepAmenities
              formData={formData}
              validationErrors={validationErrors}
              handleInputChange={handleInputChange}
              handleCheckboxArray={handleCheckboxArray}
            />
          )}

          {step === 4 && (
            <StepPhotos
              files={files}
              previews={previews}
              onFileChange={handleFileChange}
              onRemoveFile={removeFile}
              fileInputRef={fileInputRef}
            />
          )}

          {step === 5 && (
            <StepPricing
              formData={formData}
              validationErrors={validationErrors}
              handleInputChange={handleInputChange}
            />
          )}
        </PropertyFormLayout>
      </div>
    </DashboardLayout>
  );
};

export default AddProperty;
