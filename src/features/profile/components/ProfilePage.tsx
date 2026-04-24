import React, { useState } from "react";
import DashboardLayout from "../../../components/common/DashboardLayout";
import { useProfile } from "../hooks/useProfile";
import ProfileCard from "./ProfileCard";
import PersonalInfoForm from "./PersonalInfoForm";
import type { RoleType } from "../../../types/constants/role.constant";
import { LoadingOverlay } from "../../../components/common";
import { Camera, ShieldCheck, Settings2, BellRing, UserCog } from "lucide-react";

const ProfilePage: React.FC = () => {
  const { profile, loading, updating, error, uploadAvatar } = useProfile();
  const [activeTab, setActiveTab] = useState("profile");

  const tabs = [
    { id: "profile", label: "Identity", icon: UserCog },
    { id: "preferences", label: "Preferences", icon: Settings2 },
    { id: "notifications", label: "Alerts", icon: BellRing },
    { id: "security", label: "Security", icon: ShieldCheck },
  ];

  if (loading) return <LoadingOverlay />;

  if (error || !profile) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-danger">
        <h3 className="text-xl font-bold mb-2">Something went wrong</h3>
        <p className="text-muted-foreground">{error || "Failed to load profile data."}</p>
        <button onClick={() => window.location.reload()} className="mt-4 px-6 py-2 bg-primary text-white rounded-xl">Try Again</button>
      </div>
    );
  }

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) uploadAvatar(file);
  };

  return (
    <DashboardLayout role={profile.role as RoleType} userName={profile.fullName}>
      <div className="min-h-screen pb-20">
        {/* Modern Header Section with Banner & Centered Avatar */}
        <div className="relative mb-32">
          {/* Main Banner */}
          <div className="h-64 md:h-80 w-full rounded-[3rem] bg-gradient-to-br from-primary via-primary-dark to-accent relative overflow-hidden shadow-2xl">
            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent" />
            <div className="absolute top-[-100px] left-[-100px] w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-[-50px] right-[50px] w-64 h-64 bg-accent/20 rounded-full blur-2xl" />
          </div>

          {/* Centered Avatar Overlay */}
          <div className="absolute -bottom-20 left-1/2 -translate-x-1/2 flex flex-col items-center">
            <div className="relative group">
              <div className="w-40 h-40 md:w-48 md:h-48 rounded-[3.5rem] bg-white dark:bg-card p-2 shadow-2xl shadow-primary/20 transition-all duration-500 group-hover:rotate-3">
                <div className="w-full h-full rounded-[3rem] bg-gray-100 dark:bg-white/5 overflow-hidden flex items-center justify-center relative">
                  {profile.avatarUrl ? (
                    <img src={profile.avatarUrl} alt={profile.fullName} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  ) : (
                    <span className="text-5xl font-black text-primary opacity-30">{profile.fullName[0]}</span>
                  )}
                </div>
              </div>
              
              <label htmlFor="avatar-header-upload" className={`absolute bottom-2 right-2 p-4 bg-primary text-white rounded-2xl shadow-2xl cursor-pointer hover:scale-110 active:scale-95 transition-all border-4 border-white dark:border-card ${updating ? "animate-pulse" : ""}`}>
                <Camera size={20} />
              </label>
              <input id="avatar-header-upload" type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} disabled={updating} />
            </div>

            <div className="text-center mt-6 space-y-1">
              <h1 className="text-3xl font-black text-gray-800 dark:text-white tracking-tight">{profile.fullName}</h1>
              <p className="text-gray-400 font-bold uppercase text-[10px] tracking-[0.3em]">{profile.role} Account</p>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
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

        {/* Main Content Grid */}
        <div className="max-w-7xl mx-auto px-6">
          {activeTab === "profile" ? (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
              {/* Left Column: Details Overview */}
              <div className="lg:col-span-4 lg:sticky lg:top-10 h-fit">
                <ProfileCard profile={profile} />
              </div>

              {/* Right Column: Edit Forms */}
              <div className="lg:col-span-8">
                <div className="bg-white dark:bg-card border border-gray-100 dark:border-white/5 rounded-[3rem] p-12 shadow-sm">
                  <PersonalInfoForm profile={profile} />
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-40 border-4 border-dashed border-gray-100 dark:border-white/5 rounded-[4rem] gap-8 bg-gray-50/30">
              <div className="p-10 bg-white dark:bg-card rounded-full shadow-2xl animate-bounce text-5xl">✨</div>
              <div className="text-center space-y-2">
                <h3 className="text-3xl font-black text-gray-800 dark:text-white tracking-tight">{tabs.find(t => t.id === activeTab)?.label} Experience</h3>
                <p className="text-gray-400 font-medium max-w-sm">We are polishing this premium module to bring you the best experience soon.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ProfilePage;
