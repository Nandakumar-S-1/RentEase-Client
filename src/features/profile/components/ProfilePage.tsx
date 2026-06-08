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
  BellRing,
  UserCog,
  SlidersHorizontal,
} from "lucide-react";
import type { UpdateProfileData } from "../types/profileTypes";
import { NotificationDropdown } from "../../notifications/components/NotificationDropdown";

const ProfilePage: React.FC = () => {
  const { profile, loading, updating, saveProfile, error, uploadAvatar } =
    useProfile();
  const [activeTab, setActiveTab] = useState("identity");
  const [resetKey, setResetKey] = useState(0);

  const tabs = [
    { id: "identity", label: "Identity", icon: UserCog },
    { id: "configure", label: "Configure", icon: SlidersHorizontal },
    { id: "alerts", label: "Alerts", icon: BellRing },
    ...(profile?.authProvider !== "GOOGLE"
      ? [{ id: "security", label: "Security", icon: ShieldCheck }]
      : []),
  ];

  const handleSaveProfile = async (data: UpdateProfileData) => {
    const response = await saveProfile(data);
    if (response.success) {
      setResetKey((prev) => prev + 1);
    }
    return response;
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) uploadAvatar(file);
  };

  if (loading) return <LoadingOverlay />;

  if (error || !profile) {
    return (
      <div className="flex flex-col items-center justify-center h-screen gap-4">
        <p className="text-lg font-semibold text-[color:var(--color-foreground)]">
          {error || "Failed to load profile."}
        </p>
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-2.5 bg-primary text-white rounded-xl text-sm font-semibold"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <DashboardLayout role={profile.role as RoleType} userName={profile.fullName}>
      <div className="max-w-5xl mx-auto space-y-8 pb-16">

        {/* ── Hero header ─────────────────────────────────────────── */}
        <div className="relative rounded-xl overflow-hidden bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border border-[color:var(--color-border)] p-8">
          {/* subtle background grid */}
          <div className="absolute inset-0 opacity-[0.03] [background-image:linear-gradient(var(--color-foreground)_1px,transparent_1px),linear-gradient(90deg,var(--color-foreground)_1px,transparent_1px)] [background-size:32px_32px]" />

          <div className="relative flex flex-col sm:flex-row items-center sm:items-end gap-6">
            {/* Avatar */}
            <div className="relative group flex-shrink-0">
              <div className="w-28 h-28 rounded-lg bg-[color:var(--color-secondary)] overflow-hidden ring-4 ring-[color:var(--color-surface)] shadow-xl">
                {profile.avatarUrl ? (
                  <img
                    src={profile.avatarUrl}
                    alt={profile.fullName}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                ) : (
                  <span className="flex items-center justify-center w-full h-full text-4xl font-black text-primary/40 select-none">
                    {profile.fullName[0]}
                  </span>
                )}
              </div>
              <label
                htmlFor="avatar-upload"
                className={`absolute -bottom-2 -right-2 p-2 bg-primary text-white rounded-xl shadow-lg cursor-pointer hover:scale-110 active:scale-95 transition-all border-2 border-[color:var(--color-surface)] ${updating ? "animate-pulse" : ""}`}
                title="Change photo"
              >
                <Camera size={14} />
              </label>
              <input
                id="avatar-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleAvatarChange}
                disabled={updating}
              />
            </div>

            {/* Name / role */}
            <div className="text-center sm:text-left flex-1">
              <h1 className="text-2xl font-black text-[color:var(--color-foreground)] tracking-tight">
                {profile.fullName}
              </h1>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[color:var(--color-muted-foreground)] mt-0.5">
                {profile.role} Account
              </p>
              {profile.email && (
                <p className="text-sm text-[color:var(--color-muted-foreground)] mt-1">
                  {profile.email}
                </p>
              )}
            </div>

            {/* Quick stat pills */}
            <div className="flex gap-3 flex-shrink-0">
              <div className="px-4 py-2 bg-[color:var(--color-surface)] rounded-xl border border-[color:var(--color-border)] text-center shadow-sm">
                <p className="text-lg font-black text-[color:var(--color-foreground)]">
                  {profile.listingsCount ?? 0}
                </p>
                <p className="text-[10px] font-bold uppercase tracking-wider text-[color:var(--color-muted-foreground)]">
                  Listings
                </p>
              </div>
              <div className="px-4 py-2 bg-[color:var(--color-surface)] rounded-xl border border-[color:var(--color-border)] text-center shadow-sm">
                <p className="text-lg font-black text-[color:var(--color-foreground)]">4.9</p>
                <p className="text-[10px] font-bold uppercase tracking-wider text-[color:var(--color-muted-foreground)]">
                  Rating
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ── Tab bar ─────────────────────────────────────────────── */}
        <div className="flex gap-1 p-1 bg-[color:var(--color-secondary)] rounded-lg w-fit">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                activeTab === tab.id
                  ? "bg-[color:var(--color-surface)] text-[color:var(--color-foreground)] shadow-sm"
                  : "text-[color:var(--color-muted-foreground)] hover:text-[color:var(--color-foreground)]"
              }`}
            >
              <tab.icon size={15} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* ── Tab content ─────────────────────────────────────────── */}
        <div className="animate-in fade-in duration-200">

          {/* Identity */}
          {activeTab === "identity" && (
            <div className="bg-[color:var(--color-surface)] border border-[color:var(--color-border)] rounded-xl p-8 shadow-sm">
              <ProfileCard profile={profile} />
            </div>
          )}

          {/* Configure */}
          {activeTab === "configure" && (
            <div className="bg-[color:var(--color-surface)] border border-[color:var(--color-border)] rounded-xl p-8 shadow-sm">
              <PersonalInfoForm
                key={`${profile.email}-${resetKey}`}
                profile={profile}
                saveProfile={handleSaveProfile}
                isSaving={updating}
              />
            </div>
          )}

          {/* Alerts — notification list */}
          {activeTab === "alerts" && (
            <div className="bg-[color:var(--color-surface)] border border-[color:var(--color-border)] rounded-xl overflow-hidden shadow-sm">
              {/* reuse the dropdown's list but in full-page inline mode */}
              <NotificationDropdown isOpen={true} onClose={() => {}} inline />
            </div>
          )}

          {/* Security */}
          {activeTab === "security" && (
            <div className="bg-[color:var(--color-surface)] border border-[color:var(--color-border)] rounded-xl p-8 shadow-sm">
              <ChangePasswordForm />
            </div>
          )}

          {/* Preferences / Alerts — coming soon */}
          {(activeTab === "preferences") && (
            <ComingSoon label={tabs.find((t) => t.id === activeTab)?.label ?? ""} />
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

/* ── Coming soon placeholder ──────────────────────────────────────── */
const ComingSoon: React.FC<{ label: string }> = ({ label }) => (
  <div className="flex flex-col items-center justify-center py-28 gap-5 bg-[color:var(--color-surface)] border border-[color:var(--color-border)] rounded-xl">
    <div className="w-16 h-16 rounded-lg bg-[color:var(--color-secondary)] flex items-center justify-center text-3xl shadow-inner">
      ✨
    </div>
    <div className="text-center space-y-1.5">
      <h3 className="text-lg font-bold text-[color:var(--color-foreground)]">
        {label} coming soon
      </h3>
      <p className="text-sm text-[color:var(--color-muted-foreground)] max-w-xs">
        We're polishing this section to give you the best experience.
      </p>
    </div>
  </div>
);

export default ProfilePage;
