import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { CheckCircle2, ArrowRight, Receipt } from "lucide-react";
import { useAppSelector } from "../../../hooks/useAppSelector";
import type { RootState } from "../../../app/store/store";
import { getPaymentById } from "../services/paymentService";
import type { Payment } from "../types/paymentTypes";
import { PAGE_ROUTES } from "../../../config/routes";
import { RoleTypes } from "../../../types/constants/role.constant";

const fmt = (n: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n);

const PaymentSuccessPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const user = useAppSelector((s: RootState) => s.auth.user);

  const paymentId = searchParams.get("paymentId");
  const [payment, setPayment] = useState<Payment | null>(null);
  const [loading, setLoading] = useState(!!paymentId);

  useEffect(() => {
    if (!paymentId) return;
    let cancelled = false;
    getPaymentById(paymentId)
      .then((data) => { if (!cancelled) setPayment(data); })
      .catch(() => {})
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [paymentId]);

  const dashboardRoute =
    user?.role === RoleTypes.OWNER_USER
      ? PAGE_ROUTES.OWNER_PAYMENTS
      : PAGE_ROUTES.TENANT_PAYMENTS;

  return (
    <div className="min-h-screen bg-[color:var(--color-background)] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-[color:var(--color-surface)] border border-[color:var(--color-border)] rounded-xl p-8 shadow-sm text-center space-y-6">
        {/* Icon */}
        <div className="flex justify-center">
          <div className="w-20 h-20 bg-emerald-50 dark:bg-emerald-500/10 rounded-full flex items-center justify-center">
            <CheckCircle2 size={40} className="text-emerald-500" />
          </div>
        </div>

        {/* Heading */}
        <div className="space-y-2">
          <h1 className="text-2xl font-black text-[color:var(--color-foreground)]">
            Payment Successful
          </h1>
          <p className="text-sm text-[color:var(--color-muted-foreground)]">
            Your payment has been processed and your agreement is now active.
          </p>
        </div>

        {/* Payment summary */}
        {!loading && payment && (
          <div className="bg-[color:var(--color-secondary)] rounded-xl p-4 space-y-3 text-left">
            <Row
              label="Amount Paid"
              value={
                <span className="font-black text-emerald-600">
                  {fmt(payment.amount)}
                </span>
              }
            />
            <Row
              label="Payment Type"
              value={
                payment.category === "SECURITY_DEPOSIT"
                  ? "Security Deposit"
                  : payment.category
              }
            />
            {payment.gatewayPaymentId && (
              <Row
                label="Reference ID"
                value={
                  <span className="font-mono text-xs">
                    {payment.gatewayPaymentId.slice(0, 24)}…
                  </span>
                }
              />
            )}
            {payment.receiptUrl && (
              <a
                href={payment.receiptUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-xs text-primary font-semibold hover:underline pt-1"
              >
                <Receipt size={13} />
                View Stripe Receipt
              </a>
            )}
          </div>
        )}

        {loading && (
          <div className="h-24 bg-[color:var(--color-secondary)] rounded-xl animate-pulse" />
        )}

        {/* Actions */}
        <div className="flex flex-col gap-3 pt-2">
          <button
            onClick={() => navigate(dashboardRoute)}
            className="flex items-center justify-center gap-2 w-full px-6 py-3 bg-primary text-white text-sm font-semibold rounded-lg shadow-md shadow-primary/20 hover:opacity-90 transition-all"
          >
            View Payments
            <ArrowRight size={15} />
          </button>
          <button
            onClick={() => navigate(PAGE_ROUTES.TENANT_AGREEMENTS)}
            className="w-full px-6 py-3 text-sm font-semibold text-[color:var(--color-foreground)] bg-[color:var(--color-secondary)] rounded-lg hover:bg-[color:var(--color-border)] transition-colors"
          >
            Go to Agreements
          </button>
        </div>
      </div>
    </div>
  );
};

const Row: React.FC<{ label: string; value: React.ReactNode }> = ({
  label,
  value,
}) => (
  <div className="flex items-center justify-between gap-4">
    <span className="text-xs text-[color:var(--color-muted-foreground)] font-medium">
      {label}
    </span>
    <span className="text-sm font-semibold text-[color:var(--color-foreground)] text-right">
      {value}
    </span>
  </div>
);

export default PaymentSuccessPage;
