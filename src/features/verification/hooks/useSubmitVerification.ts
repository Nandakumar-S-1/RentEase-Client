import { useState } from "react";
import { submitVerification, getVerificationStatus } from "../services/verificationService";
import type { VerificationStatus } from "../types/verificationType";
import type { ApiError } from "../../../types/common";

export const useSubmitVerification = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [status, setStatus] = useState<VerificationStatus | null>(null);

    const fetchStatus = async () => {
        try {
            setIsLoading(true);
            setError(null);
            const response = await getVerificationStatus();
            setStatus(response.data.verificationStatus);
        } catch (err) {
            const apiError = err as ApiError;
            setError(apiError?.response?.data?.message || "Failed to fetch verification status");
        } finally {
            setIsLoading(false);
        }
    };

    const submit = async (documentType: string, document: File) => {
        try {
            setIsLoading(true);
            setError(null);
            setSuccessMessage(null);

            await submitVerification({ documentType, document });
            setSuccessMessage("Document submitted successfully! It is now under review.");
            setStatus("SUBMITTED");
        } catch (err) {
            const apiError = err as ApiError;
            setError(apiError?.response?.data?.message || "Failed to submit verification document");
        } finally {
            setIsLoading(false);
        }
    };

    return { submit, fetchStatus, isLoading, error, successMessage, status };
};
