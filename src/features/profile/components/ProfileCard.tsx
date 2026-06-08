import React from "react";
import {
  Mail,
  Phone,
  CheckCircle2,
  Clock,
  Briefcase,
  Quote,
} from "lucide-react";
import type { ProfileData } from "../types/profileTypes";
import { format } from "date-fns";
import { RoleTypes } from "../../../types/constants/role.constant";

interface ProfileCardProps {
  profile: ProfileData;
}

const ProfileCard: React.FC<ProfileCardProps> = ({ profile }) => {
  const isOwner = profile.role === RoleTypes.OWNER_USER;
  const joinedDate = profile.createdAt
    ? format(new Date(profile.createdAt), "MMMM yyyy")
    : "Recent";

  return (
    <div className="space-y-8">

      {/* ── Bio & Occupation ──────────────────────────────── */}
      <section className="space-y-4">
        <SectionLabel icon={<Briefcase size={14} />} text="Professional Identity" />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Occupation */}
          <div className="p-5 bg-[color:var(--color-secondary)] rounded-lg border border-[color:var(--color-border)]">
            <p className="text-[10px] font-bold uppercase tracking-widest text-[color:var(--color-muted-foreground)] mb-1">
              Occupation
            </p>
            <p className="font-semibold text-[color:var(--color-foreground)]">
              {profile.occupation?.trim() || "Community Member"}
            </p>
          </div>

          {/* Member since */}
          <div className="p-5 bg-[color:var(--color-secondary)] rounded-lg border border-[color:var(--color-border)] flex items-center gap-3">
            <Clock size={16} className="text-[color:var(--color-muted-foreground)] flex-shrink-0" />
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-[color:var(--color-muted-foreground)] mb-0.5">
                Member Since
              </p>
              <p className="font-semibold text-[color:var(--color-foreground)]">{joinedDate}</p>
            </div>
          </div>
        </div>

        {/* Bio */}
        {profile.bio?.trim() ? (
          <div className="relative p-5 bg-primary/5 border border-primary/15 rounded-lg overflow-hidden">
            <Quote
              size={48}
              className="absolute -right-2 -bottom-2 text-primary/10 pointer-events-none"
            />
            <p className="text-[10px] font-bold uppercase tracking-widest text-primary/60 mb-2">
              About
            </p>
            <p className="text-sm text-[color:var(--color-foreground)] leading-relaxed italic relative z-10">
              "{profile.bio}"
            </p>
          </div>
        ) : (
          <div className="p-5 border border-dashed border-[color:var(--color-border)] rounded-lg text-center">
            <p className="text-sm text-[color:var(--color-muted-foreground)]">
              No bio yet —{" "}
              <span className="text-primary font-medium">add one in Configure</span>
            </p>
          </div>
        )}
      </section>

      {/* ── Contact & Verifications ───────────────────────── */}
      <section className="space-y-4">
        <SectionLabel icon={<Mail size={14} />} text="Contact & Verifications" />

        <div className="divide-y divide-[color:var(--color-border)] border border-[color:var(--color-border)] rounded-lg overflow-hidden">
          <ContactRow
            icon={<Mail size={16} />}
            label="Email Address"
            value={profile.email}
          />
          <ContactRow
            icon={<Phone size={16} />}
            label="Phone Number"
            value={profile.phone || "Not provided"}
            muted={!profile.phone}
          />
          {isOwner && profile.verificationStatus === "VERIFIED" && (
            <div className="flex items-center gap-3 px-5 py-4 bg-emerald-50 dark:bg-emerald-500/10">
              <CheckCircle2 size={16} className="text-emerald-500 flex-shrink-0" />
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
                  Verified Owner
                </p>
                <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-300">
                  Identity confirmed
                </p>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

/* ── Small helpers ─────────────────────────────────────────────────── */
const SectionLabel: React.FC<{ icon: React.ReactNode; text: string }> = ({
  icon,
  text,
}) => (
  <div className="flex items-center gap-2 text-[color:var(--color-muted-foreground)]">
    {icon}
    <span className="text-xs font-bold uppercase tracking-widest">{text}</span>
  </div>
);

const ContactRow: React.FC<{
  icon: React.ReactNode;
  label: string;
  value: string;
  muted?: boolean;
}> = ({ icon, label, value, muted }) => (
  <div className="flex items-center gap-3 px-5 py-4 bg-[color:var(--color-surface)]">
    <span className="text-[color:var(--color-muted-foreground)] flex-shrink-0">{icon}</span>
    <div>
      <p className="text-[10px] font-bold uppercase tracking-widest text-[color:var(--color-muted-foreground)]">
        {label}
      </p>
      <p
        className={`text-sm font-semibold ${
          muted
            ? "text-[color:var(--color-muted-foreground)] italic"
            : "text-[color:var(--color-foreground)]"
        }`}
      >
        {value}
      </p>
    </div>
  </div>
);

export default ProfileCard;
