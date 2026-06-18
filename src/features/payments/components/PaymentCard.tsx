import React from "react";
import {
  CheckCircle2,
  Clock,
  XCircle,
  RotateCcw,
  CreditCard,
  ExternalLink,
} from "lucide-react";
import type {
  Payment,
  PaymentStatus,
  PaymentCategory,
} from "../types/paymentTypes";
import { format } from "date-fns";

/* ── helpers ──────────────────────────────────────────────────── */
const fmt = (n: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n);

const STATUS_META: Record<
  PaymentStatus,
  { label: string; color: string; icon: React.ReactNode }
> = {
  PENDING: {
    label: "Pending",
    color: "text-amber-600 bg-amber-50 dark:bg-amber-500/10",
    icon: <Clock size={13} />,
  },
  PAID: {
    label: "Paid",
    color: "text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10",
    icon: <CheckCircle2 size={13} />,
  },
  FAILED: {
    label: "Failed",
    color: "text-red-500 bg-red-50 dark:bg-red-500/10",
    icon: <XCircle size={13} />,
  },
  REFUNDED: {
    label: "Refunded",
    color: "text-blue-500 bg-blue-50 dark:bg-blue-500/10",
    icon: <RotateCcw size={13} />,
  },
  CANCELLED: {
    label: "Cancelled",
    color:
      "text-[color:var(--color-muted-foreground)] bg-[color:var(--color-secondary)]",
    icon: <XCircle size={13} />,
  },
};

const CATEGORY_LABEL: Record<PaymentCategory, string> = {
  SECURITY_DEPOSIT: "Security Deposit",
  RENT: "Rent Payment",
  MAINTENANCE: "Maintenance",
  LATE_FEE: "Late Fee",
  OTHER: "Payment",
};

interface PaymentCardProps {
  payment: Payment;
  /** shown for the payer (tenant) side — shows checkout button */
  canPay?: boolean;
  onCheckout?: (paymentId: string) => void;
  isCheckingOut?: boolean;
}

const PaymentCard: React.FC<PaymentCardProps> = ({
  payment,
  canPay,
  onCheckout,
  isCheckingOut,
}) => {
  const meta = STATUS_META[payment.status] ?? STATUS_META.PENDING;
  const categoryLabel = CATEGORY_LABEL[payment.category] ?? "Payment";

  return (
    <div className="bg-[color:var(--color-surface)] border border-[color:var(--color-border)] rounded-xl overflow-hidden">
      {/* Top bar */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-[color:var(--color-border)]">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-[color:var(--color-secondary)] rounded-lg">
            <CreditCard
              size={16}
              className="text-[color:var(--color-muted-foreground)]"
            />
          </div>
          <div>
            <p className="text-sm font-semibold text-[color:var(--color-foreground)]">
              {categoryLabel}
            </p>
            {payment.transactionId && (
              <p className="text-[11px] text-[color:var(--color-muted-foreground)] font-mono">
                #{payment.transactionId.slice(0, 16)}
              </p>
            )}
          </div>
        </div>
        <span
          className={`flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-lg ${meta.color}`}
        >
          {meta.icon}
          {meta.label}
        </span>
      </div>

      {/* Body */}
      <div className="px-5 py-4 space-y-4">
        {/* Amount */}
        <div className="flex items-end justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-[color:var(--color-muted-foreground)]">
              Amount
            </p>
            <p className="text-2xl font-black text-[color:var(--color-foreground)] mt-0.5">
              {fmt(payment.amount)}
            </p>
          </div>

          {/* Pay button — only for pending payments from payer's view */}
          {canPay && payment.status === "PENDING" && onCheckout && (
            <button
              onClick={() => onCheckout(payment.id)}
              disabled={isCheckingOut}
              className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white text-sm font-semibold rounded-lg shadow-md shadow-primary/20 hover:opacity-90 active:scale-95 transition-all disabled:opacity-50"
            >
              {isCheckingOut ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Redirecting…
                </>
              ) : (
                <>
                  <CreditCard size={15} />
                  Pay Now
                </>
              )}
            </button>
          )}
        </div>

        {/* Details grid */}
        <div className="grid grid-cols-2 gap-3">
          {payment.paidDate && (
            <Detail
              label="Paid On"
              value={format(new Date(payment.paidDate), "dd MMM yyyy, HH:mm")}
            />
          )}
          {payment.dueDate && (
            <Detail
              label="Due Date"
              value={format(new Date(payment.dueDate), "dd MMM yyyy")}
            />
          )}
          {payment.paymentGateway && (
            <Detail
              label="Gateway"
              value={
                payment.paymentGateway.charAt(0).toUpperCase() +
                payment.paymentGateway.slice(1)
              }
            />
          )}
          {payment.paymentMethod && (
            <Detail
              label="Method"
              value={
                payment.paymentMethod.charAt(0).toUpperCase() +
                payment.paymentMethod.slice(1)
              }
            />
          )}
          <Detail
            label="Created"
            value={format(new Date(payment.createdAt), "dd MMM yyyy")}
          />
        </div>

        {/* Receipt link */}
        {payment.receiptUrl && (
          <a
            href={payment.receiptUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs text-primary font-semibold hover:underline"
          >
            <ExternalLink size={12} />
            View Receipt
          </a>
        )}

        {/* Failure reason */}
        {payment.status === "FAILED" && payment.failureReason && (
          <div className="px-3 py-2 bg-red-50 dark:bg-red-500/10 border border-red-100 dark:border-red-500/20 rounded-lg">
            <p className="text-xs text-red-600 dark:text-red-400">
              {payment.failureReason}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

const Detail: React.FC<{ label: string; value: string }> = ({
  label,
  value,
}) => (
  <div className="px-3 py-2.5 bg-[color:var(--color-secondary)] rounded-lg">
    <p className="text-[10px] font-bold uppercase tracking-wider text-[color:var(--color-muted-foreground)]">
      {label}
    </p>
    <p className="text-sm font-semibold text-[color:var(--color-foreground)] mt-0.5">
      {value}
    </p>
  </div>
);

export default PaymentCard;
