import React, { useState } from "react";
import DashboardLayout from "../../../components/common/DashboardLayout";
import { useProfile } from "../hooks/useProfile";
import ProfileCard from "./ProfileCard";
import PersonalInfoForm from "./PersonalInfoForm";
import type { RoleType } from "../../../types/constants/role.constant";

const ProfilePage: React.FC = () => {
  const { profile, loading, error } = useProfile();
  const [activeTab, setActiveTab] = useState("profile");

  const tabs = [
    { id: "profile", label: "Profile" },
    { id: "rental", label: "Rental Preferences" },
    { id: "notifications", label: "Notifications" },
    { id: "security", label: "Security" },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full text-primary font-bold animate-pulse">
        Fetching your RentEase profile...
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-danger border border-red-100 rounded-2xl bg-red-50/10 p-12">
        <h3 className="text-xl font-bold mb-2">Something went wrong</h3>
        <p className="text-muted-foreground">{error || "Failed to load profile data."}</p>
        <button onClick={() => window.location.reload()} className="mt-4 px-6 py-2 bg-primary text-white rounded-xl shadow-lg">
          Try Again
        </button>
      </div>
    );
  }

  return (
    <DashboardLayout role={profile.role as RoleType} userName={profile.fullName}>
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold text-foreground">Profile Settings</h1>
          <p className="text-muted-foreground">Manage your account and rental preferences</p>
        </div>

        <div className="flex gap-4 p-1 bg-gray-100/50 dark:bg-white/5 rounded-2xl w-fit">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-2 rounded-xl text-sm font-semibold transition-all ${activeTab === tab.id
                  ? "bg-white dark:bg-primary text-primary dark:text-white shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
                }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === "profile" ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-4 sticky top-4">
              <ProfileCard profile={profile} />
            </div>
            <div className="lg:col-span-8">
              <PersonalInfoForm profile={profile} />
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-64 text-muted-foreground bg-gray-50 dark:bg-white/5 rounded-3xl border-2 border-dashed border-border gap-3">
            <div className="p-4 bg-white dark:bg-card rounded-2xl shadow-sm border border-border">
              🚧
            </div>
            <p className="font-semibold text-lg">{tabs.find(t => t.id === activeTab)?.label} Module</p>
            <p className="text-sm">This section is coming soon. Stay tuned!</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default ProfilePage;
