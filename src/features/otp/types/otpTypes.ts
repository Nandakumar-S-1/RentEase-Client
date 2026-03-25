export interface VerifyOtpResponse {
  success: boolean;
  message: string;
  data: {
    user: {
      id: string;
      email: string;
      fullname: string;
      phone: string;
      role: "TENANT" | "OWNER";
    };
    accessToken: string;
    refreshToken?: string;
  };
}

export interface ResendOtpResponse {
  success: boolean;
  message: string;
}
