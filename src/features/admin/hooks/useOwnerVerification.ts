import { useState, useCallback } from "react";
import {
  getPendingOwners,
  verifyOwner,
  rejectOwner,
  type PendingOwner,
} from "../services/adminVerificationService";
import type { ApiError } from "../../../types/common";

export const useOwnerVerification = () => {
  const [owners, setOwners] = useState<PendingOwner[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const fetchPendingOwners = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await getPendingOwners();
      setOwners(response.data);
    } catch (err) {
      const apiError = err as ApiError;
      setError(
        apiError?.response?.data?.message || "Failed to fetch pending owners",
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  const approve = async (ownerId: string) => {
    try {
      setIsLoading(true);
      setError(null);
      setSuccessMessage(null);
      await verifyOwner(ownerId);
      setSuccessMessage("Owner verified successfully");
      await fetchPendingOwners();
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError?.response?.data?.message || "Failed to verify owner");
    } finally {
      setIsLoading(false);
    }
  };

  const reject = async (ownerId: string, reason: string) => {
    try {
      setIsLoading(true);
      setError(null);
      setSuccessMessage(null);
      await rejectOwner(ownerId, reason);
      setSuccessMessage("Owner rejected");
      await fetchPendingOwners();
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError?.response?.data?.message || "Failed to reject owner");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    owners,
    isLoading,
    error,
    successMessage,
    fetchPendingOwners,
    approve,
    reject,
  };
};
