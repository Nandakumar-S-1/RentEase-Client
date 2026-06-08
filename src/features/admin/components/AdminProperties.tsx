import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Home,
  Clock,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  MapPin,
  Maximize2,
  Building2,
  ArrowRight,
} from "lucide-react";
import { useAdminProperties } from "../hooks/useAdminProperties";
import { PAGE_ROUTES } from "../../../config/routes";
import { LoadingOverlay } from "../../../components/common";

const AdminProperties = () => {
  const navigate = useNavigate();
  const { properties, loading, error, pagination, fetchProperties } =
    useAdminProperties();

  useEffect(() => {
    fetchProperties(pagination.page, pagination.status);
  }, [pagination.page, pagination.status, fetchProperties]);

  const tabs = [
    { id: "PENDING_APPROVAL", label: "Pending", icon: Clock },
    { id: "ACTIVE", label: "Approved", icon: CheckCircle2 },
    { id: "REJECTED", label: "Rejected", icon: Building2 },
  ];

  if (loading && !properties.length) return <LoadingOverlay />;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="bg-[color:var(--color-surface)] border border-[color:var(--color-border)] rounded-xl p-6 lg:p-10 shadow-2xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
            <h1 className="text-4xl font-black text-[color:var(--color-foreground)] tracking-tight flex items-center gap-4">
              Property Inventory
              <Building2 className="text-primary/40" size={32} />
            </h1>
            <p className="text-gray-500 dark:text-gray-400 font-medium tracking-wide">
              Monitor and manage all listed properties across the platform.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2 bg-gray-100/50 dark:bg-white/5 p-2 rounded-xl border border-[color:var(--color-border)]">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => fetchProperties(1, tab.id)}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl transition-all duration-300 font-black text-sm ${
                  pagination.status === tab.id
                    ? "bg-primary text-white shadow-xl shadow-primary/20 translate-y-[-2px]"
                    : "text-gray-500 hover:text-gray-900 dark:hover:text-white"
                }`}
              >
                <tab.icon size={18} />
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {error && (
        <div className="p-5 bg-red-500/10 text-red-600 rounded-xl border border-red-500/20 font-bold text-sm flex items-center gap-3">
          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
          {error}
        </div>
      )}

      {!loading && properties.length === 0 ? (
        <div className="bg-[color:var(--color-surface)] border border-[color:var(--color-border)] rounded-xl p-24 text-center shadow-xl">
          <div className="w-24 h-24 bg-gray-50 dark:bg-white/5 rounded-xl flex items-center justify-center mx-auto mb-6 border border-[color:var(--color-border)]">
            <CheckCircle2 size={48} className="text-gray-200" />
          </div>
          <h3 className="text-2xl font-black text-[color:var(--color-foreground)] mb-2">
            Inventory is clean
          </h3>
          <p className="text-gray-500 font-medium">
            No properties are currently in{" "}
            {pagination.status.toLowerCase().replace("_", " ")} status.
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {properties.map((property) => (
              <div
                key={property.id}
                onClick={() =>
                  navigate(
                    PAGE_ROUTES.ADMIN_PROPERTY_DETAIL.replace(
                      ":id",
                      property.id,
                    ),
                  )
                }
                className="bg-[color:var(--color-surface)] border border-[color:var(--color-border)] rounded-xl overflow-hidden hover:shadow-2xl hover:border-primary/30 transition-all duration-500 cursor-pointer group shadow-lg"
              >
                <div className="relative h-60 overflow-hidden">
                  <img
                    src={
                      property.photos[property.primaryPhotoIndex] ||
                      "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=800&q=80"
                    }
                    alt={property.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute top-5 left-5">
                    <span
                      className={`px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] rounded-xl shadow-2xl backdrop-blur-md border ${
                        property.status === "ACTIVE"
                          ? "bg-green-500/90 text-white border-green-400"
                          : property.status === "REJECTED"
                            ? "bg-red-500/90 text-white border-red-400"
                            : "bg-amber-500/90 text-white border-amber-400"
                      }`}
                    >
                      {property.status === "ACTIVE"
                        ? "Approved"
                        : property.status === "REJECTED"
                          ? "Rejected"
                          : "Pending Review"}
                    </span>
                  </div>
                </div>

                <div className="p-8">
                  <h3 className="text-xl font-black text-[color:var(--color-foreground)] mb-3 truncate group-hover:text-primary transition-colors">
                    {property.title}
                  </h3>

                  <div className="flex items-center gap-2 text-gray-500 text-sm mb-6 bg-gray-50/50 dark:bg-white/5 w-fit px-3 py-1.5 rounded-xl border border-[color:var(--color-border)]">
                    <MapPin size={16} className="text-primary" />
                    <span className="truncate font-bold">
                      {property.locationCity}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-8">
                    <div className="flex items-center gap-2 text-xs font-black text-gray-400 uppercase tracking-widest">
                      <Home size={16} className="text-primary/60" />
                      {property.propertyType}
                    </div>
                    <div className="flex items-center gap-2 text-xs font-black text-gray-400 uppercase tracking-widest">
                      <Maximize2 size={16} className="text-primary/60" />
                      {property.areaSqft} SQFT
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-6 border-t border-[color:var(--color-border)]">
                    <div>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">
                        Monthly Rent
                      </p>
                      <span className="text-2xl font-black text-primary">
                        ₹{property.monthlyRent.toLocaleString()}
                      </span>
                    </div>
                    <div className="w-12 h-12 bg-primary/5 text-primary rounded-lg flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all shadow-sm">
                      <ArrowRight size={20} />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {pagination.total > 0 && (
            <div className="flex flex-col sm:flex-row items-center justify-between border-t border-[color:var(--color-border)] pt-10 mt-10 gap-6">
              <p className="text-sm text-gray-500 font-bold">
                Showing{" "}
                <span className="text-[color:var(--color-foreground)]">
                  {(pagination.page - 1) * pagination.limit + 1}
                </span>{" "}
                to{" "}
                <span className="text-[color:var(--color-foreground)]">
                  {Math.min(
                    pagination.page * pagination.limit,
                    pagination.total,
                  )}
                </span>{" "}
                of{" "}
                <span className="text-[color:var(--color-foreground)]">
                  {pagination.total}
                </span>{" "}
                properties
              </p>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    fetchProperties(
                      Math.max(1, pagination.page - 1),
                      pagination.status,
                    );
                    window.scrollTo(0, 0);
                  }}
                  disabled={pagination.page === 1}
                  className="w-12 h-12 flex items-center justify-center bg-[color:var(--color-surface)] border border-[color:var(--color-border)] rounded-lg hover:bg-primary/5 hover:border-primary/30 disabled:opacity-20 transition-all text-gray-400 hover:text-primary shadow-sm"
                >
                  <ChevronLeft size={24} />
                </button>

                <div className="flex gap-2">
                  {[...Array(pagination.pages)].map((_, i) => (
                    <button
                      key={i + 1}
                      onClick={() => {
                        fetchProperties(i + 1, pagination.status);
                        window.scrollTo(0, 0);
                      }}
                      className={`w-12 h-12 rounded-lg font-black transition-all shadow-sm ${
                        pagination.page === i + 1
                          ? "bg-primary text-white shadow-xl shadow-primary/25 scale-110"
                          : "bg-[color:var(--color-surface)] border border-[color:var(--color-border)] hover:bg-gray-100 dark:hover:bg-white/5 text-gray-400"
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => {
                    fetchProperties(
                      Math.min(pagination.pages, pagination.page + 1),
                      pagination.status,
                    );
                    window.scrollTo(0, 0);
                  }}
                  disabled={pagination.page === pagination.pages}
                  className="w-12 h-12 flex items-center justify-center bg-[color:var(--color-surface)] border border-[color:var(--color-border)] rounded-lg hover:bg-primary/5 hover:border-primary/30 disabled:opacity-20 transition-all text-gray-400 hover:text-primary shadow-sm"
                >
                  <ChevronRight size={24} />
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AdminProperties;
