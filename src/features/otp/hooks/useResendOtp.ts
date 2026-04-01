import { useState } from "react";
import { resendOtp } from "../services/otpService";
import type { ApiError } from "../../../types/common";

export const useResendOtp = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const resend = async (email: string) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await resendOtp(email);
      setSuccessMessage(response.message);
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError?.response?.data?.message || "Failed to resend OTP.");
    } finally {
      setIsLoading(false);
    }
  };

  return { resend, isLoading, error, successMessage };
};
