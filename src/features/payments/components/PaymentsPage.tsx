import React, { useEffect, useState } from "react";
import DashboardLayout from "../../../components/common/DashboardLayout";
import { useAppSelector } from "../../../hooks/useAppSelector";
import type { RootState } from "../../../app/store/store";
import type { RoleType } from "../../../types/constants/role.constant";
import { usePayments } from "../hooks/usePayments";
import { getMyAgreements } from "../../agreements/services/agreementService";
import type { Agreement } from "../../agreements/services/agreementService";
import PaymentCard from "./PaymentCard";
import type { Payment } from "../types/paymentTypes";
import {
  CreditCard,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  Clock,
  AlertCircle,
} from "lucide-react";

/* ── tiny stat card ───────────────────────────────────────────── */
const StatPill: React.FC<{
  label: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
}> = ({ label, value, icon, color }) => (
  <div className="flex items-center gap-3 bg-[color:var(--color-surface)] border border-[color:var(--color-border)] rounded-xl px-4 py-3">
    <div className={`p-2 rounded-lg flex-shrink-0 ${color}`}>{icon}</div>
    <div>
      <p className="text-lg font-black text-[color:var(--color-foreground)]">
        {value}
      </p>
      <p className="text-xs text-[color:var(--color-muted-foreground)] font-medium">
        {label}
      </p>
    </div>
  </div>
);

const fmt = (n: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n);

/* ── agreement section (collapsible) ─────────────────────────── */
interface AgreementSectionProps {
  agreement: Agreement;
  userRole: string | undefined;
  userId: string | undefined;
}

