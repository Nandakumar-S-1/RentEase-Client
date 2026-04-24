import React, { useState } from "react";
import { Input } from "../../../components/common/Input";
import type { ProfileData, UpdateProfileData } from "../types/profileTypes";
import { useProfile } from "../hooks/useProfile";
import { Toast } from "../../../components/common/Toast";

interface PersonalInfoFormProps {
  profile: ProfileData;
}

const PersonalInfoForm: React.FC<PersonalInfoFormProps> = ({ profile }) => {
  const { saveProfile, updating } = useProfile();

  // Pre-calculate if we should show the "Other" occupation input
  const initialIsOther = profile.occupation
    ? !["Working Professional", "Student", "Business Owner"].includes(
      profile.occupation,
    )
    : false;

  const [isOtherOccupation, setIsOtherOccupation] = useState(initialIsOther);

  const [formData, setFormData] = useState<UpdateProfileData>({
    fullName: profile.fullName || "",
    phone: profile.phone || "",
    bio: profile.bio || "",
    occupation: profile.occupation || "",
  });

  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
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
          <p className="text-gray-500 font-medium text-sm">Update your public profile and contact info.</p>
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
            className="rounded-2xl border-gray-200 focus:ring-primary/20"
          />
          <Input
            label="Phone Number"
            name="phone"
            value={formData.phone || ""}
            onChange={handleChange}
            placeholder="+91 00000 00000"
            className="rounded-2xl border-gray-200 focus:ring-primary/20"
          />
        </div>

        {profile.role !== "ADMIN" && (
          <div className="space-y-8">
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
                      if (!initialIsOther)
                        setFormData((prev) => ({ ...prev, occupation: "" }));
                    } else {
                      setIsOtherOccupation(false);
                      setFormData((prev) => ({ ...prev, occupation: value }));
                    }
                  }}
                  className="w-full py-4 px-6 rounded-2xl border border-gray-200 focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all dark:bg-card dark:border-white/10 dark:text-foreground font-medium"
                >
                  <option value="">Select Category</option>
                  <option value="Working Professional">Working Professional</option>
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
                    className="rounded-2xl border-gray-200 focus:ring-primary/20"
                  />
                )}
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center ml-1">
                <label className="text-sm font-black text-gray-700 dark:text-gray-200">
                  Short Bio
                </label>
                <span
                  className={`text-[10px] font-black tracking-widest uppercase px-2 py-0.5 rounded-md ${(formData.bio?.length || 0) > 450
                      ? "bg-red-50 text-red-500"
                      : "bg-gray-50 text-gray-400"
                    }`}
                >
                  {formData.bio?.length || 0} / 500
                </span>
              </div>
              <textarea
                name="bio"
                rows={4}
                value={formData.bio || ""}
                onChange={handleChange}
                placeholder="A few words about yourself..."
                className="w-full py-4 px-6 rounded-[2rem] border border-gray-200 focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all dark:bg-card dark:border-white/10 dark:text-foreground resize-none font-medium text-sm leading-relaxed"
              />
            </div>
          </div>
        )}

        <div className="flex justify-end gap-4 pt-10">

          <button
            type="submit"
            disabled={updating}
            className="flex-1 lg:flex-none lg:w-64 py-4 bg-primary text-white font-black rounded-2xl shadow-xl shadow-primary/30 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50"
          >
            {updating ? "Saving Changes..." : "Save Profile"}
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
