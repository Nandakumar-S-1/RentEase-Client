import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Home,
  FileText,
  PlusCircle,
  ArrowRight,
  CheckCircle2,
  Clock,
  XCircle,
  Eye,
  AlertCircle,
} from "lucide-react";
import { useAppSelector } from "../../hooks/useAppSelector";
import type { RootState } from "../../app/store/store";
import { getOwnerProperties } from "../../features/property/services/propertyService";
import { getMyAgreements } from "../../features/agreements/services/agreementService";
import type { PropertyData } from "../../features/property/types/propertyTypes";
import type { Agreement } from "../../features/agreements/services/agreementService";
import { PAGE_ROUTES } from "../../config/routes";

/* ── tiny helpers ─────────────────────────────────────────────── */
const fmt = (n: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n);

const statusMeta: Record<
  string,
  { label: string; color: string; icon: React.ReactNode }
> = {
  ACTIVE: {
    label: "Active",
    color: "text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10",
    icon: <CheckCircle2 size={12} />,
  },
  PENDING: {
    label: "Pending",
    color: "text-amber-600 bg-amber-50 dark:bg-amber-500/10",
    icon: <Clock size={12} />,
  },
  REJECTED: {
    label: "Rejected",
    color: "text-red-500 bg-red-50 dark:bg-red-500/10",
    icon: <XCircle size={12} />,
  },
  UNLISTED: {
    label: "Unlisted",
    color:
      "text-[color:var(--color-muted-foreground)] bg-[color:var(--color-secondary)]",
    icon: <Eye size={12} />,
  },
};

const agreementStatusMeta: Record<
  string,
  { label: string; color: string }
> = {
  ACTIVE: {
    label: "Active",
    color: "text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10",
  },
  PENDING_OWNER_SIGNATURE: {
    label: "Awaiting your signature",
    color: "text-amber-600 bg-amber-50 dark:bg-amber-500/10",
  },
  PENDING_TENANT_SIGNATURE: {
    label: "Awaiting tenant",
    color: "text-blue-600 bg-blue-50 dark:bg-blue-500/10",
  },
  PENDING_KYC: {
    label: "KYC pending",
    color: "text-orange-600 bg-orange-50 dark:bg-orange-500/10",
  },
  EXPIRED: {
    label: "Expired",
    color:
      "text-[color:var(--color-muted-foreground)] bg-[color:var(--color-secondary)]",
  },
  TERMINATED: {
    label: "Terminated",
    color: "text-red-500 bg-red-50 dark:bg-red-500/10",
  },
};

