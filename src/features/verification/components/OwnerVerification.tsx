import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Upload,
  FileCheck,
  Clock,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import { useSubmitVerification } from "../hooks/useSubmitVerification";
import { Button, FormMessage } from "../../../components/common";
import { PAGE_ROUTES } from "../../../config/routes";
import { VerificationStatus } from "../../../types/Constants/ownerVerification.constant";

const OwnerVerification = () => {
  const navigate = useNavigate();
  const {
    submit,
    fetchStatus,
    isLoading,
    error,
    successMessage,
    status,
    rejectionReason,
  } = useSubmitVerification();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [documentType, setDocumentType] = useState<"PAN" | "AADHAAR">(
    "AADHAAR",
  );
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const message = successMessage || error || "";
  const isError = !!error;

  useEffect(() => {
    fetchStatus();
    const interval = setInterval(fetchStatus, 30000);
    return () => clearInterval(interval);
  }, []);
  useEffect(() => {
    if (status === VerificationStatus.VERIFIED) {
      navigate(PAGE_ROUTES.DASHBOARD, { replace: true });
    }
  }, [status, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) return;
    await submit(documentType, selectedFile);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  if (status === VerificationStatus.SUBMITTED) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
        <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-yellow-50">
            <Clock className="h-8 w-8 text-yellow-500" />
          </div>
          <h1 className="mb-2 text-2xl font-bold text-gray-900">
            Verification Under Review
          </h1>
          <p className="text-gray-500">
            Your document has been submitted and is currently being reviewed by
            our team. You'll be notified once the verification is complete.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">
        <div className="mb-6 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            {status === VerificationStatus.REJECTED ? (
              <AlertCircle className="h-8 w-8 text-red-500" />
            ) : (
              <FileCheck className="h-8 w-8 text-primary" />
            )}
          </div>
          <h1 className="mb-2 text-2xl font-bold text-gray-900">
            {status === VerificationStatus.REJECTED
              ? "Verification Rejected"
              : "Verify Your Identity"}
          </h1>
          <p className="text-gray-500">
            {status === VerificationStatus.REJECTED
              ? rejectionReason
                ? `Your verification was rejected. Reason: ${rejectionReason}`
                : "Your previous submission was rejected. Please upload a new document."
              : "Upload a government-issued ID to start listing properties."}
          </p>
        </div>

        <FormMessage message={message} isError={isError} />

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Document Type
            </label>
            <select
              value={documentType}
              onChange={(e) =>
                setDocumentType(e.target.value as "PAN" | "AADHAAR")
              }
              className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              <option value="AADHAAR">Aadhaar Card</option>
              <option value="PAN">PAN Card</option>
            </select>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Upload Document
            </label>
            <div
              onClick={() => fileInputRef.current?.click()}
              className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-200 px-4 py-8 transition-colors hover:border-primary/50 hover:bg-primary/5"
            >
              {selectedFile ? (
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span className="font-medium">{selectedFile.name}</span>
                </div>
              ) : (
                <>
                  <Upload className="mb-2 h-8 w-8 text-gray-400" />
                  <p className="text-sm font-medium text-gray-600">
                    Click to upload your document
                  </p>
                  <p className="mt-1 text-xs text-gray-400">
                    JPG, PNG or PDF (max 5MB)
                  </p>
                </>
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,.pdf"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>

          <Button
            type="submit"
            loading={isLoading}
            disabled={!selectedFile || isLoading}
            className="w-full"
          >
            Submit for Verification
          </Button>
        </form>
      </div>
    </div>
  );
};

export default OwnerVerification;
