import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FileText,
  Heart,
  Search,
  ArrowRight,
  CheckCircle2,
  Clock,
  XCircle,
  Home,
} from "lucide-react";
import { useAppSelector } from "../../hooks/useAppSelector";
import type { RootState } from "../../app/store/store";
import { getMyAgreements } from "../../features/agreements/services/agreementService";
import type { Agreement } from "../../features/agreements/services/agreementService";
import { PAGE_ROUTES } from "../../config/routes";
import { axiosApi } from "../../services/api/axiosInstance";
import { API_ROUTES } from "../../config/routes";
import type { PropertyData } from "../../features/property/types/propertyTypes";
import { format } from "date-fns";

/* ── helpers ──────────────────────────────────────────────────── */
const fmt = (n: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n);

const agreementStatusMeta: Record<
  string,
  { label: string; color: string; icon: React.ReactNode }
> = {
  ACTIVE: {
    label: "Active",
    color: "text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10",
    icon: <CheckCircle2 size={12} />,
  },
  PENDING_OWNER_SIGNATURE: {
    label: "Awaiting owner",
    color: "text-amber-600 bg-amber-50 dark:bg-amber-500/10",
    icon: <Clock size={12} />,
  },
  PENDING_TENANT_SIGNATURE: {
    label: "Sign required",
    color: "text-blue-600 bg-blue-50 dark:bg-blue-500/10",
    icon: <Clock size={12} />,
  },
  PENDING_KYC: {
    label: "KYC pending",
    color: "text-orange-600 bg-orange-50 dark:bg-orange-500/10",
    icon: <Clock size={12} />,
  },
  EXPIRED: {
    label: "Expired",
    color:
      "text-[color:var(--color-muted-foreground)] bg-[color:var(--color-secondary)]",
    icon: <XCircle size={12} />,
  },
  TERMINATED: {
    label: "Terminated",
    color: "text-red-500 bg-red-50 dark:bg-red-500/10",
    icon: <XCircle size={12} />,
  },
};

const StatCard: React.FC<{
  label: string;
  value: string | number;
  sub?: string;
  icon: React.ReactNode;
  accent: string;
  onClick?: () => void;
}> = ({ label, value, sub, icon, accent, onClick }) => (
  <div
    onClick={onClick}
    className={`bg-[color:var(--color-surface)] border border-[color:var(--color-border)] rounded-lg p-5 flex items-start gap-4 ${onClick ? "cursor-pointer hover:border-primary/40 transition-colors" : ""}`}
  >
    <div className={`p-2.5 rounded-xl flex-shrink-0 ${accent}`}>{icon}</div>
    <div>
      <p className="text-2xl font-black text-[color:var(--color-foreground)]">
        {value}
      </p>
      <p className="text-xs font-semibold text-[color:var(--color-muted-foreground)] mt-0.5">
        {label}
      </p>
      {sub && (
        <p className="text-[11px] text-[color:var(--color-muted-foreground)] mt-0.5">
          {sub}
        </p>
      )}
    </div>
  </div>
);

