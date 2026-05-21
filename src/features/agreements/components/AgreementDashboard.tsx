import React, { useEffect, useState } from "react";
import { useAgreements } from "../hooks/useAgreements";
import { SignatureModal } from "./SignatureModal";
import { AgreementStats } from "./AgreementStats";
import { AgreementCard } from "./AgreementCard";
import { FileText } from "lucide-react";
import toast from "react-hot-toast";
import DashboardLayout from "../../../components/common/DashboardLayout";
import { useSelector } from "react-redux";
import type { RootState } from "../../../app/store/store";
import type { RoleType } from "../../../types/constants/role.constant";
import type { Agreement } from "../services/agreementService";
import { useNavigate } from "react-router-dom";
import { PAGE_ROUTES } from "../../../config/routes";

// Helper helper to convert base64 to File
const dataURLtoFile = (dataurl: string, filename: string): File => {
  const arr = dataurl.split(",");
  const mime = arr[0].match(/:(.*?);/)?.[1] || "image/png";
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, { type: mime });
};

export const AgreementDashboard = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const {
    agreements,
    isLoading,
    getMyAgreements,
    signOwner,
    signTenant,
    uploadKycFile,
    uploadSignatureFile,
  } = useAgreements();

  const [activeSignAgreement, setActiveSignAgreement] = useState<Agreement | null>(null);
  const [isSignModalOpen, setIsSignModalOpen] = useState(false);
  const [kycFiles, setKycFiles] = useState<{ [agreementId: string]: File }>({});

  const navigate = useNavigate();

  useEffect(() => {
    getMyAgreements().catch(() => {
      toast.error("Failed to load agreements");
    });
  }, [getMyAgreements]);

  const handleKycFileChange = (agreementId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setKycFiles((prev) => ({ ...prev, [agreementId]: file }));
    }
  };

  const handleKycUpload = async (agreementId: string) => {
    const file = kycFiles[agreementId];
    if (!file) {
      toast.error("Please choose a file to upload");
      return;
    }

    try {
      toast.loading("Uploading KYC Document...", { id: "kyc-upload" });
      await uploadKycFile(agreementId, file);
      toast.success("KYC Document uploaded successfully!", { id: "kyc-upload" });
      getMyAgreements();
    } catch (err) {
      const error = err as Error;
      toast.error(error.message || "Failed to upload KYC", { id: "kyc-upload" });
    }
  };

  const initiateSign = (agreement: Agreement) => {
    setActiveSignAgreement(agreement);
    setIsSignModalOpen(true);
  };

  const handleSignatureSubmit = async (signatureData: string) => {
    if (!activeSignAgreement) return;

    try {
      toast.loading("Registering Signature...", { id: "sign" });

      const file = dataURLtoFile(signatureData, `sig-${user?.role}-${Date.now()}.png`);
      const s3Url = await uploadSignatureFile(activeSignAgreement.id, file);

      if (user?.role === "OWNER") {
        await signOwner(activeSignAgreement.id, s3Url);
        toast.success("Agreement signed successfully as landlord!", { id: "sign" });
      } else {
        await signTenant(activeSignAgreement.id, s3Url);
        toast.success("Agreement signed and contract activated!", { id: "sign" });
      }

      setIsSignModalOpen(false);
      setActiveSignAgreement(null);
      getMyAgreements();
    } catch (err) {
      const error = err as Error;
      toast.error(error.message || "Failed to save signature", { id: "sign" });
    }
  };

  return (
    <DashboardLayout role={user?.role as RoleType} userName={user?.fullname || "User"}>
      <div className="pb-20 space-y-12 animate-in fade-in duration-1000">
        {/* Dynamic Premium Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-8">
          <div className="space-y-4">
            <h1 className="text-5xl font-black text-gray-900 dark:text-white tracking-tight leading-none">
              Agreements <span className="text-primary">Console</span>
            </h1>
            <p className="text-gray-500 dark:text-gray-400 font-bold text-lg max-w-xl">
              Digital signature portal, automated lease drafts, and secure escrow terms.
            </p>
          </div>

          {user?.role === "OWNER" && (
            <button
              onClick={() => navigate(PAGE_ROUTES.OWNER_CREATE_AGREEMENT)}
              className="px-8 py-4.5 bg-primary text-white rounded-3xl text-sm font-black uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-[1.02] hover:shadow-2xl transition-all"
            >
              Draft New Lease
            </button>
          )}
        </div>

        {/* Analytics Section */}
        <AgreementStats agreements={agreements} />

        {/* Agreements Display Grid */}
        {isLoading && agreements.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-80 space-y-4">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            <p className="text-sm font-black text-gray-400 uppercase tracking-widest">
              Synchronizing records...
            </p>
          </div>
        ) : agreements.length === 0 ? (
          <div className="bg-white dark:bg-card border border-gray-100 dark:border-white/5 rounded-[3.5rem] p-16 flex flex-col items-center text-center space-y-6">
            <div className="w-20 h-20 bg-primary/5 rounded-full flex items-center justify-center text-primary">
              <FileText className="w-10 h-10" />
            </div>
            <div>
              <h3 className="text-2xl font-black text-gray-900 dark:text-white">
                No Contracts Drafted Yet
              </h3>
              <p className="text-gray-400 font-bold max-w-sm mt-2">
                Lease agreements and legal matching parameters will appear in this control desk.
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8">
            {agreements.map((agreement) => (
              <AgreementCard
                key={agreement.id}
                agreement={agreement}
                userRole={user?.role}
                kycFile={kycFiles[agreement.id]}
                onKycFileChange={(e) => handleKycFileChange(agreement.id, e)}
                onKycUpload={() => handleKycUpload(agreement.id)}
                onInitiateSign={() => initiateSign(agreement)}
              />
            ))}
          </div>
        )}
      </div>

      <SignatureModal
        isOpen={isSignModalOpen}
        onClose={() => setIsSignModalOpen(false)}
        onSign={handleSignatureSubmit}
        role={user?.role === "OWNER" ? "OWNER" : "TENANT"}
      />
    </DashboardLayout>
  );
};

export default AgreementDashboard;
