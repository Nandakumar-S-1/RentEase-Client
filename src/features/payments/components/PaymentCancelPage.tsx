import React from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { XCircle, RotateCcw, ArrowLeft } from "lucide-react";
import { useAppSelector } from "../../../hooks/useAppSelector";
import type { RootState } from "../../../app/store/store";
import { PAGE_ROUTES } from "../../../config/routes";
import { RoleTypes } from "../../../types/constants/role.constant";
import { usePayments } from "../hooks/usePayments";

const PaymentCancelPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const user = useAppSelector((s: RootState) => s.auth.user);
  const { checkout, isCheckingOut } = usePayments();

  const paymentId = searchParams.get("paymentId");

  const paymentsRoute =
    user?.role === RoleTypes.OWNER_USER
      ? PAGE_ROUTES.OWNER_PAYMENTS
      : PAGE_ROUTES.TENANT_PAYMENTS;

  const handleRetry = () => {
    if (paymentId) {
      checkout(paymentId);
    }
  };

  return (
    <div className="min-h-screen bg-[color:var(--color-background)] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-[color:var(--color-surface)] border border-[color:var(--color-border)] rounded-xl p-8 shadow-sm text-center space-y-6">
        {/* Icon */}
        <div className="flex justify-center">
          <div className="w-20 h-20 bg-red-50 dark:bg-red-500/10 rounded-full flex items-center justify-center">
            <XCircle size={40} className="text-red-400" />
          </div>
        </div>

        {/* Heading */}
        <div className="space-y-2">
          <h1 className="text-2xl font-black text-[color:var(--color-foreground)]">
            Payment Cancelled
          </h1>
          <p className="text-sm text-[color:var(--color-muted-foreground)]">
            You cancelled the checkout. No payment was made. Your agreement is
            still waiting for the security deposit.
          </p>
        </div>

        {/* Info box */}
        <div className="bg-amber-50 dark:bg-amber-500/10 border border-amber-100 dark:border-amber-500/20 rounded-xl p-4 text-left space-y-1">
          <p className="text-xs font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wide">
            What happens next?
          </p>
          <p className="text-sm text-amber-700 dark:text-amber-300">
            Your agreement remains in <strong>Pending Payment</strong> status
            until the security deposit is paid. You can retry any time from your
            payments page.
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-3 pt-2">
          {paymentId && (
            <button
              onClick={handleRetry}
              disabled={isCheckingOut}
              className="flex items-center justify-center gap-2 w-full px-6 py-3 bg-primary text-white text-sm font-semibold rounded-lg shadow-md shadow-primary/20 hover:opacity-90 active:scale-95 transition-all disabled:opacity-50"
            >
              {isCheckingOut ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Redirecting…
                </>
              ) : (
                <>
                  <RotateCcw size={15} />
                  Retry Payment
                </>
              )}
            </button>
          )}
          <button
            onClick={() => navigate(paymentsRoute)}
            className="flex items-center justify-center gap-2 w-full px-6 py-3 text-sm font-semibold text-[color:var(--color-foreground)] bg-[color:var(--color-secondary)] rounded-lg hover:bg-[color:var(--color-border)] transition-colors"
          >
            <ArrowLeft size={15} />
            Back to Payments
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentCancelPage;
