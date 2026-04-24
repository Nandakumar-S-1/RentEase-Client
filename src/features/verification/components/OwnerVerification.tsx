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
import { VerificationStatus } from "../../../types/constants/ownerVerification.constant";
import { DocumentTypes } from "../../../types/constants/document.constant";

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

  const [documentType, setDocumentType] = useState<DocumentTypes>(
    DocumentTypes.AADHAAR,
  );
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const message = successMessage || error || "";
  const isError = !!error;

  useEffect(() => {
    fetchStatus();
    const interval = setInterval(fetchStatus, 30000);
    return () => clearInterval(interval);
  }, [fetchStatus]);
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
      <div className="flex min-h-screen items-center justify-center bg-[color:var(--color-background)] px-4">
        <div className="w-full max-w-md rounded-3xl bg-[color:var(--color-surface)] p-10 shadow-xl border border-[color:var(--color-border)] text-center animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-amber-500/10 transition-colors">
            <Clock className="h-10 w-10 text-amber-500" />
          </div>
          <h1 className="mb-3 text-3xl font-black text-[color:var(--color-foreground)] tracking-tight">
            Verification Under Review
          </h1>
          <p className="text-gray-500 dark:text-gray-400 font-medium leading-relaxed">
            Your document has been submitted and is currently being reviewed by
            our team. You'll be notified once the verification is complete.
          </p>
          <div className="mt-8 pt-8 border-t border-[color:var(--color-border)]">
             <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/5 rounded-xl text-[10px] font-black text-primary uppercase tracking-widest">
                Real-time Status Updates Enabled
             </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[color:var(--color-background)] px-4">
      <div className="w-full max-w-md rounded-[2.5rem] bg-[color:var(--color-surface)] p-10 shadow-xl border border-[color:var(--color-border)] animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-primary/5">
            {status === VerificationStatus.REJECTED ? (
              <AlertCircle className="h-10 w-10 text-red-500" />
            ) : (
              <FileCheck className="h-10 w-10 text-primary" />
            )}
          </div>
          <h1 className="mb-2 text-3xl font-black text-[color:var(--color-foreground)] tracking-tight">
            {status === VerificationStatus.REJECTED
              ? "Verification Rejected"
              : "Verify Identity"}
          </h1>
          <p className="text-gray-500 dark:text-gray-400 font-medium leading-relaxed">
            {status === VerificationStatus.REJECTED
              ? rejectionReason
                ? `Reason: ${rejectionReason}`
                : "Your submission was rejected. Please re-upload a valid document."
              : "Upload a government-issued ID to activate your owner privileges."}
          </p>
        </div>

        <FormMessage message={message} isError={isError} />

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="mb-1.5 block text-xs font-black text-gray-400 uppercase tracking-widest ml-1">
              Document Type
            </label>
            <select
              value={documentType}
              onChange={(e) => setDocumentType(e.target.value as DocumentTypes)}
              className="w-full rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-background)] px-6 py-3.5 text-sm font-bold text-[color:var(--color-foreground)] focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all cursor-pointer"
            >
              <option value={DocumentTypes.AADHAAR}>Aadhaar Card</option>
              <option value={DocumentTypes.PAN}>PAN Card</option>
            </select>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-black text-gray-400 uppercase tracking-widest ml-1">
              Upload Document
            </label>
            <div
              onClick={() => fileInputRef.current?.click()}
              className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-[color:var(--color-border)] px-4 py-10 transition-all hover:border-primary/50 hover:bg-primary/5 group"
            >
              {selectedFile ? (
                <div className="flex items-center gap-3 text-sm text-[color:var(--color-foreground)] font-black">
                  <CheckCircle className="h-6 w-6 text-green-500" />
                  <span className="truncate max-w-[200px]">{selectedFile.name}</span>
                </div>
              ) : (
                <>
                  <div className="mb-3 p-4 bg-gray-100 dark:bg-white/5 rounded-2xl text-gray-400 group-hover:text-primary transition-colors">
                    <Upload className="h-8 w-8" />
                  </div>
                  <p className="text-sm font-black text-gray-600 dark:text-gray-300">
                    Click to upload document
                  </p>
                  <p className="mt-1 text-xs font-bold text-gray-400">
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
            className="w-full py-4 rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98]"
          >
            Submit for Verification
          </Button>
        </form>
      </div>
    </div>
  );
};

export default OwnerVerification;
