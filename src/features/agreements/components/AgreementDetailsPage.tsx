import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DashboardLayout from "../../../components/common/DashboardLayout";
import { useSelector } from "react-redux";
import type { RootState } from "../../../app/store/store";
import { getAgreementById } from "../services/agreementService";
import type { Agreement } from "../services/agreementService";
import {
  FileText,
  User,
  MapPin,
  Calendar,
  IndianRupee,
  CheckCircle,
  Clock,
  AlertCircle,
  Download,
  ArrowLeft,
  Mail,
  Home,
} from "lucide-react";
import { LoadingOverlay } from "../../../components/common";

const AgreementDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.auth);
  const [agreement, setAgreement] = useState<Agreement | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAgreement = async () => {
      if (!id) return;
      try {
        const data = await getAgreementById(id);
        setAgreement(data);
      } catch (error) {
        console.error("Failed to fetch agreement details", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAgreement();
  }, [id]);

  if (!user) return <LoadingOverlay />;

  if (loading) {
    return (
      <DashboardLayout role={user.role} userName={user.fullname || ""}>
        <LoadingOverlay />
      </DashboardLayout>
    );
  }

  if (!agreement) {
    return (
      <DashboardLayout role={user.role} userName={user.fullname || ""}>
        <div className="flex flex-col items-center justify-center h-full p-6 text-center">
          <div className="bg-red-50 text-red-500 p-4 rounded-full mb-4">
            <AlertCircle size={48} />
          </div>
          <h2 className="text-2xl font-bold mb-2">Agreement Not Found</h2>
          <p className="text-gray-500 mb-6">
            We couldn't find the details for this agreement.
          </p>
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-2 bg-primary text-white rounded-xl hover:bg-primary/90 transition-colors"
          >
            Go Back
          </button>
        </div>
      </DashboardLayout>
    );
  }

  const isOwner = user?.role === "OWNER";
  const otherParty = isOwner ? agreement.tenant : agreement.owner;
  const partyRole = isOwner ? "Tenant" : "Owner";

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "bg-green-100 text-green-700 border-green-200";
      case "PENDING_TENANT_SIGNATURE":
      case "PENDING_PAYMENT":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "TERMINATED":
        return "bg-red-100 text-red-700 border-red-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  return (
    <DashboardLayout role={user.role} userName={user.fullname || ""}>
      <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <div>
              <h1 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight">
                Agreement #{agreement.agreementNumber}
              </h1>
              <div className="flex items-center gap-2 mt-2">
                <span
                  className={`px-3 py-1 text-xs font-bold rounded-full border ${getStatusColor(
                    agreement.status,
                  )}`}
                >
                  {agreement.status.replace(/_/g, " ")}
                </span>
                <span className="text-sm text-gray-500 flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  Starts {new Date(agreement.startDate).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
          {agreement.agreementPdfUrl && (
            <a
              href={agreement.agreementPdfUrl}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 px-5 py-2.5 bg-white border-2 border-gray-200 text-gray-700 rounded-xl hover:border-primary hover:text-primary transition-colors font-semibold shadow-sm"
            >
              <Download className="w-4 h-4" />
              Download PDF
            </a>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Property Card */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300">
              <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2 mb-4 border-b pb-4">
                <Home className="w-5 h-5 text-primary" />
                Property Details
              </h2>
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <MapPin className="w-8 h-8 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">
                    {agreement.property?.title || "Property Title"}
                  </h3>
                  <p className="text-gray-500 mt-1">
                    {agreement.property?.locationCity || "City Name"}
                  </p>
                </div>
              </div>
            </div>

            {/* Financials Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl p-6 text-white shadow-lg shadow-emerald-500/20 relative overflow-hidden group">
                <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/10 rounded-full blur-2xl group-hover:bg-white/20 transition-colors"></div>
                <div className="flex items-center gap-2 mb-2 opacity-90">
                  <IndianRupee className="w-5 h-5" />
                  <span className="font-semibold">Monthly Rent</span>
                </div>
                <div className="text-4xl font-black">
                  ₹{agreement.monthlyRent?.toLocaleString()}
                </div>
              </div>
              <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300">
                <div className="flex items-center gap-2 mb-2 text-gray-500">
                  <IndianRupee className="w-5 h-5 text-gray-400" />
                  <span className="font-semibold">Security Deposit</span>
                </div>
                <div className="text-3xl font-black text-gray-900">
                  ₹{agreement.depositAmount?.toLocaleString()}
                </div>
              </div>
            </div>

            {/* Terms Card */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300">
              <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2 mb-4 border-b pb-4">
                <FileText className="w-5 h-5 text-primary" />
                Key Terms
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Start Date</p>
                  <p className="font-semibold text-gray-900">
                    {new Date(agreement.startDate).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">End Date</p>
                  <p className="font-semibold text-gray-900">
                    {new Date(agreement.endDate).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Lock-in Period</p>
                  <p className="font-semibold text-gray-900">
                    {agreement.lockInPeriodMonths} Months
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Notice Period</p>
                  <p className="font-semibold text-gray-900">
                    {agreement.noticePeriodMonths} Months
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Maintenance</p>
                  <p className="font-semibold text-gray-900">
                    {agreement.maintenanceIncluded
                      ? "Included"
                      : `₹${agreement.maintenanceCharges}/mo`}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Late Fee</p>
                  <p className="font-semibold text-gray-900">
                    ₹{agreement.lateFeePerDay}/day
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Party Details */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300">
              <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2 mb-6 border-b pb-4">
                <User className="w-5 h-5 text-primary" />
                {partyRole} Details
              </h2>
              {otherParty ? (
                <div className="flex flex-col items-center text-center">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-primary to-indigo-500 flex items-center justify-center text-white text-2xl font-bold shadow-lg mb-4 ring-4 ring-primary/10">
                    {otherParty.fullName?.charAt(0).toUpperCase() || "?"}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-1">
                    {otherParty.fullName}
                  </h3>
                  <div className="w-full space-y-3 mt-6 text-left">
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 text-gray-700">
                      <Mail className="w-5 h-5 text-gray-400 shrink-0" />
                      <span className="truncate">{otherParty.email}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4">
                  Details not available
                </p>
              )}
            </div>

            {/* Signature Status */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300">
              <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2 mb-4 border-b pb-4">
                <CheckCircle className="w-5 h-5 text-primary" />
                Signatures
              </h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50">
                  <span className="font-medium text-gray-700">Owner</span>
                  {agreement.ownerSignatureUrl ? (
                    <span className="text-sm font-bold text-green-600 bg-green-100 px-3 py-1 rounded-full flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" /> Signed
                    </span>
                  ) : (
                    <span className="text-sm font-bold text-yellow-600 bg-yellow-100 px-3 py-1 rounded-full flex items-center gap-1">
                      <Clock className="w-3 h-3" /> Pending
                    </span>
                  )}
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50">
                  <span className="font-medium text-gray-700">Tenant</span>
                  {agreement.tenantSignatureUrl ? (
                    <span className="text-sm font-bold text-green-600 bg-green-100 px-3 py-1 rounded-full flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" /> Signed
                    </span>
                  ) : (
                    <span className="text-sm font-bold text-yellow-600 bg-yellow-100 px-3 py-1 rounded-full flex items-center gap-1">
                      <Clock className="w-3 h-3" /> Pending
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AgreementDetailsPage;