const AgreementSection: React.FC<AgreementSectionProps> = ({
  agreement,
  userRole,
  userId,
}) => {
  const [open, setOpen] = useState(true);
  const { payments, isLoading, isCheckingOut, fetchByAgreement, checkout } =
    usePayments();

  useEffect(() => {
    fetchByAgreement(agreement.id);
  }, [agreement.id, fetchByAgreement]);

  const totalPaid = payments
    .filter((p) => p.status === "PAID")
    .reduce((s, p) => s + p.amount, 0);

  const hasPending = payments.some((p) => p.status === "PENDING");

  return (
    <div className="bg-[color:var(--color-surface)] border border-[color:var(--color-border)] rounded-xl overflow-hidden">
      {/* header */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-5 py-4 hover:bg-[color:var(--color-secondary)] transition-colors"
      >
        <div className="flex items-center gap-3 text-left">
          <div className="p-2 bg-primary/10 rounded-lg flex-shrink-0">
            <CreditCard size={16} className="text-primary" />
          </div>
          <div>
            <p className="text-sm font-semibold text-[color:var(--color-foreground)]">
              Agreement #{agreement.agreementNumber}
            </p>
            <p className="text-xs text-[color:var(--color-muted-foreground)]">
              {fmt(agreement.monthlyRent)}/mo · {payments.length} payment
              {payments.length !== 1 ? "s" : ""}
              {totalPaid > 0 && ` · ${fmt(totalPaid)} paid`}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          {hasPending && (
            <span className="text-[11px] font-semibold px-2 py-0.5 rounded-lg text-amber-600 bg-amber-50 dark:bg-amber-500/10">
              Action needed
            </span>
          )}
          {open ? (
            <ChevronUp
              size={16}
              className="text-[color:var(--color-muted-foreground)]"
            />
          ) : (
            <ChevronDown
              size={16}
              className="text-[color:var(--color-muted-foreground)]"
            />
          )}
        </div>
      </button>

      {/* payment list */}
      {open && (
        <div className="border-t border-[color:var(--color-border)] p-4 space-y-3">
          {isLoading ? (
            <div className="space-y-3">
              {[0, 1].map((i) => (
                <div
                  key={i}
                  className="h-28 bg-[color:var(--color-secondary)] rounded-xl animate-pulse"
                />
              ))}
            </div>
          ) : payments.length === 0 ? (
            <p className="text-sm text-[color:var(--color-muted-foreground)] text-center py-6">
              No payments found for this agreement.
            </p>
          ) : (
            payments.map((p: Payment) => (
              <PaymentCard
                key={p.id}
                payment={p}
                canPay={userRole === "TENANT" && p.payerId === userId}
                onCheckout={checkout}
                isCheckingOut={isCheckingOut}
              />
            ))
          )}
        </div>
      )}
    </div>
  );
};

/* ── main page ────────────────────────────────────────────────── */
const PaymentsPage: React.FC = () => {
  const user = useAppSelector((s: RootState) => s.auth.user);
  const [agreements, setAgreements] = useState<Agreement[]>([]);
  const [loadingAgreements, setLoadingAgreements] = useState(true);

  useEffect(() => {
    getMyAgreements()
      .then(setAgreements)
      .catch(() => {})
      .finally(() => setLoadingAgreements(false));
  }, []);

  // aggregate stats across all agreement sections is done per-section
  // here we just show agreement-level summary
  const activeAgreements = agreements.filter(
    (a) => a.status === "ACTIVE",
  ).length;
  const pendingPaymentAgreements = agreements.filter(
    (a) => a.status === "PENDING_PAYMENT",
  ).length;

  return (
    <DashboardLayout
      role={user?.role as RoleType}
      userName={user?.fullname ?? ""}
    >
      <div className="max-w-4xl mx-auto space-y-8 pb-16">
        {/* ── Header ──────────────────────────────────────── */}
        <div>
          <h1 className="text-2xl font-black text-[color:var(--color-foreground)] tracking-tight">
            Payments
          </h1>
          <p className="text-sm text-[color:var(--color-muted-foreground)] mt-1">
            {user?.role === "TENANT"
              ? "Track and complete your rental payments."
              : "View payments received across your agreements."}
          </p>
        </div>

        {/* ── Stats ───────────────────────────────────────── */}
        {!loadingAgreements && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <StatPill
              label="Agreements"
              value={agreements.length}
              icon={<CreditCard size={15} className="text-primary" />}
              color="bg-primary/10"
            />
            <StatPill
              label="Active Leases"
              value={activeAgreements}
              icon={<CheckCircle2 size={15} className="text-emerald-500" />}
              color="bg-emerald-50 dark:bg-emerald-500/10"
            />
            <StatPill
              label="Awaiting Payment"
              value={pendingPaymentAgreements}
              icon={
                pendingPaymentAgreements > 0 ? (
                  <AlertCircle size={15} className="text-amber-500" />
                ) : (
                  <Clock
                    size={15}
                    className="text-[color:var(--color-muted-foreground)]"
                  />
                )
              }
              color={
                pendingPaymentAgreements > 0
                  ? "bg-amber-50 dark:bg-amber-500/10"
                  : "bg-[color:var(--color-secondary)]"
              }
            />
          </div>
        )}

        {/* ── Agreement sections ───────────────────────────── */}
        {loadingAgreements ? (
          <div className="space-y-4">
            {[0, 1].map((i) => (
              <div
                key={i}
                className="h-20 bg-[color:var(--color-surface)] border border-[color:var(--color-border)] rounded-xl animate-pulse"
              />
            ))}
          </div>
        ) : agreements.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4 bg-[color:var(--color-surface)] border border-[color:var(--color-border)] rounded-xl">
            <div className="p-4 bg-[color:var(--color-secondary)] rounded-xl">
              <CreditCard
                size={28}
                className="text-[color:var(--color-muted-foreground)]"
              />
            </div>
            <div className="text-center">
              <p className="font-semibold text-[color:var(--color-foreground)]">
                No payments yet
              </p>
              <p className="text-sm text-[color:var(--color-muted-foreground)] mt-1">
                Payments will appear here once you have active agreements.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {agreements.map((agreement) => (
              <AgreementSection
                key={agreement.id}
                agreement={agreement}
                userRole={user?.role}
                userId={user?.id}
              />
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default PaymentsPage;
