import React from "react";
import { Mail, Phone, CheckCircle, Clock, Star, LayoutGrid, Briefcase, Quote } from "lucide-react";
import type { ProfileData } from "../types/profileTypes";
import { format } from "date-fns";

interface ProfileCardProps {
  profile: ProfileData;
}

const ProfileCard: React.FC<ProfileCardProps> = ({ profile }) => {
  const isOwner = profile.role === "OWNER";
  const joinedDate = profile.createdAt
    ? format(new Date(profile.createdAt), "MMMM yyyy")
    : "Recent";

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-left-4 duration-700">
      {/* Bio & Occupation Section */}
      <div className="bg-white dark:bg-card border border-gray-100 dark:border-white/5 rounded-[2.5rem] p-8 shadow-sm">
        <div className="space-y-6">
          <div className="flex items-center gap-3 text-primary">
            <div className="p-2 bg-primary/10 rounded-xl">
              <Briefcase size={20} />
            </div>
            <h3 className="font-black text-sm uppercase tracking-widest">Professional Identity</h3>
          </div>
          
          <div className="space-y-4">
            <div className="p-6 bg-gray-50 dark:bg-white/5 rounded-3xl border border-gray-100/50">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Current Occupation</p>
              <p className="text-lg font-black text-gray-800 dark:text-white">
                {profile.occupation || "Member of RentEase"}
              </p>
            </div>

            <div className="p-6 bg-primary/5 rounded-3xl border border-primary/10 relative overflow-hidden group">
               <Quote className="absolute -right-2 -bottom-2 text-primary/10 group-hover:scale-110 transition-transform duration-500" size={64} />
               <p className="text-[10px] font-black text-primary/60 uppercase tracking-widest mb-2">About Me</p>
               <p className="text-sm text-gray-600 dark:text-gray-300 font-medium leading-relaxed italic relative z-10">
                {profile.bio ? `"${profile.bio}"` : "This user hasn't shared a bio yet."}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Info Grid */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white dark:bg-card border border-gray-100 dark:border-white/5 rounded-[2rem] p-6 text-center shadow-sm hover:translate-y-[-4px] transition-all">
          <div className="w-10 h-10 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 rounded-xl flex items-center justify-center mx-auto mb-3">
            <LayoutGrid size={20} />
          </div>
          <p className="text-2xl font-black text-gray-900 dark:text-white">{profile.listingsCount || 0}</p>
          <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">{isOwner ? "Listings" : "Rentals"}</p>
        </div>
        <div className="bg-white dark:bg-card border border-gray-100 dark:border-white/5 rounded-[2rem] p-6 text-center shadow-sm hover:translate-y-[-4px] transition-all">
          <div className="w-10 h-10 bg-amber-50 dark:bg-amber-500/10 text-amber-500 rounded-xl flex items-center justify-center mx-auto mb-3">
            <Star size={20} />
          </div>
          <p className="text-2xl font-black text-gray-900 dark:text-white">4.9</p>
          <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Avg Rating</p>
        </div>
      </div>

      {/* Contact Details */}
      <div className="bg-white dark:bg-card border border-gray-100 dark:border-white/5 rounded-[2.5rem] p-8 shadow-sm">
        <h3 className="font-black text-[10px] uppercase tracking-[0.2em] text-gray-400 mb-6 px-1">Verifications & Contact</h3>
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gray-50 dark:bg-white/5 rounded-2xl flex items-center justify-center text-gray-400">
              <Mail size={20} />
            </div>
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase">Email Address</p>
              <p className="font-bold text-sm text-gray-800 dark:text-gray-200">{profile.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gray-50 dark:bg-white/5 rounded-2xl flex items-center justify-center text-gray-400">
              <Phone size={20} />
            </div>
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase">Phone Number</p>
              <p className="font-bold text-sm text-gray-800 dark:text-gray-200">{profile.phone || "Not provided"}</p>
            </div>
          </div>
          {isOwner && profile.verificationStatus === "VERIFIED" && (
            <div className="flex items-center gap-4 pt-2">
              <div className="w-12 h-12 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center">
                <CheckCircle size={20} />
              </div>
              <div>
                <p className="text-[10px] font-black text-green-600 uppercase">Account Status</p>
                <p className="font-bold text-sm text-green-700">Verified Owner</p>
              </div>
            </div>
          )}
        </div>

        <div className="mt-8 pt-8 border-t border-gray-50 dark:border-white/5 flex items-center gap-2 text-gray-400">
          <Clock size={14} />
          <span className="text-[10px] font-black uppercase tracking-widest">Joined {joinedDate}</span>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
