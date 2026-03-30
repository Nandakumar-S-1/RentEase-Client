import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../../hooks/useAppDispatch";
import { setCredentials } from "../../auth/slices/AuthSlice";
import { verifyOtp } from "../services/otpService";
import { PAGE_ROUTES } from "../../../config/routes";
import type { ApiError } from "../../../types/common";
import { UIMessages } from "../../../types/Constants/messages.constant";
import { RoleTypes } from "../../../types/Constants/role.constant";

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
        }),
      );

      setSuccessMessage(UIMessages.SUCCESS.OTP_VERIFIED);
      const destination =
        response.data.user.role === RoleTypes.OWNER_USER
          ? PAGE_ROUTES.OWNER_VERIFICATION
          : PAGE_ROUTES.DASHBOARD;
      setTimeout(() => navigate(destination), 1000);
    } catch (err) {
      const apiError = err as ApiError;
      setError(
        apiError?.response?.data?.message || UIMessages.ERROR.OTP_FAILED,
      );
    } finally {
      setIsLoading(false);
    }
  };

  return { verify, isLoading, error, successMessage };
};
