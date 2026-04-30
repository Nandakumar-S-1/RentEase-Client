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
import { z } from "zod";
import { X, Plus, CheckCircle2, ChevronRight, ChevronLeft } from "lucide-react";
// import Map, { Marker, type MapMouseEvent } from "react-map-gl/mapbox";
// import "mapbox-gl/dist/mapbox-gl.css";
// import mapboxgl from "mapbox-gl";
import { toast } from "react-hot-toast";
import { LoadingOverlay } from "../../../components/common";
import type { PropertyData } from "../types/propertyTypes";

// const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;
// mapboxgl.accessToken = MAPBOX_TOKEN;

const PROPERTY_TYPE_OPTIONS = ["HOUSE", "FLAT", "PG", "SHOP", "LAND"] as const;
type PropertyTypeOption = (typeof PROPERTY_TYPE_OPTIONS)[number];

const AMENITIES_OPTIONS = [
  "2-wheeler Parking", "4-wheeler Parking", "WIFI", "Power Backup",
  "Water Supply 24/7", "Security", "Lift", "Gym", "Swimming Pool",
  "Club House", "Park", "Intercom"
];

const propertySchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters").max(100),
  description: z.string().min(20, "Description must be at least 20 characters").max(2000),
  propertyType: z.enum(PROPERTY_TYPE_OPTIONS),
  bhk: z.number().int().positive().optional().nullable(),
  bathrooms: z.number().int().positive().optional().nullable(),
  floorNumber: z.string().optional().nullable(),
  propertyAge: z.string().optional().nullable(),
  facingDirection: z.string().optional().nullable(),
  furnishingStatus: z.string().optional().nullable(),

  locationDistrict: z.string().min(2, "District is required"),
  locationCity: z.string().min(2, "City is required"),
  locationPinCode: z.string().regex(/^\d{6}$/, "Pin code must be exactly 6 digits"),
  fullAddress: z.string().min(10, "Address is too short"),
  nearbyLandmarks: z.string().max(200).optional().nullable(),
  latitude: z.number().optional().nullable(),
  longitude: z.number().optional().nullable(),

  amenities: z.array(z.string()).optional(),
  preferredTenantType: z.array(z.string()).optional(),

  monthlyRent: z.number().positive("Rent must be positive"),
  depositAmount: z.number().positive("Deposit must be positive"),
  maintenanceCharges: z.number().nonnegative().optional(),
  maintenanceIncluded: z.boolean().optional(),
  areaSqft: z.number().positive("Area must be positive").optional().nullable(),
});

const STEPS = ["Basic Details", "Location", "Amenities", "Photos", "Pricing"];

