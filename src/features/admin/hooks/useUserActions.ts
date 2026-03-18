import { useState } from "react";
import {
  suspendUser,
  activateUser,
  deactivateUser,
} from "../services/adminService";

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
    } catch (err: any) {
      setError(err?.response?.data?.message || `Failed to ${action} user.`);
    } finally {
      setIsLoading(false);
    }
  };

  return { performAction, isLoading, error };
};
