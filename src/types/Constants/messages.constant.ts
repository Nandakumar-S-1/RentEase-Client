export const ProfileMessages = {
  UPDATE_FAILED: "Failed to update profile",
  LOAD_FAILED: "Failed to load profile",
} as const;

export const UIMessages = {
  SUCCESS: {
    OTP_VERIFIED: "OTP verified successfully.",
  },
  ERROR: {
    OTP_FAILED: "OTP verification failed. Please try again.",
  },
} as const;
