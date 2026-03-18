import { useState } from "react";
import {
  suspendUser,
  activateUser,
  deactivateUser,
} from "../services/adminService";
import type { ApiError } from "../../../types/common";

export const useUserActions = (onSuccess?: () => void) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const performAction = async (
    action: "suspend" | "activate" | "deactivate",
    userId: string
  ) => {
    try {
      setIsLoading(true);
      setError(null);

      switch (action) {
        case "suspend":
          await suspendUser(userId);
          break;
        case "activate":
          await activateUser(userId);
          break;
        case "deactivate":
          await deactivateUser(userId);
          break;
      }

      onSuccess?.();
    } catch (error) {
  const apiError = error as ApiError;
  setError(apiError?.response?.data?.message || 'fallback message');
}finally {
      setIsLoading(false);
    }
  };

  return { performAction, isLoading, error };
};