const EditProperty: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAppSelector((state: RootState) => state.auth);
  const { property, loading: fetching } = usePropertyDetail(id);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [isModalOpen, setIsModalOpen] = useState<{ type: 'delete' | 'unlist' | 'cancel'; isOpen: boolean }>({ type: 'cancel', isOpen: false });

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    propertyType: "FLAT" as PropertyTypeOption,
    bhk: "",
    bathrooms: "",
    floorNumber: "",
    propertyAge: "",
    facingDirection: "",
    furnishingStatus: "Semi-Furnished",

    locationDistrict: "",
    locationCity: "",
    locationPinCode: "",
    fullAddress: "",
    nearbyLandmarks: "",
    latitude: 10.8505,
    longitude: 76.2711,

    amenities: [] as string[],
    preferredTenantType: [] as string[],

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
        propertyType: property.propertyType as PropertyTypeOption,
        bhk: property.bhk?.toString() || "",
        bathrooms: property.bathrooms?.toString() || "",
        floorNumber: property.floorNumber || "",
        propertyAge: property.propertyAge || "",
        facingDirection: property.facingDirection || "",
        furnishingStatus: property.furnishingStatus || "Semi-Furnished",
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
      });
      setExistingPhotos(property.photos || []);
    }
  }, [property]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const target = e.target as HTMLInputElement;
    const { name, value, type, checked } = target;
    setFormData((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));

    // Clear validation error when user types
    if (validationErrors[name]) {
      setValidationErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const handleCheckboxArray = (field: "amenities" | "preferredTenantType", value: string) => {
    setFormData(prev => {
      const current = prev[field];
      const updated = current.includes(value) ? current.filter(item => item !== value) : [...current, value];
      return { ...prev, [field]: updated };
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const addedFiles = Array.from(e.target.files);
      const totalPhotos = existingPhotos.length + newFiles.length + addedFiles.length;
      if (totalPhotos > 10) {
        toast.error("Maximum 10 photos allowed.");
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

  const handleMapClick = (e: any) => {
    // const { lng, lat } = e.lngLat;
    // setFormData((prev) => ({ ...prev, latitude: lat, longitude: lng }));
    // toast.success("Location updated!", { icon: "📍" });
  };

  const validateCurrentStep = () => {
    const errors: Record<string, string> = {};

    if (step === 1) {
      if (!formData.title || formData.title.length < 5) errors.title = "Title must be at least 5 characters";
      if (!formData.description || formData.description.length < 20) errors.description = "Description must be at least 20 characters";
      if (!formData.propertyType) errors.propertyType = "Property type is required";
    }

    if (step === 2) {
      if (!formData.locationDistrict) errors.locationDistrict = "District is required";
      if (!formData.locationCity) errors.locationCity = "City is required";
      if (!formData.locationPinCode || !/^\d{6}$/.test(formData.locationPinCode)) errors.locationPinCode = "Valid 6-digit pin code is required";
    }

    if (step === 4) {
      if (existingPhotos.length + newFiles.length === 0) {
        toast.error("At least 1 photo is required.");
        return false;
      }
    }

    if (step === 5) {
      if (!formData.monthlyRent || Number(formData.monthlyRent) <= 0) errors.monthlyRent = "Monthly rent must be positive";
      if (!formData.depositAmount || Number(formData.depositAmount) <= 0) errors.depositAmount = "Security deposit must be positive";
    }

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      toast.error("Please fill required fields correctly.");
      return false;
    }

    return true;
  };

  const nextStep = () => {
    if (validateCurrentStep()) setStep(s => Math.min(5, s + 1));
  };
  const prevStep = () => setStep(s => Math.max(1, s - 1));

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
    };

    const result = propertySchema.safeParse(validationData);
    if (!result.success) {
      const errors: Record<string, string> = {};
      result.error.issues.forEach((issue) => { errors[issue.path[0]?.toString() || "unknown"] = issue.message; });
      setValidationErrors(errors);
      toast.error("Please fix validation errors");
      return;
    }

    try {
      setSubmitting(true);

      let finalPhotos = [...existingPhotos];

      if (newFiles.length > 0) {
        const filesMeta = newFiles.map((f) => ({ fileName: f.name, contentType: f.type || "image/jpeg" }));
        const uploadRes = await getPropertyPhotoUploadUrls(filesMeta);
        const uploads = uploadRes.data.uploads;

        await Promise.all(
          uploads.map((u, idx) =>
            fetch(u.uploadUrl, {
              method: "PUT",
              headers: { "Content-Type": newFiles[idx].type || "image/jpeg" },
              body: newFiles[idx]
            }).then((r) => { if (!r.ok) throw new Error(`Upload failed for file ${idx + 1}`); })
          )
        );
        finalPhotos = [...finalPhotos, ...uploads.map(u => u.publicUrl)];
      }

      await updateProperty(id, {
        ...result.data,
        photos: finalPhotos,
        primaryPhotoIndex: 0,
        status: "PENDING_APPROVAL",
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
      <div className="max-w-4xl mx-auto space-y-8 pb-20">
        <div className="flex justify-between items-end">
          <div className="space-y-1">
            <h1 className="text-4xl font-black text-[color:var(--color-foreground)] tracking-tight">Edit Property</h1>
            <p className="text-gray-500 font-medium tracking-wide">Step {step} of 5: {STEPS[step - 1]}</p>
          </div>
          <button onClick={() => navigate(-1)} className="px-6 py-2.5 bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-400 font-bold rounded-2xl hover:bg-gray-200 transition-all text-sm">
            Cancel
          </button>
        </div>

        {/* Progress Bar (Borrowed from AddProperty) */}
        <div className="flex items-center gap-2 mb-8">
          {STEPS.map((s, idx) => (
            <React.Fragment key={s}>
              <div className={`flex flex-col items-center gap-2 ${step >= idx + 1 ? "text-primary" : "text-gray-400"}`}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${step >= idx + 1 ? "bg-primary text-white shadow-lg shadow-primary/30" : "bg-gray-100 dark:bg-white/5"}`}>
                  {step > idx + 1 ? <CheckCircle2 size={18} /> : idx + 1}
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest">{s}</span>
              </div>
              {idx < STEPS.length - 1 && <div className={`flex-1 h-1 rounded-full ${step > idx + 1 ? "bg-primary" : "bg-gray-100 dark:bg-white/5"}`} />}
            </React.Fragment>
          ))}
        </div>

        <div className="bg-white dark:bg-card border border-[color:var(--color-border)] rounded-[2.5rem] p-8 shadow-sm">
          {/* Reuse Step UI from AddProperty with small adjustments for Edit mode */}
          {step === 1 && (
            <div className="space-y-6">
              <h3 className="text-xl font-black mb-6">Basic Property Information</h3>
              <div className="space-y-2">
                <label className="text-sm font-black text-gray-700 ml-1">Property Title *</label>
                <input name="title" value={formData.title} onChange={handleInputChange} className={`w-full px-6 py-4 bg-gray-50/50 dark:bg-white/5 border ${validationErrors.title ? 'border-red-500' : 'border-border'} rounded-2xl text-sm`} />
                {validationErrors.title && <p className="text-red-500 text-[10px] font-bold mt-1 ml-1">{validationErrors.title}</p>}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-black text-gray-700 ml-1">Property Type</label>
                  <select name="propertyType" value={formData.propertyType} onChange={handleInputChange} className={`w-full px-6 py-4 bg-gray-50/50 dark:bg-white/5 border ${validationErrors.propertyType ? 'border-red-500' : 'border-border'} rounded-2xl text-sm`}>
                    <option value="">Select Type</option>
                    {PROPERTY_TYPE_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                  </select>
                  {validationErrors.propertyType && <p className="text-red-500 text-[10px] font-bold mt-1 ml-1">{validationErrors.propertyType}</p>}
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-black text-gray-700 ml-1">Area (Sq. Ft.)</label>
                  <input type="number" name="areaSqft" value={formData.areaSqft} onChange={handleInputChange} className={`w-full px-6 py-4 bg-gray-50/50 dark:bg-white/5 border ${validationErrors.areaSqft ? 'border-red-500' : 'border-border'} rounded-2xl text-sm`} />
                  {validationErrors.areaSqft && <p className="text-red-500 text-[10px] font-bold mt-1 ml-1">{validationErrors.areaSqft}</p>}
                </div>
              </div>

              {formData.propertyType !== "LAND" && (
                <>
                  {formData.propertyType !== "SHOP" && (
                    <div className="grid grid-cols-2 lg:grid-cols-2 gap-4">
                      <div className="space-y-2"><label className="text-sm font-black text-gray-700 ml-1">BHK</label><input type="number" name="bhk" value={formData.bhk} onChange={handleInputChange} className="w-full px-6 py-4 bg-gray-50/50 dark:bg-white/5 border border-border rounded-2xl text-sm" /></div>
                      <div className="space-y-2"><label className="text-sm font-black text-gray-700 ml-1">Bathrooms</label><input type="number" name="bathrooms" value={formData.bathrooms} onChange={handleInputChange} className="w-full px-6 py-4 bg-gray-50/50 dark:bg-white/5 border border-border rounded-2xl text-sm" /></div>
                    </div>
                  )}
                  <div className="grid grid-cols-2 lg:grid-cols-2 gap-4">
                    <div className="space-y-2"><label className="text-sm font-black text-gray-700 ml-1">Floor</label><input name="floorNumber" value={formData.floorNumber} onChange={handleInputChange} className="w-full px-6 py-4 bg-gray-50/50 dark:bg-white/5 border border-border rounded-2xl text-sm" /></div>
                    <div className="space-y-2"><label className="text-sm font-black text-gray-700 ml-1">Age</label><input name="propertyAge" value={formData.propertyAge} onChange={handleInputChange} className="w-full px-6 py-4 bg-gray-50/50 dark:bg-white/5 border border-border rounded-2xl text-sm" /></div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-black text-gray-700 ml-1">Facing</label>
                      <input name="facingDirection" value={formData.facingDirection} onChange={handleInputChange} className="w-full px-6 py-4 bg-gray-50/50 dark:bg-white/5 border border-border rounded-2xl text-sm" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-black text-gray-700 ml-1">Furnishing Status</label>
                      <select name="furnishingStatus" value={formData.furnishingStatus} onChange={handleInputChange} className="w-full px-6 py-4 bg-gray-50/50 dark:bg-white/5 border border-border rounded-2xl text-sm">
                        <option value="Unfurnished">Unfurnished</option>
                        <option value="Semi-Furnished">Semi-Furnished</option>
                        <option value="Fully Furnished">Fully Furnished</option>
                      </select>
                    </div>
                  </div>
                </>
              )}

              <div className="space-y-2">
                <label className="text-sm font-black text-gray-700 ml-1">Description *</label>
                <textarea name="description" value={formData.description} onChange={handleInputChange} rows={4} className={`w-full px-6 py-4 bg-gray-50/50 dark:bg-white/5 border ${validationErrors.description ? 'border-red-500' : 'border-border'} rounded-2xl text-sm`} />
                {validationErrors.description && <p className="text-red-500 text-[10px] font-bold mt-1 ml-1">{validationErrors.description}</p>}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <h3 className="text-xl font-black mb-6">Location Details</h3>
              <div className="h-72 rounded-3xl overflow-hidden border-2 border-gray-100 relative bg-gray-50 flex items-center justify-center text-gray-400 font-bold">
                Map functionality temporarily disabled
                {/* <Map mapboxAccessToken={MAPBOX_TOKEN} initialViewState={{ longitude: formData.longitude, latitude: formData.latitude, zoom: 12 }} style={{ width: "100%", height: "100%" }} mapStyle="mapbox://styles/mapbox/streets-v11" onClick={handleMapClick}>
                  <Marker longitude={formData.longitude ?? 76.2711} latitude={formData.latitude ?? 10.8505} color="#ef4444" />
                </Map> */}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-black text-gray-700 ml-1">District *</label>
                  <input name="locationDistrict" value={formData.locationDistrict} onChange={handleInputChange} className={`w-full px-6 py-4 bg-gray-50/50 dark:bg-white/5 border ${validationErrors.locationDistrict ? 'border-red-500' : 'border-border'} rounded-2xl text-sm`} />
                  {validationErrors.locationDistrict && <p className="text-red-500 text-[10px] font-bold mt-1 ml-1">{validationErrors.locationDistrict}</p>}
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-black text-gray-700 ml-1">City *</label>
                  <input name="locationCity" value={formData.locationCity} onChange={handleInputChange} className={`w-full px-6 py-4 bg-gray-50/50 dark:bg-white/5 border ${validationErrors.locationCity ? 'border-red-500' : 'border-border'} rounded-2xl text-sm`} />
                  {validationErrors.locationCity && <p className="text-red-500 text-[10px] font-bold mt-1 ml-1">{validationErrors.locationCity}</p>}
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-black text-gray-700 ml-1">Pincode *</label>
                  <input name="locationPinCode" value={formData.locationPinCode} onChange={handleInputChange} className={`w-full px-6 py-4 bg-gray-50/50 dark:bg-white/5 border ${validationErrors.locationPinCode ? 'border-red-500' : 'border-border'} rounded-2xl text-sm`} />
                  {validationErrors.locationPinCode && <p className="text-red-500 text-[10px] font-bold mt-1 ml-1">{validationErrors.locationPinCode}</p>}
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-black text-gray-700 ml-1">Full Address *</label>
                  <input name="fullAddress" value={formData.fullAddress} onChange={handleInputChange} className={`w-full px-6 py-4 bg-gray-50/50 dark:bg-white/5 border ${validationErrors.fullAddress ? 'border-red-500' : 'border-border'} rounded-2xl text-sm`} />
                  {validationErrors.fullAddress && <p className="text-red-500 text-[10px] font-bold mt-1 ml-1">{validationErrors.fullAddress}</p>}
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-8">
              <div>
                <h3 className="text-xl font-black mb-4">Amenities</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {AMENITIES_OPTIONS.map(amenity => (
                    <label key={amenity} className={`flex items-center gap-3 p-4 rounded-2xl border-2 cursor-pointer transition-all ${formData.amenities.includes(amenity) ? "border-primary bg-primary/5 text-primary" : "border-gray-100 hover:border-gray-200 text-gray-600"}`}>
                      <input type="checkbox" className="hidden" checked={formData.amenities.includes(amenity)} onChange={() => handleCheckboxArray('amenities', amenity)} />
                      <span className="text-sm font-bold">{amenity}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-8">
              <h3 className="text-xl font-black mb-2">Manage Photos</h3>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {/* Existing Photos */}
                {existingPhotos.map((src, idx) => (
                  <div key={`existing-${idx}`} className="relative aspect-square rounded-2xl overflow-hidden group border border-gray-100">
                    <img src={src} className="w-full h-full object-cover" alt="Existing" />
                    <button type="button" onClick={() => removeExistingPhoto(idx)} className="absolute top-2 right-2 p-1.5 bg-white text-red-500 rounded-xl shadow-sm"><X size={14} /></button>
                    <div className="absolute top-2 left-2 px-2 py-0.5 bg-emerald-500 text-white text-[8px] font-black rounded-md">Live</div>
                  </div>
                ))}

                {/* New Previews */}
                {newPreviews.map((src, idx) => (
                  <div key={`new-${idx}`} className="relative aspect-square rounded-2xl overflow-hidden group border-2 border-primary/20">
                    <img src={src} className="w-full h-full object-cover" alt="New" />
                    <button type="button" onClick={() => removeNewFile(idx)} className="absolute top-2 right-2 p-1.5 bg-white text-red-500 rounded-xl"><X size={14} /></button>
                    <div className="absolute top-2 left-2 px-2 py-0.5 bg-primary text-white text-[8px] font-black rounded-md">New</div>
                  </div>
                ))}

                <button type="button" onClick={() => fileInputRef.current?.click()} className="aspect-square rounded-2xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center gap-2 text-gray-400 hover:border-primary hover:text-primary transition-all">
                  <Plus size={24} />
                  <span className="text-[10px] font-black uppercase tracking-widest">Add More</span>
                </button>
              </div>
              <input type="file" ref={fileInputRef} className="hidden" multiple accept="image/*" onChange={handleFileChange} />
            </div>
          )}

          {step === 5 && (
            <div className="space-y-6">
              <h3 className="text-xl font-black mb-6">Pricing & Maintenance</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-black text-gray-700 ml-1">Monthly Rent *</label>
                  <input type="number" name="monthlyRent" value={formData.monthlyRent} onChange={handleInputChange} className={`w-full px-6 py-4 bg-gray-50/50 dark:bg-white/5 border ${validationErrors.monthlyRent ? 'border-red-500' : 'border-border'} rounded-2xl text-sm`} />
                  {validationErrors.monthlyRent && <p className="text-red-500 text-[10px] font-bold mt-1 ml-1">{validationErrors.monthlyRent}</p>}
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-black text-gray-700 ml-1">Security Deposit *</label>
                  <input type="number" name="depositAmount" value={formData.depositAmount} onChange={handleInputChange} className={`w-full px-6 py-4 bg-gray-50/50 dark:bg-white/5 border ${validationErrors.depositAmount ? 'border-red-500' : 'border-border'} rounded-2xl text-sm`} />
                  {validationErrors.depositAmount && <p className="text-red-500 text-[10px] font-bold mt-1 ml-1">{validationErrors.depositAmount}</p>}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Wizard Controls */}
        <div className="flex justify-between items-center bg-white dark:bg-card border border-border rounded-[2.5rem] p-6 shadow-sm">
          <button type="button" onClick={prevStep} disabled={step === 1 || submitting} className="flex items-center gap-2 px-6 py-3 font-bold text-gray-500 hover:bg-gray-100 rounded-2xl transition-all disabled:opacity-30">
            <ChevronLeft size={20} /> Back
          </button>

          {step < 5 ? (
            <button type="button" onClick={nextStep} className="flex items-center gap-2 px-8 py-3 bg-primary text-white font-bold rounded-2xl shadow-lg shadow-primary/30 hover:scale-105 transition-all">
              Next Step <ChevronRight size={20} />
            </button>
          ) : (
            <button type="button" onClick={handleSubmit} disabled={submitting} className="flex items-center gap-2 px-8 py-3 bg-primary text-white font-black rounded-2xl shadow-xl shadow-primary/30 hover:scale-105 transition-all disabled:opacity-50">
              {submitting ? "Updating..." : "Save Changes"}
            </button>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default EditProperty;
