import type { RoleType } from "../../../types/constants/role.constant";
import type { VerificationStatus } from "../../verification/types/verificationType";

export interface ProfileData {
  fullName: string;
  email: string;
  phone: string | null;
  role: RoleType;
  createdAt: string;
  bio?: string | null;
  occupation?: string | null;
  avatarUrl?: string | null;
  // owner-specific
  verificationStatus?: VerificationStatus;
  documentType?: string | null;
  documentUrl?: string | null;
  verifiedAt?: string | null;
  listingsCount?: number;
}

export interface UpdateProfileData {
  fullName?: string;
  phone?: string;
  bio?: string;
  occupation?: string;
}

export interface ProfileResponse {
  success: boolean;
  message: string;
  data: ProfileData;
}

export interface UpdateProfileResponse {
  success: boolean;
  message: string;
  data: {
    fullName: string;
    email: string;
    phone: string | null;
    role: RoleType;
  };
}
