import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DashboardLayout from "../../../components/common/DashboardLayout";
import { useSelector } from "react-redux";
import type { RootState } from "../../../app/store/store";
import { getPaymentById } from "../services/paymentService";
import type { Payment } from "../types/paymentTypes";
import {
  IndianRupee,
  CheckCircle,
  AlertCircle,
  Clock,
  ArrowLeft,
  Receipt,
  FileText,
  User,
  MapPin,
  CreditCard,
} from "lucide-react";
import { LoadingOverlay } from "../../../components/common";

const PaymentDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.auth);
  const [payment, setPayment] = useState<Payment | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPayment = async () => {
      if (!id) return;
      try {
        const data = await getPaymentById(id);
        setPayment(data);
      } catch (error) {
        console.error("Failed to fetch payment details", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPayment();
  }, [id]);

  if (!user) return <LoadingOverlay />;

  if (loading) {
    return (
      <DashboardLayout role={user.role} userName={user.fullname || ""}>
        <LoadingOverlay />
      </DashboardLayout>
    );
  }

  if (!payment) {
    return (
      <DashboardLayout role={user.role} userName={user.fullname || ""}>
        <div className="flex flex-col items-center justify-center h-full p-6 text-center">
          <div className="bg-red-50 text-red-500 p-4 rounded-full mb-4">
            <AlertCircle size={48} />
          </div>
          <h2 className="text-2xl font-bold mb-2">Payment Not Found</h2>
          <p className="text-gray-500 mb-6">
            We couldn't find the details for this payment.
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

  const isPayer = user?.id === payment.payerId;
  const otherParty = isPayer ? payment.payee : payment.payer;
  const partyRole = isPayer ? "Paid To" : "Received From";

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PAID":
        return "bg-green-100 text-green-700 border-green-200";
      case "PENDING":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "FAILED":
      case "CANCELLED":
        return "bg-red-100 text-red-700 border-red-200";
      case "REFUNDED":
        return "bg-purple-100 text-purple-700 border-purple-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "PAID":
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case "PENDING":
        return <Clock className="w-5 h-5 text-yellow-600" />;
      case "FAILED":
      case "CANCELLED":
        return <AlertCircle className="w-5 h-5 text-red-600" />;
      default:
        return <CheckCircle className="w-5 h-5 text-gray-600" />;
    }
  };

  return (
    <DashboardLayout role={user.role} userName={user.fullname || ""}>
      <div className="p-6 md:p-8 max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        {/* Header Section */}
        <div className="flex items-center gap-4 border-b pb-6">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight">
                  Payment Details
                </h1>
                <p className="text-sm text-gray-500 mt-1">
                  Transaction ID: {payment.transactionId || payment.id}
                </p>
              </div>
              <div
                className={`px-4 py-2 rounded-full border flex items-center gap-2 ${getStatusColor(payment.status)}`}
              >
                {getStatusIcon(payment.status)}
                <span className="font-bold">{payment.status}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Financial Card */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -mr-32 -mt-32"></div>

              <div className="flex flex-col items-center justify-center py-8">
                <p className="text-gray-500 font-medium mb-2 uppercase tracking-wider">
                  {payment.category.replace(/_/g, " ")}
                </p>
                <div className="text-6xl font-black text-gray-900 flex items-center">
                  <IndianRupee className="w-10 h-10 mr-1" />
                  {payment.amount.toLocaleString()}
                </div>
                {payment.paidDate && (
                  <p className="text-green-600 font-medium mt-4 flex items-center gap-1 bg-green-50 px-4 py-1.5 rounded-full">
                    <CheckCircle className="w-4 h-4" /> Paid on{" "}
                    {new Date(payment.paidDate).toLocaleString()}
                  </p>
                )}
                {!payment.paidDate && payment.dueDate && (
                  <p className="text-yellow-600 font-medium mt-4 flex items-center gap-1 bg-yellow-50 px-4 py-1.5 rounded-full">
                    <Clock className="w-4 h-4" /> Due on{" "}
                    {new Date(payment.dueDate).toLocaleDateString()}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4 mt-8 pt-8 border-t border-gray-100">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Payment Method</p>
                  <p className="font-bold flex items-center gap-2 text-gray-900">
                    <CreditCard className="w-4 h-4 text-primary" />
                    {payment.paymentMethod || "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">
                    Gateway Reference
                  </p>
                  <p className="font-bold flex items-center gap-2 text-gray-900 font-mono text-sm">
                    {payment.gatewayPaymentId || "N/A"}
                  </p>
                </div>
              </div>
            </div>

            {/* Property Context */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col sm:flex-row gap-6 items-start sm:items-center">
              <div className="w-16 h-16 rounded-2xl bg-indigo-50 flex items-center justify-center shrink-0">
                <MapPin className="w-8 h-8 text-indigo-500" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-500 font-medium mb-1">
                  Related Property
                </p>
                <h3 className="text-lg font-bold text-gray-900">
                  {payment.property?.title || "Property"}
                </h3>
                <p className="text-gray-500">
                  {payment.property?.locationCity}
                </p>
              </div>
            </div>

            {/* Agreement Context */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col sm:flex-row gap-6 items-start sm:items-center">
              <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center shrink-0">
                <FileText className="w-8 h-8 text-blue-500" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-500 font-medium mb-1">
                  Related Agreement
                </p>
                <h3 className="text-lg font-bold text-gray-900">
                  #{payment.agreement?.agreementNumber || "N/A"}
                </h3>
              </div>
              <button
                onClick={() => navigate(`/agreements/${payment.agreementId}`)}
                className="px-4 py-2 bg-gray-50 hover:bg-gray-100 text-primary font-medium rounded-xl transition-colors"
              >
                View Agreement
              </button>
            </div>
          </div>

          {/* Sidebar Info */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
              <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2 mb-6 border-b pb-4">
                <User className="w-5 h-5 text-primary" />
                {partyRole}
              </h2>
              {otherParty ? (
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-primary to-indigo-500 flex items-center justify-center text-white font-bold">
                    {otherParty.fullName?.charAt(0).toUpperCase() || "?"}
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">
                      {otherParty.fullName}
                    </h3>
                    <p className="text-sm text-gray-500">{otherParty.email}</p>
                    {otherParty.phone && (
                      <p className="text-sm text-gray-500">
                        {otherParty.phone}
                      </p>
                    )}
                  </div>
                </div>
              ) : (
                <p className="text-gray-500 text-sm">Details unavailable</p>
              )}
            </div>

            {payment.receiptUrl && (
              <a
                href={payment.receiptUrl}
                target="_blank"
                rel="noreferrer"
                className="bg-primary hover:bg-primary/90 text-white rounded-2xl p-6 flex flex-col items-center justify-center gap-3 transition-colors group cursor-pointer shadow-lg shadow-primary/20"
              >
                <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Receipt className="w-6 h-6" />
                </div>
                <span className="font-bold text-lg">Download Receipt</span>
              </a>
            )}

            {payment.failureReason && (
              <div className="bg-red-50 rounded-2xl p-6 border border-red-100 text-red-700">
                <h3 className="font-bold flex items-center gap-2 mb-2">
                  <AlertCircle className="w-5 h-5" />
                  Failure Reason
                </h3>
                <p className="text-sm">{payment.failureReason}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default PaymentDetailsPage;
