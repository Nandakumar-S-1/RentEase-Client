import React, { useState } from "react";
import { Input } from "../../../components/common/Input";
import type { ProfileData, UpdateProfileData, UpdateProfileResponse } from "../types/profileTypes";

import { Toast } from "../../../components/common/Toast";

interface PersonalInfoFormProps {
  profile: ProfileData;
  saveProfile: (data: UpdateProfileData) => Promise<UpdateProfileResponse>;
  isSaving: boolean;
}

const PersonalInfoForm: React.FC<PersonalInfoFormProps> = ({ profile, saveProfile, isSaving }) => {

  const [formData, setFormData] = useState<UpdateProfileData>({
    fullName: profile.fullName ?? "",
    phone: profile.phone ?? "",
    bio: profile.bio ?? "",
    occupation: profile.occupation ?? "",
  });

  const [isOtherOccupation, setIsOtherOccupation] = useState(
    profile.occupation
      ? !["Working Professional", "Student", "Business Owner"].includes(
        profile.occupation
      )
      : false
  );

  // No longer using useEffect for syncing props to avoid cascading renders.
  // Instead, the parent component should use a unique key if it needs to reset the form.

  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    if (!formData.fullName?.trim()) return "Full name is required";
    if (formData.fullName.trim().length < 2)
      return "Name must be at least 2 characters";

    if (formData.phone && !/^\+?[0-9]{10,13}$/.test(formData.phone)) {
      return "Invalid phone number (e.g., +918765432109)";
    }

    if (formData.bio && formData.bio.length > 500) {
      return "Bio should be under 500 characters";
    }

    if (isOtherOccupation && !formData.occupation?.trim()) {
      return "Please specify your occupation";
    }

    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const errorMsg = validate();
    if (errorMsg) {
      setToast({ message: errorMsg, type: "error" });
      return;
    }

    try {
      await saveProfile(formData);
      setToast({ message: "Profile updated successfully!", type: "success" });
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      setToast({
        message: error.response?.data?.message || "Failed to update profile.",
        type: "error",
      });
    }
  };

  return (
    <div className="space-y-10">
      <div className="flex items-center justify-between border-b border-gray-100 dark:border-white/5 pb-6">
        <div>
          <h3 className="text-2xl font-black text-gray-800 dark:text-white tracking-tight">
            Personal Information
          </h3>
          <p className="text-gray-500 font-medium text-sm">
            Update your public profile and contact info.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Input
            label="Full Name"
            name="fullName"
            value={formData.fullName || ""}
            onChange={handleChange}
            placeholder="e.g. Liam Anderson"
            required
          />
          <Input
            label="Phone Number"
            name="phone"
            value={formData.phone || ""}
            onChange={handleChange}
            placeholder="+91 00000 00000"
          />
        </div>

        {profile.role !== "ADMIN" && (
          <div className="space-y-8">
            {/* Occupation */}
            <div className="space-y-3">
              <label className="text-sm font-black text-gray-700 dark:text-gray-200 ml-1">
                Your Occupation
              </label>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <select
                  name="occupation"
                  value={
                    isOtherOccupation ? "Other" : formData.occupation || ""
                  }
                  onChange={(e) => {
                    const value = e.target.value;

                    if (value === "Other") {
                      setIsOtherOccupation(true);
                      setFormData((prev) => ({
                        ...prev,
                        occupation: "",
                      }));
                    } else {
                      setIsOtherOccupation(false);
                      setFormData((prev) => ({
                        ...prev,
                        occupation: value,
                      }));
                    }
                  }}
                  className="w-full py-4 px-6 rounded-2xl border border-gray-200 dark:bg-zinc-900 dark:text-white dark:border-white/10"
                >
                  <option value="" disabled hidden>Select Category</option>
                  <option value="Working Professional">
                    Working Professional
                  </option>
                  <option value="Student">Student</option>
                  <option value="Business Owner">Business Owner</option>
                  <option value="Other">Other</option>
                </select>

                {isOtherOccupation && (
                  <Input
                    name="occupation"
                    value={formData.occupation || ""}
                    onChange={handleChange}
                    placeholder="Specify occupation"
                    required
                  />
                )}
              </div>
            </div>
            <div className="space-y-3">
              <label className="text-sm font-black text-gray-700 dark:text-gray-200 ml-1">
                Short Bio
              </label>

              <textarea
                name="bio"
                rows={4}
                value={formData.bio}
                onChange={handleChange}
                placeholder="A few words about yourself..."
                className="w-full py-4 px-6 rounded-[2rem] border border-gray-200 dark:bg-zinc-900 dark:text-white dark:border-white/10"
              />
            </div>
          </div>
        )}

        <div className="flex justify-end pt-10">
          <button
            type="submit"
            disabled={isSaving}
            className="py-4 px-12 bg-primary text-white rounded-2xl font-black shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50"
          >
            {isSaving ? "Saving..." : "Save Profile"}
          </button>
        </div>
      </form>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
};

export default PersonalInfoForm;
