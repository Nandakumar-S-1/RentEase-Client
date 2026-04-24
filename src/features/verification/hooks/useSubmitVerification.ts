import { useState, useCallback } from "react";
import {
  submitVerification,
  getVerificationStatus,
} from "../services/verificationService";
import type { VerificationStatus } from "../types/verificationType";
import type { ApiError } from "../../../types/common";
import { useAppDispatch } from "../../../hooks/useAppDispatch";
import { updateVerificationStatus } from "../../auth/slices/AuthSlice";

export const useSubmitVerification = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [status, setStatus] = useState<VerificationStatus | null>(null);
  const [rejectionReason, setRejectionReason] = useState<string | null>(null);
  const dispatch = useAppDispatch();

  const fetchStatus = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await getVerificationStatus();
      const newStatus = response.data.verificationStatus;
      setStatus(newStatus);
      setRejectionReason(response.data.rejectionReason ?? null);
      dispatch(updateVerificationStatus(newStatus));
    } catch (err) {
      const apiError = err as ApiError;
      setError(
        apiError?.response?.data?.message ||
          "Failed to fetch verification status",
      );
    } finally {
      setIsLoading(false);
    }
  }, [dispatch]);

  const submit = useCallback(async (documentType: string, document: File) => {
    try {
      setIsLoading(true);
      setError(null);
      setSuccessMessage(null);

      await submitVerification({ documentType, document });
      setSuccessMessage(
        "Document submitted successfully! It is now under review.",
      );
      setRejectionReason(null);
      setStatus("SUBMITTED");
      dispatch(updateVerificationStatus("SUBMITTED"));
    } catch (err) {
      const apiError = err as ApiError;
      setError(
        apiError?.response?.data?.message ||
          "Failed to submit verification document",
      );
    } finally {
      setIsLoading(false);
    }
  }, [dispatch]);

  return {
    submit,
    fetchStatus,
    isLoading,
    error,
    successMessage,
    status,
    rejectionReason,
  };
};
