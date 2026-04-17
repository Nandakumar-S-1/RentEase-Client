import React, { useState } from "react";
import { Input } from "../../../components/common/Input";
import { Button } from "../../../components/common/Button";
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
    ? !["Working Professional", "Student", "Business Owner"].includes(profile.occupation)
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
    if (formData.fullName.trim().length < 2) return "Name must be at least 2 characters";

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
    } catch (err: any) {
      setToast({ 
        message: err.response?.data?.message || "Failed to update profile.", 
        type: "error" 
      });
    }
  };

  return (
    <div className="bg-white dark:bg-card border border-border rounded-2xl p-8 shadow-sm">
      <h3 className="text-xl font-bold text-foreground mb-6 pb-4 border-b border-border">
        Personal Information
      </h3>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Full Name"
            name="fullName"
            value={formData.fullName || ""}
            onChange={handleChange}
            placeholder="Your full name"
            required
          />
          <Input
            label="Phone Number"
            name="phone"
            value={formData.phone || ""}
            onChange={handleChange}
            placeholder="+91 87654 32109"
          />
        </div>

        {profile.role !== "ADMIN" && (
          <>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-card-foreground">
                Occupation
              </label>
              <div className="space-y-3">
                <select
                  name="occupation"
                  value={isOtherOccupation ? "Other" : formData.occupation || ""}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value === "Other") {
                      setIsOtherOccupation(true);
                      // Keep previous value if it was already "Other"
                      if (!initialIsOther) setFormData(prev => ({ ...prev, occupation: "" }));
                    } else {
                      setIsOtherOccupation(false);
                      setFormData((prev) => ({ ...prev, occupation: value }));
                    }
                  }}
                  className="w-full py-2 px-4 rounded-lg border border-gray-200 focus:border-primary focus:outline-none transition dark:bg-card dark:border-white/10 dark:text-foreground"
                >
                  <option value="">Select Occupation</option>
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
                    placeholder="Specify your occupation"
                    required
                  />
                )}
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium text-card-foreground">
                  Bio
                </label>
                <span className={`text-[10px] font-bold tracking-wider uppercase ${
                  (formData.bio?.length || 0) > 450 ? "text-danger" : "text-muted-foreground"
                }`}>
                  {formData.bio?.length || 0} / 500
                </span>
              </div>
              <textarea
                name="bio"
                rows={4}
                value={formData.bio || ""}
                onChange={handleChange}
                placeholder="Tell us a little about yourself..."
                className="w-full py-2.5 px-4 rounded-xl border border-gray-200 focus:border-primary focus:outline-none transition dark:bg-card dark:border-white/10 dark:text-foreground resize-none text-sm"
              />
            </div>
          </>
        )}

        <div className="flex justify-end gap-3 pt-6 border-t border-border">
          <Button variant="secondary" type="button" disabled={updating} onClick={() => window.location.reload()}>
            Cancel
          </Button>
          <Button type="submit" loading={updating}>
            Save Changes
          </Button>
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
