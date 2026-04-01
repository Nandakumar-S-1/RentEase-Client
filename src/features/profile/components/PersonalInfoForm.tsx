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
  const [formData, setFormData] = useState<UpdateProfileData>({
    fullName: profile.fullName || "",
    phone: profile.phone || "",
    bio: profile.bio || "",
    occupation: profile.occupation || "",
  });
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await saveProfile(formData);
      setToast({ message: "Profile updated successfully!", type: "success" });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      setToast({ message: "Failed to update profile.", type: "error" });
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
            placeholder="Aswathy S."
          />
          {/* <Input
            label="Email"
            name="email"
            value={profile.email || ""}
            onChange={() => {}}
            disabled={true}
            placeholder="aswathy@example.com"
          /> */}
          <Input
            label="Phone Number"
            name="phone"
            value={formData.phone || ""}
            onChange={handleChange}
            placeholder="+91 87654 32109"
          />
          <Input
            label="Alternate Phone"
            name="alternatePhone"
            value={""}
            onChange={() => { }}
            disabled={true}
            placeholder="Optional"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-card-foreground">
              Occupation
            </label>
            <select
              name="occupation"
              value={formData.occupation || ""}
              onChange={handleChange}
              className="w-full py-2 px-4 rounded-lg border border-gray-200 focus:border-primary focus:outline-none transition dark:bg-card dark:border-white/10 dark:text-foreground"
            >
              <option value="">Select Occupation</option>
              <option value="Working Professional">Working Professional</option>
              <option value="Student">Student</option>
              <option value="Business Owner">Business Owner</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <Input
            label="Company/Institution"
            name="company"
            value={""}
            onChange={() => { }}
            disabled={true}
            placeholder="Where you work/study"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium text-card-foreground">
            Bio
          </label>
          <textarea
            name="bio"
            rows={4}
            value={formData.bio || ""}
            onChange={handleChange}
            placeholder="Tell us a little about yourself..."
            className="w-full py-2 px-4 rounded-lg border border-gray-200 focus:border-primary focus:outline-none transition dark:bg-card dark:border-white/10 dark:text-foreground resize-none"
          />
        </div>

        <div className="flex justify-end gap-3 pt-6 border-t border-border">
          <Button variant="secondary" type="button" disabled={updating}>
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
