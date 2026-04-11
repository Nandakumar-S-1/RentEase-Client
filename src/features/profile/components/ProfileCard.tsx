import React from "react";
import { Mail, Phone, CheckCircle, Clock, Camera } from "lucide-react";
import type { ProfileData } from "../types/profileTypes";
import { format } from "date-fns";

interface ProfileCardProps {
  profile: ProfileData;
  onAvatarUpload: (file: File) => Promise<any>;
  uploading: boolean;
}

const ProfileCard: React.FC<ProfileCardProps> = ({ profile, onAvatarUpload, uploading }) => {
  const initials = profile.fullName
    .split(" ")
    .map((n) => n[0])
    .join("");

  const isOwner = profile.role === "OWNER";
  const joinedDate = profile.createdAt
    ? format(new Date(profile.createdAt), "MMMM yyyy")
    : "Recent";

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onAvatarUpload(file);
    }
  };

  return (
    <div className="bg-white dark:bg-card border border-border rounded-2xl p-6 shadow-sm">
      <div className="flex flex-col items-center text-center pb-6 border-b border-border">
        <div className="relative group mb-4">
          <div className="w-24 h-24 rounded-full bg-primary flex items-center justify-center text-white text-3xl font-bold shadow-lg overflow-hidden border-4 border-white dark:border-card">
            {profile.avatarUrl ? (
              <img src={profile.avatarUrl} alt={profile.fullName} className="w-full h-full object-cover" />
            ) : (
              initials
            )}
          </div>
          <label
            htmlFor="avatar-upload"
            className={`absolute bottom-0 right-0 p-2 bg-primary text-white rounded-full border-4 border-white dark:border-card hover:scale-110 transition-transform shadow-md cursor-pointer ${uploading ? "animate-pulse" : ""}`}
          >
            <Camera size={14} />
          </label>
          <input
            id="avatar-upload"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
            disabled={uploading}
          />
        </div>

        <h2 className="text-xl font-bold text-foreground mb-1">
          {profile.fullName}
        </h2>
        <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-3">
          {profile.role.toLowerCase()}
        </p>

        {profile.role !== "ADMIN" && (
          <div className="flex flex-col items-center gap-2 mb-4">
            {profile.occupation && (
              <p className="text-xs font-semibold px-3 py-1 bg-primary/5 text-primary rounded-lg border border-primary/10">
                {profile.occupation}
              </p>
            )}
            {profile.bio && (
              <p className="text-xs text-muted-foreground max-w-[250px] italic">
                &ldquo;{profile.bio}&rdquo;
              </p>
            )}
          </div>
        )}

        {isOwner && profile.verificationStatus === "VERIFIED" && (
          <div className="flex items-center gap-1.5 px-3 py-1 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 rounded-full text-xs font-semibold">
            <CheckCircle size={14} />
            Verified Owner
          </div>
        )}
        {!isOwner && profile.role !== "ADMIN" && (
          <div className="flex items-center gap-1.5 px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-semibold">
            <CheckCircle size={14} />
            Verified Tenant
          </div>
        )}
      </div>

      <div className="py-6 space-y-4 border-b border-border">
        <div className="flex items-center gap-3 text-sm text-foreground">
          <div className="p-2 bg-gray-50 dark:bg-white/5 rounded-lg text-muted-foreground">
            <Mail size={16} />
          </div>
          <span className="truncate text-xs">{profile.email}</span>
        </div>
        <div className="flex items-center gap-3 text-sm text-foreground">
          <div className="p-2 bg-gray-50 dark:bg-white/5 rounded-lg text-muted-foreground">
            <Phone size={16} />
          </div>
          <span className="text-xs">{profile.phone || "Not set"}</span>
        </div>
        
        <div className="flex items-center gap-3 text-sm text-foreground">
          <div className="p-2 bg-gray-50 dark:bg-white/5 rounded-lg text-muted-foreground">
            <Clock size={16} />
          </div>
          <span className="text-xs">Member since {joinedDate}</span>
        </div>
      </div>

      {profile.role !== "ADMIN" && (
        <div className="pt-6 grid grid-cols-2 gap-4">
          <div className="p-4 bg-gray-50 dark:bg-white/5 rounded-2xl text-center">
            <p className="text-2xl font-bold text-primary mb-1">
              {isOwner ? "0" : "0"}
            </p>
            <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest leading-none">
              {isOwner ? "Properties" : "Current Rental"}
            </p>
          </div>
          <div className="p-4 bg-gray-50 dark:bg-white/5 rounded-2xl text-center">
            <p className="text-2xl font-bold text-primary mb-1">
              {isOwner ? "0.0" : "0"}
            </p>
            <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest leading-none">
              {isOwner ? "Rating" : "Wishlist Items"}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileCard;