/* ── main ─────────────────────────────────────────────────────── */
const TenantDashboard: React.FC = () => {
  const navigate = useNavigate();
  const user = useAppSelector((s: RootState) => s.auth.user);

  const [agreements, setAgreements] = useState<Agreement[]>([]);
  const [wishlistCount, setWishlistCount] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [agRes, wlRes] = await Promise.all([
          getMyAgreements(),
          axiosApi.get(API_ROUTES.WISHLIST),
        ]);
        setAgreements(agRes);
        const wlItems: PropertyData[] = wlRes.data?.data?.properties ?? wlRes.data?.data ?? [];
        setWishlistCount(Array.isArray(wlItems) ? wlItems.length : 0);
      } catch {
        // best-effort
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const activeAgreement = agreements.find((a) => a.status === "ACTIVE");
  const pendingAgreements = agreements.filter((a) =>
    a.status.startsWith("PENDING"),
  );
  const allAgreements = agreements.length;

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* ── Welcome banner ─────────────────────────────────── */}
      <div className="relative rounded-xl overflow-hidden bg-gradient-to-br from-violet-500/10 via-primary/5 to-transparent border border-[color:var(--color-border)] p-7">
        <div className="absolute inset-0 opacity-[0.03] [background-image:linear-gradient(var(--color-foreground)_1px,transparent_1px),linear-gradient(90deg,var(--color-foreground)_1px,transparent_1px)] [background-size:28px_28px]" />
        <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-primary mb-1">
              Tenant Dashboard
            </p>
            <h1 className="text-2xl font-black text-[color:var(--color-foreground)]">
              Hey {user?.fullname?.split(" ")[0] ?? "there"} 👋
            </h1>
            <p className="text-sm text-[color:var(--color-muted-foreground)] mt-1">
              {activeAgreement
                ? "You have an active lease. Everything's looking good."
                : "Find your perfect home and manage your rentals here."}
            </p>
          </div>
          <button
            onClick={() => navigate(PAGE_ROUTES.SEARCH_PROPERTIES)}
            className="flex items-center gap-2 px-5 py-3 bg-primary text-white rounded-xl text-sm font-semibold shadow-lg shadow-primary/20 hover:opacity-90 active:scale-95 transition-all flex-shrink-0"
          >
            <Search size={16} />
            Browse Properties
          </button>
        </div>
      </div>

      {/* ── Active lease card ──────────────────────────────── */}
      {!loading && activeAgreement && (
        <div className="bg-[color:var(--color-surface)] border border-emerald-200 dark:border-emerald-500/20 rounded-lg p-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10">
                  <CheckCircle2 size={11} />
                  Active Lease
                </span>
              </div>
              <p className="text-xs text-[color:var(--color-muted-foreground)] font-medium">
                Agreement #{activeAgreement.agreementNumber}
              </p>
              <p className="text-xl font-black text-[color:var(--color-foreground)] mt-1">
                {fmt(activeAgreement.monthlyRent)}
                <span className="text-sm font-medium text-[color:var(--color-muted-foreground)]">
                  /month
                </span>
              </p>
              <p className="text-xs text-[color:var(--color-muted-foreground)] mt-1">
                {format(new Date(activeAgreement.startDate), "dd MMM yyyy")} →{" "}
                {format(new Date(activeAgreement.endDate), "dd MMM yyyy")}
              </p>
            </div>
            <button
              onClick={() => navigate(PAGE_ROUTES.TENANT_AGREEMENTS)}
              className="flex items-center gap-1.5 text-xs text-primary font-semibold px-3 py-2 bg-primary/10 rounded-xl hover:bg-primary/20 transition-colors flex-shrink-0"
            >
              View <ArrowRight size={12} />
            </button>
          </div>
        </div>
      )}

      {/* ── Stats ──────────────────────────────────────────── */}
      {loading ? (
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="h-24 bg-[color:var(--color-surface)] border border-[color:var(--color-border)] rounded-lg animate-pulse"
            />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          <StatCard
            label="Total Agreements"
            value={allAgreements}
            sub={pendingAgreements.length ? `${pendingAgreements.length} need action` : "All clear"}
            icon={<FileText size={18} className="text-blue-500" />}
            accent="bg-blue-50 dark:bg-blue-500/10"
            onClick={() => navigate(PAGE_ROUTES.TENANT_AGREEMENTS)}
          />
          <StatCard
            label="Saved Properties"
            value={wishlistCount}
            sub="In your wishlist"
            icon={<Heart size={18} className="text-rose-500" />}
            accent="bg-rose-50 dark:bg-rose-500/10"
            onClick={() => navigate(PAGE_ROUTES.TENANT_WISHLIST)}
          />
          <StatCard
            label="Active Lease"
            value={activeAgreement ? "Yes" : "None"}
            sub={
              activeAgreement
                ? fmt(activeAgreement.monthlyRent) + "/mo"
                : "Browse to find one"
            }
            icon={<Home size={18} className="text-emerald-500" />}
            accent="bg-emerald-50 dark:bg-emerald-500/10"
          />
        </div>
      )}

      {/* ── Agreements list ────────────────────────────────── */}
      <div className="bg-[color:var(--color-surface)] border border-[color:var(--color-border)] rounded-lg overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-[color:var(--color-border)]">
          <h2 className="font-bold text-sm text-[color:var(--color-foreground)]">
            Your Agreements
          </h2>
          <button
            onClick={() => navigate(PAGE_ROUTES.TENANT_AGREEMENTS)}
            className="flex items-center gap-1 text-xs text-primary hover:underline"
          >
            View all <ArrowRight size={12} />
          </button>
        </div>

        {loading ? (
          <div className="divide-y divide-[color:var(--color-border)]">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="p-4 space-y-2 animate-pulse">
                <div className="h-3 bg-[color:var(--color-border)] rounded w-1/3" />
                <div className="h-3 bg-[color:var(--color-border)] rounded w-2/3" />
              </div>
            ))}
          </div>
        ) : agreements.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3 text-center px-4">
            <FileText
              size={32}
              className="text-[color:var(--color-muted-foreground)] opacity-40"
            />
            <p className="text-sm text-[color:var(--color-muted-foreground)]">
              No agreements yet.{" "}
              <button
                onClick={() => navigate(PAGE_ROUTES.SEARCH_PROPERTIES)}
                className="text-primary font-medium hover:underline"
              >
                Find a property
              </button>
            </p>
          </div>
        ) : (
          <div className="divide-y divide-[color:var(--color-border)]">
            {agreements.slice(0, 5).map((a) => {
              const meta =
                agreementStatusMeta[a.status] ?? agreementStatusMeta["ACTIVE"];
              return (
                <div
                  key={a.id}
                  onClick={() => navigate(PAGE_ROUTES.TENANT_AGREEMENTS)}
                  className="flex items-center gap-4 px-5 py-4 hover:bg-[color:var(--color-secondary)] cursor-pointer transition-colors"
                >
                  <div className="w-9 h-9 rounded-xl bg-[color:var(--color-secondary)] flex items-center justify-center flex-shrink-0">
                    <FileText size={16} className="text-[color:var(--color-muted-foreground)]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-[color:var(--color-foreground)]">
                      Agreement #{a.agreementNumber}
                    </p>
                    <p className="text-xs text-[color:var(--color-muted-foreground)]">
                      {fmt(a.monthlyRent)}/mo · Deposit {fmt(a.depositAmount)}
                    </p>
                  </div>
                  <span
                    className={`flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full flex-shrink-0 ${meta.color}`}
                  >
                    {meta.icon}
                    {meta.label}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ── Quick actions ──────────────────────────────────── */}
      <div className="grid grid-cols-2 gap-4">
        <button
          onClick={() => navigate(PAGE_ROUTES.SEARCH_PROPERTIES)}
          className="flex items-center gap-3 p-5 bg-[color:var(--color-surface)] border border-[color:var(--color-border)] rounded-lg hover:border-primary/40 transition-colors text-left"
        >
          <div className="p-2.5 bg-primary/10 rounded-xl flex-shrink-0">
            <Search size={18} className="text-primary" />
          </div>
          <div>
            <p className="text-sm font-semibold text-[color:var(--color-foreground)]">
              Find a Property
            </p>
            <p className="text-xs text-[color:var(--color-muted-foreground)]">
              Browse available listings
            </p>
          </div>
        </button>
        <button
          onClick={() => navigate(PAGE_ROUTES.TENANT_WISHLIST)}
          className="flex items-center gap-3 p-5 bg-[color:var(--color-surface)] border border-[color:var(--color-border)] rounded-lg hover:border-primary/40 transition-colors text-left"
        >
          <div className="p-2.5 bg-rose-50 dark:bg-rose-500/10 rounded-xl flex-shrink-0">
            <Heart size={18} className="text-rose-500" />
          </div>
          <div>
            <p className="text-sm font-semibold text-[color:var(--color-foreground)]">
              Wishlist
            </p>
            <p className="text-xs text-[color:var(--color-muted-foreground)]">
              {wishlistCount} saved properties
            </p>
          </div>
        </button>
      </div>
    </div>
  );
};

export default TenantDashboard;
