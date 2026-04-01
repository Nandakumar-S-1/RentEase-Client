import React from "react";
import { Mail, Phone, MapPin, Calendar, CheckCircle, Clock } from "lucide-react";
import type { ProfileData } from "../types/profileTypes";
import { format } from "date-fns";

interface ProfileCardProps {
  profile: ProfileData;
}

const ProfileCard: React.FC<ProfileCardProps> = ({ profile }) => {
  const initials = profile.fullName
    .split(" ")
    .map((n) => n[0])
    .join("");

  const isOwner = profile.role === "OWNER";
  const joinedDate = profile.createdAt
    ? format(new Date(profile.createdAt), "MMMM yyyy")
    : "Recent";

  return (
    <div className="bg-white dark:bg-card border border-border rounded-2xl p-6 shadow-sm">
      <div className="flex flex-col items-center text-center pb-6 border-b border-border">
        <div className="relative group mb-4">
          <div className="w-24 h-24 rounded-full bg-primary flex items-center justify-center text-white text-3xl font-bold shadow-lg">
            {initials}
          </div>
          <button className="absolute bottom-0 right-0 p-2 bg-primary text-white rounded-full border-4 border-white dark:border-card hover:scale-110 transition-transform shadow-md">
            <Calendar size={14} className="rotate-0" />
          </button>
        </div>

        <h2 className="text-xl font-bold text-foreground mb-1">
          {profile.fullName}
        </h2>
        <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-3">
          {profile.role.toLowerCase()}
        </p>

        {isOwner && profile.verificationStatus === "VERIFIED" && (
          <div className="flex items-center gap-1.5 px-3 py-1 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 rounded-full text-xs font-semibold">
            <CheckCircle size={14} />
            Verified Owner
          </div>
        )}
        {!isOwner && (
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
          <span className="truncate">{profile.email}</span>
        </div>
        <div className="flex items-center gap-3 text-sm text-foreground">
          <div className="p-2 bg-gray-50 dark:bg-white/5 rounded-lg text-muted-foreground">
            <Phone size={16} />
          </div>
          <span>{profile.phone || "Not set"}</span>
        </div>
        <div className="flex items-center gap-3 text-sm text-foreground">
          <div className="p-2 bg-gray-50 dark:bg-white/5 rounded-lg text-muted-foreground">
            <MapPin size={16} />
          </div>
          <span>Kakkanad, Ernakulam</span> {/* Placeholder as discussed */}
        </div>
        <div className="flex items-center gap-3 text-sm text-foreground">
          <div className="p-2 bg-gray-50 dark:bg-white/5 rounded-lg text-muted-foreground">
            <Clock size={16} />
          </div>
          <span>Member since {joinedDate}</span>
        </div>
      </div>

      <div className="pt-6 grid grid-cols-2 gap-4">
        <div className="p-4 bg-gray-50 dark:bg-white/5 rounded-2xl text-center">
          <p className="text-2xl font-bold text-primary mb-1">
            {isOwner ? "12" : "1"}
          </p>
          <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest leading-none">
            {isOwner ? "Properties" : "Current Rental"}
          </p>
        </div>
        <div className="p-4 bg-gray-50 dark:bg-white/5 rounded-2xl text-center">
          <p className="text-2xl font-bold text-primary mb-1">
            {isOwner ? "4.8" : "4"}
          </p>
          <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest leading-none">
            {isOwner ? "Rating" : "Wishlist Items"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
