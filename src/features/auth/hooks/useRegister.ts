import { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { RegisterData } from "../types/authTypes";
import { registerUser } from "../services/authService";
import { buildRoutes } from "../../../config/routes";
import { getApiErrorMessage } from "../../../types/common";

export const useRegister = () => {
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const register = async (data: RegisterData) => {
    try {
      setIsLoading(true);
      setError(null);
      setSuccessMessage(null);
      await registerUser(data);

      setSuccessMessage("Registration Successful");
      setTimeout(() => navigate(buildRoutes.verifyOtp(data.email)), 1500);
    } catch (err) {
      setError(getApiErrorMessage(err, "Registration failed"));
    } finally {
      setIsLoading(false);
    }
  };
  return { register, isLoading, error, successMessage };
};