/* ── stat card ────────────────────────────────────────────────── */
const StatCard: React.FC<{
  label: string;
  value: string | number;
  sub?: string;
  icon: React.ReactNode;
  accent: string;
}> = ({ label, value, sub, icon, accent }) => (
  <div className="bg-[color:var(--color-surface)] border border-[color:var(--color-border)] rounded-lg p-5 flex items-start gap-4">
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

/* ── main component ───────────────────────────────────────────── */
const OwnerDashboard: React.FC = () => {
  const navigate = useNavigate();
  const user = useAppSelector((s: RootState) => s.auth.user);

  const [properties, setProperties] = useState<PropertyData[]>([]);
  const [agreements, setAgreements] = useState<Agreement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [propRes, agRes] = await Promise.all([
          getOwnerProperties({ page: 1, limit: 50 }),
          getMyAgreements(),
        ]);
        setProperties(propRes.data.properties);
        setAgreements(agRes);
      } catch {
        // silently fail — dashboard is best-effort
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const activeProps = properties.filter((p) => p.status === "ACTIVE").length;
  const pendingProps = properties.filter((p) => p.status === "PENDING").length;
  const activeAgreements = agreements.filter(
    (a) => a.status === "ACTIVE",
  ).length;
  const pendingAgreements = agreements.filter((a) =>
    a.status.startsWith("PENDING"),
  ).length;
  const monthlyIncome = agreements
    .filter((a) => a.status === "ACTIVE")
    .reduce((sum, a) => sum + a.monthlyRent, 0);

  const recentProperties = properties.slice(0, 4);
  const recentAgreements = agreements.slice(0, 3);

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* ── Welcome banner ─────────────────────────────────── */}
      <div className="relative rounded-xl overflow-hidden bg-gradient-to-br from-primary/15 via-primary/5 to-transparent border border-[color:var(--color-border)] p-7">
        <div className="absolute inset-0 opacity-[0.03] [background-image:linear-gradient(var(--color-foreground)_1px,transparent_1px),linear-gradient(90deg,var(--color-foreground)_1px,transparent_1px)] [background-size:28px_28px]" />
        <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-primary mb-1">
              Owner Dashboard
            </p>
            <h1 className="text-2xl font-black text-[color:var(--color-foreground)]">
              Welcome back, {user?.fullname?.split(" ")[0] ?? "there"} 👋
            </h1>
            <p className="text-sm text-[color:var(--color-muted-foreground)] mt-1">
              Here's a snapshot of your portfolio today.
            </p>
          </div>
          <button
            onClick={() => navigate(PAGE_ROUTES.OWNER_ADD_PROPERTY)}
            className="flex items-center gap-2 px-5 py-3 bg-primary text-white rounded-xl text-sm font-semibold shadow-lg shadow-primary/20 hover:opacity-90 active:scale-95 transition-all flex-shrink-0"
          >
            <PlusCircle size={16} />
            Add Property
          </button>
        </div>
      </div>

      {/* ── Stats grid ─────────────────────────────────────── */}
      {loading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="h-24 bg-[color:var(--color-surface)] border border-[color:var(--color-border)] rounded-lg animate-pulse"
            />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            label="Total Properties"
            value={properties.length}
            sub={`${activeProps} active · ${pendingProps} pending`}
            icon={<Home size={18} className="text-primary" />}
            accent="bg-primary/10"
          />
          <StatCard
            label="Active Agreements"
            value={activeAgreements}
            sub={pendingAgreements ? `${pendingAgreements} awaiting action` : "All clear"}
            icon={<FileText size={18} className="text-blue-500" />}
            accent="bg-blue-50 dark:bg-blue-500/10"
          />
          <StatCard
            label="Monthly Income"
            value={fmt(monthlyIncome)}
            sub="From active leases"
            icon={
              <span className="text-emerald-600 font-black text-base">₹</span>
            }
            accent="bg-emerald-50 dark:bg-emerald-500/10"
          />
          <StatCard
            label="Pending Reviews"
            value={pendingProps + pendingAgreements}
            sub="Properties & agreements"
            icon={<AlertCircle size={18} className="text-amber-500" />}
            accent="bg-amber-50 dark:bg-amber-500/10"
          />
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* ── Recent properties ──────────────────────────── */}
        <div className="lg:col-span-3 bg-[color:var(--color-surface)] border border-[color:var(--color-border)] rounded-lg overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-[color:var(--color-border)]">
            <h2 className="font-bold text-sm text-[color:var(--color-foreground)]">
              Properties
            </h2>
            <button
              onClick={() => navigate(PAGE_ROUTES.OWNER_PROPERTIES)}
              className="flex items-center gap-1 text-xs text-primary hover:underline"
            >
              View all <ArrowRight size={12} />
            </button>
          </div>

          {loading ? (
            <div className="divide-y divide-[color:var(--color-border)]">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex gap-3 p-4 animate-pulse">
                  <div className="w-14 h-14 rounded-xl bg-[color:var(--color-border)] flex-shrink-0" />
                  <div className="flex-1 space-y-2 pt-1">
                    <div className="h-3 bg-[color:var(--color-border)] rounded w-2/3" />
                    <div className="h-3 bg-[color:var(--color-border)] rounded w-1/3" />
                  </div>
                </div>
              ))}
            </div>
          ) : recentProperties.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 gap-3 text-center px-4">
              <Home size={32} className="text-[color:var(--color-muted-foreground)] opacity-40" />
              <p className="text-sm text-[color:var(--color-muted-foreground)]">
                No properties yet.{" "}
                <button
                  onClick={() => navigate(PAGE_ROUTES.OWNER_ADD_PROPERTY)}
                  className="text-primary font-medium hover:underline"
                >
                  Add your first one
                </button>
              </p>
            </div>
          ) : (
            <div className="divide-y divide-[color:var(--color-border)]">
              {recentProperties.map((p) => {
                const meta =
                  statusMeta[p.status] ?? statusMeta["PENDING"];
                const photo = p.photos?.[p.primaryPhotoIndex ?? 0];
                return (
                  <div
                    key={p.id}
                    onClick={() =>
                      navigate(
                        PAGE_ROUTES.OWNER_PROPERTY_DETAIL.replace(":id", p.id),
                      )
                    }
                    className="flex items-center gap-3 px-4 py-3.5 hover:bg-[color:var(--color-secondary)] cursor-pointer transition-colors"
                  >
                    {/* thumbnail */}
                    <div className="w-14 h-14 rounded-xl bg-[color:var(--color-secondary)] overflow-hidden flex-shrink-0">
                      {photo ? (
                        <img
                          src={photo}
                          alt={p.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Home
                          size={20}
                          className="m-auto mt-3 text-[color:var(--color-muted-foreground)] opacity-30"
                        />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-[color:var(--color-foreground)] truncate">
                        {p.title}
                      </p>
                      <p className="text-xs text-[color:var(--color-muted-foreground)] truncate">
                        {p.locationCity}, {p.locationDistrict}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-1 flex-shrink-0">
                      <span
                        className={`flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full ${meta.color}`}
                      >
                        {meta.icon}
                        {meta.label}
                      </span>
                      <span className="text-xs font-bold text-[color:var(--color-foreground)]">
                        {fmt(p.monthlyRent)}/mo
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* ── Recent agreements ──────────────────────────── */}
        <div className="lg:col-span-2 bg-[color:var(--color-surface)] border border-[color:var(--color-border)] rounded-lg overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-[color:var(--color-border)]">
            <h2 className="font-bold text-sm text-[color:var(--color-foreground)]">
              Agreements
            </h2>
            <button
              onClick={() => navigate(PAGE_ROUTES.OWNER_AGREEMENTS)}
              className="flex items-center gap-1 text-xs text-primary hover:underline"
            >
              View all <ArrowRight size={12} />
            </button>
          </div>

          {loading ? (
            <div className="divide-y divide-[color:var(--color-border)]">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="p-4 space-y-2 animate-pulse">
                  <div className="h-3 bg-[color:var(--color-border)] rounded w-1/2" />
                  <div className="h-3 bg-[color:var(--color-border)] rounded w-3/4" />
                </div>
              ))}
            </div>
          ) : recentAgreements.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 gap-3 text-center px-4">
              <FileText
                size={32}
                className="text-[color:var(--color-muted-foreground)] opacity-40"
              />
              <p className="text-sm text-[color:var(--color-muted-foreground)]">
                No agreements yet
              </p>
            </div>
          ) : (
            <div className="divide-y divide-[color:var(--color-border)]">
              {recentAgreements.map((a) => {
                const meta =
                  agreementStatusMeta[a.status] ??
                  agreementStatusMeta["ACTIVE"];
                return (
                  <div
                    key={a.id}
                    className="px-5 py-4 hover:bg-[color:var(--color-secondary)] cursor-pointer transition-colors"
                    onClick={() =>
                      navigate(
                        PAGE_ROUTES.OWNER_AGREEMENTS,
                      )
                    }
                  >
                    <p className="text-xs font-bold text-[color:var(--color-muted-foreground)] mb-1">
                      #{a.agreementNumber}
                    </p>
                    <p className="text-sm font-semibold text-[color:var(--color-foreground)]">
                      {fmt(a.monthlyRent)}/mo
                    </p>
                    <span
                      className={`inline-flex items-center gap-1 mt-1.5 text-[11px] font-semibold px-2 py-0.5 rounded-full ${meta.color}`}
                    >
                      {meta.label}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OwnerDashboard;
