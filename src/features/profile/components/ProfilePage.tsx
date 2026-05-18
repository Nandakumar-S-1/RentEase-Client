import React, { useState } from "react";
import DashboardLayout from "../../../components/common/DashboardLayout";
import { useProfile } from "../hooks/useProfile";
import ProfileCard from "./ProfileCard";
import PersonalInfoForm from "./PersonalInfoForm";
import ChangePasswordForm from "./ChangePasswordForm";
import type { RoleType } from "../../../types/constants/role.constant";
import { LoadingOverlay } from "../../../components/common";
import {
  Camera,
  ShieldCheck,
  Settings2,
  BellRing,
  UserCog,
} from "lucide-react";
import type { UpdateProfileData } from "../types/profileTypes";

const ProfilePage: React.FC = () => {
  const { profile, loading, updating, saveProfile, error, uploadAvatar } =
    useProfile();
  const [activeTab, setActiveTab] = useState("profile");
  const tabs = [
    { id: "profile", label: "Identity", icon: UserCog },
    { id: "preferences", label: "Preferences", icon: Settings2 },
    { id: "notifications", label: "Alerts", icon: BellRing },
    { id: "security", label: "Security", icon: ShieldCheck },
  ];
  const [resetKey, setResetKey] = useState(0);

  const handleSaveProfile = async (data: UpdateProfileData) => {
    const response = await saveProfile(data);
    if (response.success) {
      setResetKey((prev) => prev + 1);
    }
    return response;
  };

  if (loading) return <LoadingOverlay />;

  if (error || !profile) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-danger">
        <h3 className="text-xl font-bold mb-2">Something went wrong</h3>
        <p className="text-muted-foreground">
          {error || "Failed to load profile data."}
        </p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-6 py-2 bg-primary text-white rounded-xl"
        >
          Try Again
        </button>
      </div>
    );
  }

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) uploadAvatar(file);
  };

  return (
    <DashboardLayout
      role={profile.role as RoleType}
      userName={profile.fullName}
    >
      <div className="min-h-screen pb-20">
        <div className="max-w-7xl mx-auto px-6 mb-12">
          <div className="flex justify-center flex-wrap gap-4 p-3 bg-gray-50 dark:bg-white/5 rounded-[2.5rem] border border-gray-100 dark:border-white/5 w-fit mx-auto shadow-sm">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-3 px-8 py-3.5 rounded-2xl text-sm font-black transition-all duration-500 ${
                  activeTab === tab.id
                    ? "bg-white dark:bg-primary text-primary dark:text-white shadow-xl shadow-primary/10 scale-105"
                    : "text-gray-400 hover:text-primary"
                }`}
              >
                <tab.icon size={18} />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6">
          {activeTab === "profile" ? (
            <div className="flex flex-col xl:flex-row items-center xl:items-stretch justify-center gap-8 xl:gap-0 relative">
              <div className="w-full xl:w-[45%] bg-white dark:bg-card rounded-[3rem] p-8 shadow-xl xl:pr-24 relative z-0 border border-gray-100 dark:border-white/5">
                <ProfileCard profile={profile} />
              </div>

              <div className="relative z-10 flex-shrink-0 xl:-mx-20 my-8 xl:my-0 flex items-center justify-center">
                <div className="relative group p-4 bg-[color:var(--color-surface)] rounded-full border border-gray-100 dark:border-white/5">
                  <div className="w-48 h-48 md:w-64 md:h-64 rounded-full bg-gray-100 dark:bg-white/5 overflow-hidden flex items-center justify-center relative shadow-2xl">
                    {profile.avatarUrl ? (
                      <img
                        src={profile.avatarUrl}
                        alt={profile.fullName}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                    ) : (
                      <span className="text-6xl font-black text-primary opacity-30">
                        {profile.fullName[0]}
                      </span>
                    )}
                  </div>

                  <label
                    htmlFor="avatar-header-upload"
                    className={`absolute bottom-6 right-6 p-4 bg-primary text-white rounded-2xl shadow-2xl cursor-pointer hover:scale-110 active:scale-95 transition-all border-4 border-[color:var(--color-surface)] ${updating ? "animate-pulse" : ""}`}
                  >
                    <Camera size={24} />
                  </label>
                  <input
                    id="avatar-header-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleAvatarChange}
                    disabled={updating}
                  />
                </div>
              </div>

              <div className="w-full xl:w-[55%] bg-white dark:bg-card rounded-[3rem] p-8 shadow-xl xl:pl-24 relative z-0 border border-gray-100 dark:border-white/5">
                <PersonalInfoForm
                  key={`${profile.email}-${resetKey}`}
                  profile={profile}
                  saveProfile={handleSaveProfile}
                  isSaving={updating}
                />
              </div>
            </div>
          ) : activeTab === "security" ? (
            <div className="bg-white dark:bg-card rounded-[3rem] p-12 shadow-xl border border-gray-100 dark:border-white/5 max-w-4xl mx-auto">
              <ChangePasswordForm />
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-40 border-4 border-dashed border-gray-100 dark:border-white/5 rounded-[4rem] gap-8 bg-gray-50/30">
              <div className="p-10 bg-white dark:bg-card rounded-full shadow-2xl animate-bounce text-5xl">
                ✨
              </div>
              <div className="text-center space-y-2">
                <h3 className="text-3xl font-black text-gray-800 dark:text-white tracking-tight">
                  {tabs.find((t) => t.id === activeTab)?.label} Experience
                </h3>
                <p className="text-gray-400 font-medium max-w-sm">
                  We are polishing this premium module to bring you the best
                  experience soon.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ProfilePage;
