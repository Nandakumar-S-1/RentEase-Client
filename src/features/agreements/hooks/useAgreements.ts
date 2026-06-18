import { useState, useCallback } from "react";
import {
  createAgreement as apiCreateAgreement,
  signOwner as apiSignOwner,
  signTenant as apiSignTenant,
  getAgreementById as apiGetAgreementById,
  getMyAgreements as apiGetMyAgreements,
  uploadKyc as apiUploadKyc,
  getUploadUrls as apiGetUploadUrls,
} from "../services/agreementService";
import type { Agreement } from "../services/agreementService";
import type { ApiError } from "../../../types/common";
import axios from "axios";

export const useAgreements = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [agreements, setAgreements] = useState<Agreement[]>([]);
  const [currentAgreement, setCurrentAgreement] = useState<Agreement | null>(
    null,
  );

  const createAgreement = useCallback(async (data: Partial<Agreement>) => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await apiCreateAgreement(data);
      setCurrentAgreement(res);
      return res;
    } catch (err) {
      const apiError = err as ApiError;
      setError(
        apiError?.response?.data?.message || "Failed to create agreement",
      );
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const signOwner = useCallback(async (id: string, signatureUrl: string) => {
    try {
      setIsLoading(true);
      setError(null);
      await apiSignOwner(id, signatureUrl);
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError?.response?.data?.message || "Failed to sign as owner");
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const signTenant = useCallback(async (id: string, signatureUrl: string) => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await apiSignTenant(id, signatureUrl);
      return res;
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError?.response?.data?.message || "Failed to sign as tenant");
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getAgreementById = useCallback(async (id: string) => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await apiGetAgreementById(id);
      setCurrentAgreement(res);
      return res;
    } catch (err) {
      const apiError = err as ApiError;
      setError(
        apiError?.response?.data?.message || "Failed to fetch agreement",
      );
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getMyAgreements = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await apiGetMyAgreements();
      setAgreements(res);
      return res;
    } catch (err) {
      const apiError = err as ApiError;
      setError(
        apiError?.response?.data?.message || "Failed to fetch your agreements",
      );
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const uploadKycFile = useCallback(async (id: string, file: File) => {
    try {
      setIsLoading(true);
      setError(null);

      // 1. Request S3 presigned URL
      const { uploads } = await apiGetUploadUrls(id, [
        {
          fileName: file.name,
          contentType: file.type,
        },
      ]);

      if (!uploads || uploads.length === 0) {
        throw new Error("Failed to get S3 upload signature");
      }

      const targetUpload = uploads[0];

      // 2. Upload file directly to S3 via PUT request
      await axios.put(targetUpload.uploadUrl, file, {
        headers: {
          "Content-Type": file.type,
        },
      });

      // 3. Inform backend of the successful upload
      const updatedAgreement = await apiUploadKyc(id, targetUpload.publicUrl);
      setCurrentAgreement(updatedAgreement);
      return updatedAgreement;
    } catch (err) {
      const apiError = err as ApiError;
      const error = err as Error;
      setError(
        apiError?.response?.data?.message ||
          error.message ||
          "Failed to upload KYC document",
      );
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const uploadSignatureFile = useCallback(
    async (id: string, file: File): Promise<string> => {
      try {
        setIsLoading(true);
        setError(null);

        // 1. Request S3 presigned URL
        const { uploads } = await apiGetUploadUrls(id, [
          {
            fileName: file.name,
            contentType: file.type,
          },
        ]);

        if (!uploads || uploads.length === 0) {
          throw new Error("Failed to get S3 upload signature");
        }

        const targetUpload = uploads[0];

        // 2. Upload file directly to S3 via PUT request
        await axios.put(targetUpload.uploadUrl, file, {
          headers: {
            "Content-Type": file.type,
          },
        });

        return targetUpload.publicUrl;
      } catch (err) {
        const apiError = err as ApiError;
        const error = err as Error;
        setError(
          apiError?.response?.data?.message ||
            error.message ||
            "Failed to upload signature file",
        );
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  return {
    createAgreement,
    signOwner,
    signTenant,
    getAgreementById,
    getMyAgreements,
    uploadKycFile,
    uploadSignatureFile,
    isLoading,
    error,
    agreements,
    currentAgreement,
  };
};
