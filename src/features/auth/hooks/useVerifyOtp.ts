import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../useAppDispatch";
import { setCredentials } from "../../app/store/slices/AuthSlice"; 
import { verifyOtp } from "../../services/otp/otpService";
import { PAGE_ROUTES } from "../../config/routes";
import type { ApiError } from "../../Types/auth"; 

export const useVerifyOtp = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const verify = async (email: string, otp: string) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await verifyOtp(email, otp);

      dispatch(
        setCredentials({
          user: response.data.user,
          accessToken: response.data.accessToken,
          refreshToken: response.data.refreshToken,
        })
      );

      setSuccessMessage("OTP verified successfully!");
      setTimeout(() => navigate(PAGE_ROUTES.DASHBOARD), 1000);
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError?.response?.data?.message || "OTP verification failed.");
    } finally {
      setIsLoading(false);
    }
  };

  return { verify, isLoading, error, successMessage };
};
