import React, { useState, useRef, useEffect } from "react";
import DashboardLayout from "../../../components/common/DashboardLayout";
import { useAppSelector } from "../../../hooks/useAppSelector";
import type { RootState } from "../../../app/store/store";
import type { RoleType } from "../../../types/constants/role.constant";
import { PAGE_ROUTES } from "../../../config/routes";
import { useNavigate, useParams } from "react-router-dom";
import { updateProperty, getPropertyPhotoUploadUrls } from "../services/propertyService";
import { usePropertyDetail } from "../hooks/usePropertyDetail";
import { getApiErrorMessage } from "../../../types/common";
import { PropertyTypes, type PropertyType, PropertyStatus } from "../../../types/constants/property.constant";
import { propertySchema } from "../schemas/propertySchemas";
import { toast } from "react-hot-toast";
import { LoadingOverlay } from "../../../components/common";
import type { PropertyData } from "../types/propertyTypes";
import { PropertyFormLayout } from "./partials/PropertyFormLayout";

import { StepBasicDetails } from "./steps/StepBasicDetails";
import { StepLocation } from "./steps/StepLocation";
import { StepAmenities } from "./steps/StepAmenities";
import { StepPhotos } from "./steps/StepPhotos";
import { StepPricing } from "./steps/StepPricing";

const EditProperty: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAppSelector((state: RootState) => state.auth);
  const { property, loading: fetching } = usePropertyDetail(id);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
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

  const [existingPhotos, setExistingPhotos] = useState<string[]>([]);
  const [newFiles, setNewFiles] = useState<File[]>([]);
  const [newPreviews, setNewPreviews] = useState<string[]>([]);

  useEffect(() => {
    if (property) {
      setFormData({
        title: property.title || "",
        description: property.description || "",
        propertyType: property.propertyType as PropertyType,
        bhk: property.bhk?.toString() || "",
        bathrooms: property.bathrooms?.toString() || "",
        floorNumber: property.floorNumber || "",
        totalFloors: property.totalFloors?.toString() || "",
        propertyAge: property.propertyAge || "",
        facingDirection: property.facingDirection || "",
        furnishingStatus: property.furnishingStatus || "",
        locationDistrict: property.locationDistrict || "",
        locationCity: property.locationCity || "",
        locationPinCode: property.locationPincode || "",
        fullAddress: property.fullAddress || "",
        nearbyLandmarks: property.nearbyLandmarks || "",
        latitude: property.latitude || 10.8505,
        longitude: property.longitude || 76.2711,
        amenities: property.amenities || [],
        preferredTenantType: property.preferredTenantType || [],
        monthlyRent: property.monthlyRent?.toString() || "",
        depositAmount: property.depositAmount?.toString() || "",
        maintenanceCharges: property.maintenanceCharges?.toString() || "0",
        maintenanceIncluded: property.maintenanceIncluded || false,
        areaSqft: property.areaSqft?.toString() || "",
        petsAllowed: property.petsAllowed || false,
        smokingAllowed: property.smokingAllowed || false,
        maximumOccupants: property.maximumOccupants?.toString() || "",
        landType: (property.landType || "RESIDENTIAL") as string,
        isCornerPlot: property.isCornerPlot || false,
        roadWidthFeet: property.roadWidthFeet?.toString() || "",
        shopType: (property.shopType || "") as string,
        hasParking: property.hasParking || false,
      });
      setExistingPhotos(property.photos || []);
    }
  }, [property]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const target = e.target as HTMLInputElement;
    const { name, value, type, checked } = target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    if (validationErrors[name]) {
      setValidationErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const handleCheckboxArray = (field: "amenities" | "preferredTenantType", value: string) => {
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
      const addedFiles = Array.from(e.target.files);
      const totalPhotos = existingPhotos.length + newFiles.length + addedFiles.length;
      if (totalPhotos > 5) {
        toast.error("Maximum 5 photos allowed.");
        return;
      }
      const updatedFiles = [...newFiles, ...addedFiles];
      setNewFiles(updatedFiles);
      const previews = updatedFiles.map((file) => URL.createObjectURL(file));
      setNewPreviews(previews);
    }
  };

  const removeExistingPhoto = (index: number) => {
    setExistingPhotos(existingPhotos.filter((_, i) => i !== index));
  };

  const removeNewFile = (index: number) => {
    setNewFiles(newFiles.filter((_, i) => i !== index));
    setNewPreviews(newPreviews.filter((_, i) => i !== index));
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

      if (step === 1) return ["title", "description", "propertyType"].includes(field);
      if (step === 2)
        return ["locationDistrict", "locationCity", "locationPinCode", "fullAddress"].includes(field);
      if (step === 5) return ["monthlyRent", "depositAmount"].includes(field);
      return false;
    });

    if (step === 4 && existingPhotos.length + newFiles.length === 0) {
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
    if (!id) return;
    setValidationErrors({});

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
      toast.error("Please fix validation errors");
      return;
    }

    try {
      setSubmitting(true);

      let finalPhotos = [...existingPhotos];

      if (newFiles.length > 0) {
        const filesMeta = newFiles.map((f) => ({
          fileName: f.name,
          contentType: f.type || "image/jpeg",
        }));
        const uploadRes = await getPropertyPhotoUploadUrls(filesMeta);
        const uploads = uploadRes.data.uploads;

        await Promise.all(
          uploads.map((u, idx) =>
            fetch(u.uploadUrl, {
              method: "PUT",
              headers: { "Content-Type": newFiles[idx].type || "image/jpeg" },
              body: newFiles[idx],
            }).then((r) => {
              if (!r.ok) throw new Error(`Upload failed for file ${idx + 1}`);
            })
          )
        );
        finalPhotos = [...finalPhotos, ...uploads.map((u) => u.publicUrl)];
      }

      await updateProperty(id, {
        ...result.data,
        photos: finalPhotos,
        primaryPhotoIndex: 0,
        status: PropertyStatus.PENDING_APPROVAL,
      } as Partial<PropertyData>);

      toast.success("Property updated successfully!");
      navigate(PAGE_ROUTES.OWNER_PROPERTY_DETAIL.replace(":id", id));
    } catch (err) {
      toast.error(getApiErrorMessage(err, "Failed to update property"));
    } finally {
      setSubmitting(false);
    }
  };

  if (fetching) return <LoadingOverlay />;

  return (
    <DashboardLayout role={user?.role as RoleType} userName={user?.fullname || "Owner"}>
      <div className="max-w-4xl mx-auto pb-20 space-y-8 animate-in fade-in duration-500">
        <PropertyFormLayout
          step={step}
          loading={submitting}
          prevStep={prevStep}
          nextStep={nextStep}
          handleSubmit={handleSubmit}
          isEdit={true}
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
              onLocationChange={(lat, lng) => setFormData((prev) => ({ ...prev, latitude: lat, longitude: lng }))}
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
              files={newFiles}
              previews={newPreviews}
              onFileChange={handleFileChange}
              onRemoveFile={removeNewFile}
              fileInputRef={fileInputRef}
              existingPhotos={existingPhotos}
              onRemoveExistingPhoto={removeExistingPhoto}
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

export default EditProperty;
