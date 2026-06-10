import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  FileText,
  User,
  Home,
  IndianRupee,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Shield,
  Phone,
  Mail,
  Download,
  ExternalLink,
} from "lucide-react";
import { getAgreementDetails } from "../services/adminDataService";
import type { AdminAgreementDetail } from "../types/adminAgreementTypes";
import { LoadingOverlay } from "../../../components/common";

const statusColors: Record<string, string> = {
  DRAFT: "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300",
  PENDING_OWNER_SIGNATURE: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
  PENDING_TENANT_SIGNATURE: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
  PENDING_PAYMENT: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  ACTIVE: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  TERMINATED: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  EXPIRED: "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400",
};

const statusIcons: Record<string, typeof CheckCircle> = {
  ACTIVE: CheckCircle,
  TERMINATED: XCircle,
  EXPIRED: XCircle,
  DRAFT: Clock,
  PENDING_OWNER_SIGNATURE: Clock,
  PENDING_TENANT_SIGNATURE: Clock,
  PENDING_PAYMENT: Clock,
};

const InfoRow = ({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) => (
  <div className="flex items-start justify-between gap-4 py-3 border-b border-gray-50 dark:border-gray-800 last:border-0">
    <span className="text-xs font-bold text-gray-400 uppercase tracking-wide shrink-0">
      {label}
    </span>
    <span className="text-sm font-semibold text-gray-800 dark:text-gray-200 text-right">
      {value}
    </span>
  </div>
);

const UserCard = ({
  label,
  user,
  onClick,
}: {
  label: string;
  user: { id: string; fullname: string; email: string; phone?: string; avatarUrl?: string } | null;
  onClick?: () => void;
}) => (
  <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 p-5 shadow-sm">
    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">
      {label}
    </p>
    {user ? (
      <div
        className={onClick ? "cursor-pointer group" : ""}
        onClick={onClick}
      >
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center font-bold text-primary text-lg shrink-0">
            {user.fullname.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0">
            <p
              className={`font-bold text-sm text-gray-900 dark:text-white truncate ${onClick ? "group-hover:text-primary transition-colors" : ""}`}
            >
              {user.fullname}
            </p>
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <Mail size={12} className="shrink-0" />
            <span className="truncate">{user.email}</span>
          </div>
          {user.phone && (
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <Phone size={12} className="shrink-0" />
              <span>{user.phone}</span>
            </div>
          )}
        </div>
      </div>
    ) : (
      <div className="flex items-center gap-2 text-gray-400 text-sm">
        <User size={16} />
        <span>Not assigned</span>
      </div>
    )}
  </div>
);

const AdminAgreementDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [agreement, setAgreement] = useState<AdminAgreementDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const result = await getAgreementDetails(id);
        setAgreement(result);
      } catch (err) {
        console.error("Error fetching agreement details:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [id]);

  if (loading) return <LoadingOverlay />;
  if (error || !agreement) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center">
        <AlertCircle size={40} className="mb-3 text-red-400" />
        <p className="text-sm font-medium text-gray-500">
          Agreement not found or failed to load.
        </p>
        <button
          onClick={() => navigate(-1)}
          className="mt-4 text-sm text-primary hover:underline"
        >
          Go back
        </button>
      </div>
    );
  }

  const StatusIcon = statusIcons[agreement.status] ?? Clock;
  const durationMonths =
    agreement.startDate && agreement.endDate
      ? Math.round(
          (new Date(agreement.endDate).getTime() -
            new Date(agreement.startDate).getTime()) /
            (1000 * 60 * 60 * 24 * 30.44),
        )
      : null;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-primary transition-colors"
        >
          <ArrowLeft size={16} />
          Back
        </button>

        <div className="flex items-center gap-3 flex-wrap">
          {agreement.agreementPdfUrl && (
            <a
              href={agreement.agreementPdfUrl}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-xl text-xs font-bold hover:bg-gray-200 dark:hover:bg-gray-700 transition-all"
            >
              <Download size={14} />
              Download PDF
            </a>
          )}
        </div>
      </div>

      {/* Title block */}
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm p-6">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center">
              <FileText size={26} className="text-primary" />
            </div>
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">
                Agreement
              </p>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                {agreement.agreementNumber}
              </h1>
              <p className="text-xs text-gray-500 mt-0.5">
                Created{" "}
                {new Date(agreement.createdAt).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </p>
            </div>
          </div>
          <span
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider ${statusColors[agreement.status] ?? "bg-gray-100 text-gray-700"}`}
          >
            <StatusIcon size={14} />
            {agreement.status.replace(/_/g, " ")}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Financial Details */}
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm p-6">
            <h2 className="text-sm font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <IndianRupee size={16} className="text-primary" />
              Financial Terms
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
              <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl text-center">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-1">
                  Monthly Rent
                </p>
                <p className="text-xl font-bold text-primary">
                  ₹{agreement.monthlyRent.toLocaleString()}
                </p>
              </div>
              <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl text-center">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-1">
                  Security Deposit
                </p>
                <p className="text-xl font-bold text-gray-800 dark:text-white">
                  ₹{agreement.depositAmount.toLocaleString()}
                </p>
              </div>
              <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl text-center">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-1">
                  Maintenance
                </p>
                <p className="text-xl font-bold text-gray-800 dark:text-white">
                  {agreement.maintenanceIncluded
                    ? "Included"
                    : `₹${agreement.maintenanceCharges.toLocaleString()}`}
                </p>
              </div>
              <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl text-center">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-1">
                  Late Fee/Day
                </p>
                <p className="text-xl font-bold text-gray-800 dark:text-white">
                  ₹{agreement.lateFeePerDay.toLocaleString()}
                </p>
              </div>
            </div>
            <div>
              <InfoRow
                label="Late Fee Grace Period"
                value={`${agreement.lateFeeGracePeriodDays} days`}
              />
              <InfoRow
                label="Rent Escalation"
                value={`${agreement.rentEscalationPercentage}% per year`}
              />
            </div>
          </div>

          {/* Tenure & Dates */}
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm p-6">
            <h2 className="text-sm font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <Calendar size={16} className="text-primary" />
              Tenure & Dates
            </h2>
            <InfoRow
              label="Start Date"
              value={new Date(agreement.startDate).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            />
            <InfoRow
              label="End Date"
              value={new Date(agreement.endDate).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            />
            {durationMonths !== null && (
              <InfoRow
                label="Duration"
                value={`${durationMonths} months`}
              />
            )}
            <InfoRow
              label="Lock-in Period"
              value={`${agreement.lockInPeriodMonths} months`}
            />
            <InfoRow
              label="Notice Period"
              value={`${agreement.noticePeriodMonths} months`}
            />
          </div>

          {/* Signatures */}
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm p-6">
            <h2 className="text-sm font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <Shield size={16} className="text-primary" />
              Signatures & Deposit
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Owner signature */}
              <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl space-y-2">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">
                  Owner Signature
                </p>
                {agreement.ownerSignatureUrl ? (
                  <>
                    <img
                      src={agreement.ownerSignatureUrl}
                      alt="Owner signature"
                      className="h-12 object-contain"
                    />
                    <p className="text-xs text-gray-500">
                      Signed{" "}
                      {agreement.ownerSignedAt
                        ? new Date(agreement.ownerSignedAt).toLocaleDateString()
                        : "—"}
                    </p>
                    <a
                      href={agreement.ownerSignatureUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
                    >
                      <ExternalLink size={11} /> View
                    </a>
                  </>
                ) : (
                  <p className="text-xs text-gray-400 flex items-center gap-1.5">
                    <Clock size={12} /> Pending
                  </p>
                )}
              </div>
              {/* Tenant signature */}
              <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl space-y-2">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">
                  Tenant Signature
                </p>
                {agreement.tenantSignatureUrl ? (
                  <>
                    <img
                      src={agreement.tenantSignatureUrl}
                      alt="Tenant signature"
                      className="h-12 object-contain"
                    />
                    <p className="text-xs text-gray-500">
                      Signed{" "}
                      {agreement.tenantSignedAt
                        ? new Date(agreement.tenantSignedAt).toLocaleDateString()
                        : "—"}
                    </p>
                    <a
                      href={agreement.tenantSignatureUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
                    >
                      <ExternalLink size={11} /> View
                    </a>
                  </>
                ) : (
                  <p className="text-xs text-gray-400 flex items-center gap-1.5">
                    <Clock size={12} /> Pending
                  </p>
                )}
              </div>
            </div>

            {/* Deposit status */}
            <div className="mt-4 p-4 rounded-xl border border-gray-100 dark:border-gray-700 flex items-center justify-between">
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-1">
                  Security Deposit
                </p>
                <p className="text-sm font-bold text-gray-700 dark:text-gray-300">
                  ₹{agreement.depositAmount.toLocaleString()}
                </p>
                {agreement.depositPaidAt && (
                  <p className="text-xs text-gray-500 mt-0.5">
                    Paid on{" "}
                    {new Date(agreement.depositPaidAt).toLocaleDateString()}
                  </p>
                )}
              </div>
              <span
                className={`px-3 py-1.5 rounded-xl text-xs font-bold ${
                  agreement.depositPaid
                    ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                    : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                }`}
              >
                {agreement.depositPaid ? "Paid" : "Pending"}
              </span>
            </div>

            {agreement.depositRefundStatus && (
              <div className="mt-3 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                <p className="text-[10px] font-bold text-blue-500 uppercase tracking-wide mb-1">
                  Refund Status
                </p>
                <p className="text-sm font-bold text-blue-700 dark:text-blue-300">
                  {agreement.depositRefundStatus}
                  {agreement.depositRefundAmount
                    ? ` — ₹${agreement.depositRefundAmount.toLocaleString()}`
                    : ""}
                </p>
              </div>
            )}
          </div>

          {/* KYC Document */}
          {agreement.tenantKycDocumentUrl && (
            <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm p-6">
              <h2 className="text-sm font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <FileText size={16} className="text-primary" />
                Tenant KYC Document
              </h2>
              <div className="border border-gray-100 dark:border-gray-700 rounded-xl overflow-hidden">
                <div className="p-3 bg-gray-50 dark:bg-gray-800 flex items-center justify-between border-b border-gray-100 dark:border-gray-700">
                  <span className="text-xs font-bold text-gray-500">
                    KYC Document
                  </span>
                  <a
                    href={agreement.tenantKycDocumentUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1 text-xs text-primary hover:underline font-bold"
                  >
                    <ExternalLink size={12} /> View Full Screen
                  </a>
                </div>
                <div className="p-6 flex items-center justify-center bg-gray-50 dark:bg-gray-800/50">
                  <img
                    src={agreement.tenantKycDocumentUrl}
                    alt="Tenant KYC"
                    className="max-h-80 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Terms & Clauses */}
          {(agreement.customClauses || agreement.tenantRemarks) && (
            <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm p-6 space-y-4">
              <h2 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <FileText size={16} className="text-primary" />
                Clauses & Remarks
              </h2>
              {agreement.customClauses && (
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-2">
                    Custom Clauses
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed whitespace-pre-line">
                    {agreement.customClauses}
                  </p>
                </div>
              )}
              {agreement.tenantRemarks && (
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-2">
                    Tenant Remarks
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                    {agreement.tenantRemarks}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Termination info */}
          {agreement.status === "TERMINATED" && agreement.terminationReason && (
            <div className="p-5 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800 rounded-xl">
              <p className="text-xs font-bold text-red-600 mb-2 flex items-center gap-2">
                <XCircle size={14} /> Termination Reason
              </p>
              <p className="text-sm text-red-700 dark:text-red-400">
                {agreement.terminationReason}
              </p>
              {agreement.terminatedAt && (
                <p className="text-xs text-red-500 mt-1">
                  Terminated on{" "}
                  {new Date(agreement.terminatedAt).toLocaleDateString()}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Right column */}
        <div className="space-y-6">
          {/* People */}
          <UserCard
            label="Owner"
            user={
              agreement.owner
                ? {
                    id: agreement.ownerId,
                    fullname: agreement.owner.fullname,
                    email: agreement.owner.email,
                    phone: agreement.owner.phone,
                    avatarUrl: agreement.owner.avatarUrl,
                  }
                : null
            }
            onClick={() => navigate(`/admin/users/${agreement.ownerId}`)}
          />
          <UserCard
            label="Tenant"
            user={
              agreement.tenant
                ? {
                    id: agreement.tenantId,
                    fullname: agreement.tenant.fullname,
                    email: agreement.tenant.email,
                    phone: agreement.tenant.phone,
                    avatarUrl: agreement.tenant.avatarUrl,
                  }
                : null
            }
            onClick={
              agreement.tenantId
                ? () => navigate(`/admin/users/${agreement.tenantId}`)
                : undefined
            }
          />

          {/* Property card */}
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm p-5">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">
              Property
            </p>
            <button
              onClick={() =>
                navigate(`/admin/properties/${agreement.propertyId}`)
              }
              className="flex items-center gap-3 group w-full text-left"
            >
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                <Home size={18} className="text-primary" />
              </div>
              <div className="min-w-0">
                <p className="font-bold text-sm text-gray-900 dark:text-white group-hover:text-primary transition-colors truncate">
                  View Property
                </p>
                <p className="text-xs text-gray-500 truncate">
                  ID: {agreement.propertyId.slice(0, 12)}…
                </p>
              </div>
            </button>
          </div>

          {/* Timeline */}
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm p-5">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">
              Timeline
            </p>
            <div className="space-y-3">
              {[
                {
                  label: "Created",
                  date: agreement.createdAt,
                  done: true,
                },
                {
                  label: "Owner Signed",
                  date: agreement.ownerSignedAt,
                  done: !!agreement.ownerSignatureUrl,
                },
                {
                  label: "Tenant Signed",
                  date: agreement.tenantSignedAt,
                  done: !!agreement.tenantSignatureUrl,
                },
                {
                  label: "Deposit Paid",
                  date: agreement.depositPaidAt,
                  done: agreement.depositPaid,
                },
                {
                  label: "Agreement Active",
                  date: agreement.depositPaidAt,
                  done: agreement.status === "ACTIVE",
                },
              ].map((step, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div
                    className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                      step.done
                        ? "bg-green-100 dark:bg-green-900/30"
                        : "bg-gray-100 dark:bg-gray-800"
                    }`}
                  >
                    {step.done ? (
                      <CheckCircle
                        size={12}
                        className="text-green-600 dark:text-green-400"
                      />
                    ) : (
                      <Clock size={12} className="text-gray-400" />
                    )}
                  </div>
                  <div>
                    <p
                      className={`text-xs font-bold ${step.done ? "text-gray-800 dark:text-gray-200" : "text-gray-400"}`}
                    >
                      {step.label}
                    </p>
                    {step.date && (
                      <p className="text-[10px] text-gray-400">
                        {new Date(step.date).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminAgreementDetails;
