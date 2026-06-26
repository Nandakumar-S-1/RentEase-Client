import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getPaymentById } from "../../payments/services/paymentService";
import type { Payment } from "../../payments/types/paymentTypes";
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

const AdminPaymentDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
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

  if (loading) {
    return <LoadingOverlay />;
  }

  if (!payment) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] text-center">
        <div className="bg-red-50 text-red-500 p-4 rounded-full mb-4">
          <AlertCircle size={48} />
        </div>
        <h2 className="text-2xl font-bold mb-2">Payment Not Found</h2>
        <p className="text-gray-500 mb-6">
          The system couldn't find details for this payment.
        </p>
        <button
          onClick={() => navigate(-1)}
          className="px-6 py-2 bg-primary text-white rounded-xl hover:bg-primary/90 transition-colors"
        >
          Go Back
        </button>
      </div>
    );
  }

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
    <div className="p-6 md:p-8 max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
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
                Payment Master Details
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
                <p className="text-sm text-gray-500 mb-1">Gateway Reference</p>
                <p className="font-bold flex items-center gap-2 text-gray-900 font-mono text-sm">
                  {payment.gatewayPaymentId || "N/A"}
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Payer Card */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
              <h2 className="text-sm text-gray-500 font-bold flex items-center gap-2 mb-4 uppercase tracking-wider">
                <User className="w-4 h-4 text-indigo-500" />
                Payer (Tenant)
              </h2>
              {payment.payer ? (
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-xl mb-3">
                    {payment.payer.fullName?.charAt(0).toUpperCase() || "?"}
                  </div>
                  <h3 className="font-bold text-gray-900">
                    {payment.payer.fullName}
                  </h3>
                  <p className="text-sm text-gray-500">{payment.payer.email}</p>
                </div>
              ) : (
                <p className="text-gray-500 text-sm">Details unavailable</p>
              )}
            </div>

            {/* Payee Card */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
              <h2 className="text-sm text-gray-500 font-bold flex items-center gap-2 mb-4 uppercase tracking-wider">
                <User className="w-4 h-4 text-emerald-500" />
                Payee (Owner)
              </h2>
              {payment.payee ? (
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 font-bold text-xl mb-3">
                    {payment.payee.fullName?.charAt(0).toUpperCase() || "?"}
                  </div>
                  <h3 className="font-bold text-gray-900">
                    {payment.payee.fullName}
                  </h3>
                  <p className="text-sm text-gray-500">{payment.payee.email}</p>
                </div>
              ) : (
                <p className="text-gray-500 text-sm">Details unavailable</p>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar Context */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col items-start">
            <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center shrink-0 mb-4">
              <MapPin className="w-6 h-6 text-indigo-500" />
            </div>
            <p className="text-sm text-gray-500 font-medium mb-1">
              Related Property
            </p>
            <h3 className="text-lg font-bold text-gray-900">
              {payment.property?.title || "Property Title"}
            </h3>
            <p className="text-sm text-gray-500">
              {payment.property?.locationCity}
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col items-start">
            <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center shrink-0 mb-4">
              <FileText className="w-6 h-6 text-blue-500" />
            </div>
            <p className="text-sm text-gray-500 font-medium mb-1">
              Related Agreement
            </p>
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              #{payment.agreement?.agreementNumber || "N/A"}
            </h3>
            <button
              onClick={() => navigate(`/agreements/${payment.agreementId}`)}
              className="w-full py-2 bg-gray-50 hover:bg-gray-100 text-primary font-medium rounded-xl transition-colors text-sm"
            >
              View Agreement Master
            </button>
          </div>

          {payment.receiptUrl && (
            <a
              href={payment.receiptUrl}
              target="_blank"
              rel="noreferrer"
              className="bg-primary hover:bg-primary/90 text-white rounded-2xl p-6 flex items-center justify-between transition-colors shadow-lg shadow-primary/20"
            >
              <div className="flex items-center gap-3">
                <Receipt className="w-6 h-6" />
                <span className="font-bold">Original Receipt</span>
              </div>
              <Download className="w-4 h-4" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

import { Download } from "lucide-react";

export default AdminPaymentDetails;
