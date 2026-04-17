import React, { useMemo, useState } from "react";
import DashboardLayout from "../../../components/common/DashboardLayout";
import { useAppSelector } from "../../../hooks/useAppSelector";
import type { RootState } from "../../../app/store/store";
import type { RoleType } from "../../../types/constants/role.constant";
import { PAGE_ROUTES } from "../../../config/routes";
import { useNavigate } from "react-router-dom";
import { createProperty, getPropertyPhotoUploadUrls } from "../services/propertyService";
import type { CreatePropertyData } from "../types/propertyTypes";
import { getApiErrorMessage } from "../../../types/common";

const PROPERTY_TYPE_OPTIONS = ["HOUSE", "FLAT", "PG", "SHOP", "LAND"] as const;

type PropertyTypeOption = (typeof PROPERTY_TYPE_OPTIONS)[number];

const AddProperty: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAppSelector((state: RootState) => state.auth);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [propertyType, setPropertyType] = useState<PropertyTypeOption>("FLAT");
  const [locationDistrict, setLocationDistrict] = useState("");
  const [locationCity, setLocationCity] = useState("");
  const [locationPinCode, setLocationPinCode] = useState("");
  const [fullAddress, setFullAddress] = useState("");
  const [monthlyRent, setMonthlyRent] = useState<string>("");
  const [depositAmount, setDepositAmount] = useState<string>("");
  const [files, setFiles] = useState<File[]>([]);

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const canSubmit = useMemo(() => {
    return (
      title.trim().length > 0 &&
      description.trim().length > 0 &&
      locationDistrict.trim().length > 0 &&
      locationCity.trim().length > 0 &&
      locationPinCode.trim().length > 0 &&
      fullAddress.trim().length > 0 &&
      monthlyRent.trim().length > 0 &&
      depositAmount.trim().length > 0 &&
      files.length > 0
    );
  }, [depositAmount, files.length, description, fullAddress, locationCity, locationDistrict, locationPinCode, monthlyRent, title]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const next = e.target.files ? Array.from(e.target.files) : [];
    setFiles(next);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!canSubmit) {
      setError("Please fill all required fields and add at least one photo.");
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

      if (!uploads || uploads.length !== files.length) {
        throw new Error("Upload URL generation failed. Please try again.");
      }

      // Upload directly to S3 using the pre-signed PUT URLs.
      await Promise.all(
        uploads.map((u, idx) =>
          fetch(u.uploadUrl, {
            method: "PUT",
            headers: {
              "Content-Type": files[idx].type || "image/jpeg",
            },
            body: files[idx],
          }).then(async (r) => {
            if (!r.ok) {
              const text = await r.text().catch(() => "");
              throw new Error(text || `Failed uploading file ${idx + 1}`);
            }
          }),
        ),
      );

      const payload: CreatePropertyData = {
        title,
        description,
        propertyType,
        locationDistrict,
        locationCity,
        locationPinCode,
        fullAddress,
        monthlyRent: Number(monthlyRent),
        depositAmount: Number(depositAmount),
        photos: uploads.map((u) => u.publicUrl),
        primaryPhotoIndex: 0,
      };

      await createProperty(payload);
      navigate(PAGE_ROUTES.OWNER_PROPERTIES);
    } catch (err) {
      setError(getApiErrorMessage(err, "Failed to add property. Please try again."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout role={user?.role as RoleType} userName={user?.fullname || "Owner"}>
      <div className="max-w-3xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-black text-[color:var(--color-foreground)]">Add New Property</h1>
          <p className="text-gray-500">Create a listing and upload photos to S3.</p>
        </div>

        {error && (
          <div className="p-4 rounded-xl bg-red-50 border border-red-100 text-red-700 font-bold">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700">Title</label>
              <input value={title} onChange={(e) => setTitle(e.target.value)} className="w-full px-4 py-2.5 bg-white dark:bg-card border border-[color:var(--color-border)] rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm" />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700">Property Type</label>
              <select value={propertyType} onChange={(e) => setPropertyType(e.target.value as PropertyTypeOption)} className="w-full px-4 py-2.5 bg-white dark:bg-card border border-[color:var(--color-border)] rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm">
                {PROPERTY_TYPE_OPTIONS.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700">Description</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={4} className="w-full px-4 py-2.5 bg-white dark:bg-card border border-[color:var(--color-border)] rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700">District</label>
              <input value={locationDistrict} onChange={(e) => setLocationDistrict(e.target.value)} className="w-full px-4 py-2.5 bg-white dark:bg-card border border-[color:var(--color-border)] rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700">City</label>
              <input value={locationCity} onChange={(e) => setLocationCity(e.target.value)} className="w-full px-4 py-2.5 bg-white dark:bg-card border border-[color:var(--color-border)] rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700">Pin Code</label>
              <input value={locationPinCode} onChange={(e) => setLocationPinCode(e.target.value)} className="w-full px-4 py-2.5 bg-white dark:bg-card border border-[color:var(--color-border)] rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700">Full Address</label>
              <input value={fullAddress} onChange={(e) => setFullAddress(e.target.value)} className="w-full px-4 py-2.5 bg-white dark:bg-card border border-[color:var(--color-border)] rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700">Monthly Rent</label>
              <input value={monthlyRent} onChange={(e) => setMonthlyRent(e.target.value)} inputMode="decimal" className="w-full px-4 py-2.5 bg-white dark:bg-card border border-[color:var(--color-border)] rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700">Deposit Amount</label>
              <input value={depositAmount} onChange={(e) => setDepositAmount(e.target.value)} inputMode="decimal" className="w-full px-4 py-2.5 bg-white dark:bg-card border border-[color:var(--color-border)] rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700">Photos</label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileChange}
              className="w-full px-4 py-2.5 bg-white dark:bg-card border border-[color:var(--color-border)] rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm"
            />
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button
              type="submit"
              disabled={loading}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-primary text-white font-bold rounded-2xl shadow-lg shadow-primary/20 hover:scale-[1.02] transition-all disabled:opacity-50"
            >
              {loading ? "Adding..." : "Add Property"}
            </button>
            <button
              type="button"
              disabled={loading}
              onClick={() => navigate(PAGE_ROUTES.OWNER_PROPERTIES)}
              className="px-6 py-3 bg-white dark:bg-card border border-[color:var(--color-border)] text-gray-700 font-bold rounded-2xl hover:bg-gray-50 transition-all disabled:opacity-50"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default AddProperty;

