import type { RoleType } from "../../../types/constants/role.constant";

export interface VerifyOtpResponse {
  success: boolean;
  message: string;
  data: {
    user: {
      id: string;
      email: string;
      fullname: string;
      phone: string;
      role: RoleType;
    };
    accessToken: string;
    refreshToken?: string;
  };
}

export interface ResendOtpResponse {
  success: boolean;
  message: string;
}
