import React, { useState } from "react";
import { Input } from "../../../components/common/Input";
import type {
  ProfileData,
  UpdateProfileData,
  UpdateProfileResponse,
} from "../types/profileTypes";
import { toast } from "react-hot-toast";
import { SlidersHorizontal } from "lucide-react";

interface PersonalInfoFormProps {
  profile: ProfileData;
  saveProfile: (data: UpdateProfileData) => Promise<UpdateProfileResponse>;
  isSaving: boolean;
}

const OCCUPATION_PRESETS = [
  "Working Professional",
  "Student",
  "Business Owner",
];

const PersonalInfoForm: React.FC<PersonalInfoFormProps> = ({
  profile,
  saveProfile,
  isSaving,
}) => {
  const [formData, setFormData] = useState<UpdateProfileData>({
    fullName: profile.fullName ?? "",
    phone: profile.phone ?? "",
    bio: profile.bio ?? "",
    occupation: profile.occupation ?? "",
  });

  const [isOtherOccupation, setIsOtherOccupation] = useState(
    profile.occupation
      ? !OCCUPATION_PRESETS.includes(profile.occupation)
      : false,
  );

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validate = (): string | null => {
    if (!formData.fullName?.trim()) return "Full name is required";
    if (formData.fullName.trim().length < 2)
      return "Name must be at least 2 characters";
    if (formData.phone && !/^\+?[0-9]{10,13}$/.test(formData.phone))
      return "Invalid phone number (e.g. +918765432109)";
    if (formData.bio && formData.bio.length > 500)
      return "Bio should be under 500 characters";
    if (isOtherOccupation && !formData.occupation?.trim())
      return "Please specify your occupation";
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errorMsg = validate();
    if (errorMsg) {
      toast.error(errorMsg);
      return;
    }
    try {
      await saveProfile(formData);
      toast.success("Profile updated successfully!");
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      toast.error(error.response?.data?.message || "Failed to update profile.");
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center gap-3 pb-6 border-b border-[color:var(--color-border)]">
        <div className="p-2.5 bg-primary/10 text-primary rounded-xl">
          <SlidersHorizontal size={18} />
        </div>
        <div>
          <h3 className="text-lg font-bold text-[color:var(--color-foreground)]">
            Configure Profile
          </h3>
          <p className="text-sm text-[color:var(--color-muted-foreground)]">
            Update your name, contact info, and a bit about yourself.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Name + Phone */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
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
          <>
            {/* Occupation */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-[color:var(--color-foreground)]">
                Occupation
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <select
                  name="occupation"
                  value={isOtherOccupation ? "Other" : formData.occupation || ""}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (val === "Other") {
                      setIsOtherOccupation(true);
                      setFormData((prev) => ({ ...prev, occupation: "" }));
                    } else {
                      setIsOtherOccupation(false);
                      setFormData((prev) => ({ ...prev, occupation: val }));
                    }
                  }}
                  className="w-full py-3 px-4 rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-surface)] text-[color:var(--color-foreground)] text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                >
                  <option value="" disabled hidden>
                    Select category
                  </option>
                  {OCCUPATION_PRESETS.map((o) => (
                    <option key={o} value={o}>
                      {o}
                    </option>
                  ))}
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

            {/* Bio */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="block text-sm font-semibold text-[color:var(--color-foreground)]">
                  Short Bio
                </label>
                <span className="text-xs text-[color:var(--color-muted-foreground)]">
                  {(formData.bio ?? "").length} / 500
                </span>
              </div>
              <textarea
                name="bio"
                rows={4}
                value={formData.bio ?? ""}
                onChange={handleChange}
                maxLength={500}
                placeholder="A few words about yourself..."
                className="w-full py-3 px-4 rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-surface)] text-[color:var(--color-foreground)] text-sm placeholder:text-[color:var(--color-muted-foreground)] focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none"
              />
            </div>
          </>
        )}

        {/* Submit */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={isSaving}
            className="px-8 py-3 bg-primary text-white rounded-xl text-sm font-semibold shadow-lg shadow-primary/20 hover:opacity-90 active:scale-95 transition-all disabled:opacity-50"
          >
            {isSaving ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Saving…
              </span>
            ) : (
              "Save Changes"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PersonalInfoForm;
