export const UIMessages = {
  SUCCESS: {
    OTP_VERIFIED: "OTP verified successfully!",
    LOGIN: "Login successful!",
    REGISTER: "Registration successful!",
    DOCUMENT_SUBMITTED: "Document submitted successfully!",
  },
  ERROR: {
    OTP_FAILED: "OTP verification failed.",
    LOGIN_FAILED: "Login failed. Please try again.",
    REGISTER_FAILED: "Registration failed. Please try again.",
    GOOGLE_AUTH_FAILED: "Google login failed. Please try again.",
    DOCUMENT_SUBMISSION_FAILED: "Failed to submit document. Please try again.",
    GENERIC: "An error occurred. Please try again.",
  }
} as const;
