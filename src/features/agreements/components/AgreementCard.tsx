import React from "react";
import {
  Clock,
  CheckCircle,
  AlertCircle,
  Building,
  Calendar,
  UserCheck,
  PenTool,
  Upload,
  Download,
} from "lucide-react";
import type { Agreement } from "../services/agreementService";

interface AgreementCardProps {
  agreement: Agreement;
  userRole?: string;
  kycFile?: File;
  onKycFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onKycUpload: () => void;
  onInitiateSign: () => void;
}

export const AgreementCard: React.FC<AgreementCardProps> = ({
  agreement,
  userRole,
  kycFile,
  onKycFileChange,
  onKycUpload,
  onInitiateSign,
}) => {
  const isOwner = userRole === "OWNER";
  const isTenant = userRole === "TENANT";

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "DRAFT":
        return {
          bg: "bg-gray-100 dark:bg-white/5",
          color: "text-gray-500",
          icon: Clock,
          label: "Drafting Phase",
        };
      case "PENDING_TENANT_SIGNATURE":
        return {
          bg: "bg-amber-100/70 dark:bg-amber-500/10",
          color: "text-amber-600",
          icon: PenTool,
          label: "Awaiting Tenant",
        };
      case "ACTIVE":
        return {
          bg: "bg-emerald-100/70 dark:bg-emerald-500/10",
          color: "text-emerald-600",
          icon: CheckCircle,
          label: "Activated & Live",
        };
      default:
        return {
          bg: "bg-rose-100/70 dark:bg-rose-500/10",
          color: "text-rose-600",
          icon: AlertCircle,
          label: status,
        };
    }
  };

  const badge = getStatusBadge(agreement.status);

  return (
    <div className="bg-white dark:bg-card border border-gray-100 dark:border-white/5 p-8 lg:p-10 rounded-[3.5rem] shadow-sm hover:shadow-xl hover:scale-[1.01] transition-all relative overflow-hidden group">
      <div className="absolute top-0 right-0 w-48 h-48 bg-primary/5 rounded-full -mr-24 -mt-24 blur-3xl group-hover:scale-150 transition-all duration-1000" />

      {/* Top Bar inside Card */}
      <div className="flex flex-col lg:flex-row justify-between lg:items-center gap-6 pb-8 border-b border-gray-100 dark:border-white/5">
        <div className="space-y-2">
          <div className="flex items-center gap-4 flex-wrap">
            <span className="text-2xl font-black text-gray-900 dark:text-white">
              Agreement #{agreement.agreementNumber}
            </span>
            <div
              className={`px-4.5 py-1.5 rounded-full flex items-center gap-2 text-[10px] font-black uppercase tracking-wider ${badge.bg} ${badge.color}`}
            >
              <badge.icon size={12} />
              {badge.label}
            </div>
          </div>
          <p className="text-xs font-semibold text-gray-400">
            Validity: {new Date(agreement.startDate).toLocaleDateString()} to{" "}
            {new Date(agreement.endDate).toLocaleDateString()}
          </p>
        </div>

        <div className="flex items-center gap-6">
          <div className="text-right">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
              Monthly Rental
            </p>
            <p className="text-2xl font-black text-gray-900 dark:text-white">
              ₹{agreement.monthlyRent.toLocaleString()}
            </p>
          </div>
          <div className="h-10 w-[1px] bg-gray-100 dark:bg-white/5" />
          <div className="text-right">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
              Refundable Security
            </p>
            <p className="text-2xl font-black text-primary">
              ₹{agreement.depositAmount.toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      {/* Actions inside Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-8">
        {/* Meta info Column */}
        <div className="lg:col-span-6 space-y-4">
          <div className="flex items-center gap-3 text-sm font-semibold text-gray-600 dark:text-gray-300">
            <Building className="w-5 h-5 text-primary shrink-0" />
            <span>Property Reference: {agreement.propertyId}</span>
          </div>
          <div className="flex items-center gap-3 text-sm font-semibold text-gray-600 dark:text-gray-300">
            <Calendar className="w-5 h-5 text-primary shrink-0" />
            <span>
              Created on {new Date(agreement.startDate).toLocaleDateString()}
            </span>
          </div>

          {agreement.tenantKycDocumentUrl && (
            <div className="flex items-center gap-3 text-xs font-semibold text-emerald-600">
              <UserCheck className="w-5 h-5 shrink-0" />
              <span>Tenant KYC Verified Document Uploaded</span>
            </div>
          )}
        </div>

        {/* Button actions Column */}
        <div className="lg:col-span-6 flex flex-col justify-center items-end gap-4">
          {/* 1. OWNER DRAFT SIGN */}
          {agreement.status === "DRAFT" && isOwner && (
            <button
              onClick={onInitiateSign}
              className="w-full sm:w-auto px-8 py-4.5 bg-primary text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
            >
              <PenTool size={16} /> Sign Draft to Publish
            </button>
          )}

          {/* 2. TENANT SIGN PATH WITH KYC REQUIREMENT */}
          {agreement.status === "PENDING_TENANT_SIGNATURE" && isTenant && (
            <div className="w-full sm:w-auto space-y-4 text-right">
              {!agreement.tenantKycDocumentUrl ? (
                <div className="p-6 bg-amber-50 dark:bg-white/5 border-2 border-dashed border-amber-200 dark:border-white/10 rounded-3xl flex flex-col items-center gap-4">
                  <div className="text-center space-y-1">
                    <h5 className="text-xs font-black uppercase tracking-wider text-amber-700 dark:text-amber-500">
                      KYC Government ID Required
                    </h5>
                    <p className="text-[10px] text-gray-400 font-semibold leading-normal max-w-xs">
                      Please upload Aadhaar or Passport before digitizing your signature.
                    </p>
                  </div>

                  <div className="flex items-center gap-3 w-full">
                    <input
                      type="file"
                      id={`kyc-file-${agreement.id}`}
                      className="hidden"
                      accept="application/pdf,image/*"
                      onChange={onKycFileChange}
                    />
                    <label
                      htmlFor={`kyc-file-${agreement.id}`}
                      className="flex-1 flex justify-center items-center gap-2 px-4 py-3 bg-white dark:bg-white/5 hover:bg-gray-100 dark:hover:bg-white/10 border border-gray-200 dark:border-white/5 rounded-2xl text-xs font-black uppercase tracking-wider cursor-pointer transition-all text-gray-700 dark:text-white"
                    >
                      {kycFile
                        ? kycFile.name.substring(0, 15) + "..."
                        : "Choose File"}
                    </label>
                    <button
                      onClick={onKycUpload}
                      className="px-6 py-3 bg-amber-500 text-white rounded-2xl text-xs font-black uppercase tracking-wider hover:bg-amber-600 transition-all flex items-center gap-2"
                    >
                      <Upload size={14} /> Upload
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={onInitiateSign}
                  className="px-8 py-4.5 bg-primary text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
                >
                  <PenTool size={16} /> Biometric Sign lease
                </button>
              )}
            </div>
          )}

          {/* 3. ACTIVE DOWNLOAD PDF */}
          {agreement.status === "ACTIVE" && agreement.agreementPdfUrl && (
            <a
              href={agreement.agreementPdfUrl}
              target="_blank"
              rel="noreferrer"
              className="w-full sm:w-auto px-8 py-4.5 bg-emerald-500 text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl shadow-emerald-500/20 hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
            >
              <Download size={16} /> Download Signed PDF
            </a>
          )}

          {/* Informational badges for await state */}
          {agreement.status === "PENDING_TENANT_SIGNATURE" && isOwner && (
            <div className="flex items-center gap-2 text-xs font-black text-amber-600 bg-amber-50 dark:bg-amber-500/10 px-5 py-3 rounded-2xl">
              <Clock size={16} /> Awaiting Tenant KYC & Signature
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
