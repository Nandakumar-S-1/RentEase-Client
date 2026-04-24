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
} from "lucide-react";
import { useAdminProperties } from "../hooks/useAdminProperties";
import { PAGE_ROUTES } from "../../../config/routes";
import { LoadingOverlay } from "../../../components/common";

const AdminProperties = () => {
  const navigate = useNavigate();
  const { properties, loading, error, pagination, fetchProperties } = useAdminProperties();

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
      <div className="bg-[color:var(--color-surface)] border border-[color:var(--color-border)] rounded-[2.5rem] p-10 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-6">
          <div className="space-y-1">
            <h1 className="text-4xl font-black text-[color:var(--color-foreground)] tracking-tight flex items-center gap-4">
              Property Inventory
              <Building2 className="text-primary/40" size={32} />
            </h1>
            <p className="text-gray-500 dark:text-gray-400 font-medium tracking-wide">
              Monitor and manage all listed properties across the platform.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3 bg-[color:var(--color-bg)] p-2 rounded-[1.5rem] border border-[color:var(--color-border)]">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => fetchProperties(1, tab.id)}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl transition-all duration-300 font-bold text-sm ${
                  pagination.status === tab.id
                    ? "bg-primary text-white shadow-lg shadow-primary/20 translate-y-[-2px]"
                    : "text-gray-500 hover:bg-white dark:hover:bg-white/5"
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
        <div className="p-4 bg-red-50 text-red-600 rounded-2xl border border-red-100 font-medium text-sm">
          {error}
        </div>
      )}

      {!loading && properties.length === 0 ? (
        <div className="bg-white dark:bg-card border border-gray-100 rounded-3xl p-12 text-center">
          <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 size={32} className="text-gray-300" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-1">No properties found</h3>
          <p className="text-gray-500">No properties are currently in {pagination.status.toLowerCase().replace('_', ' ')} status.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map((property) => (
              <div
                key={property.id}
                onClick={() => navigate(PAGE_ROUTES.ADMIN_PROPERTY_DETAIL.replace(":id", property.id))}
                className="bg-white dark:bg-card border border-gray-100 rounded-3xl overflow-hidden hover:shadow-xl transition-all cursor-pointer group"
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={property.photos[property.primaryPhotoIndex] || "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=800&q=80"}
                    alt={property.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4">
                    <span className={`px-3 py-1 text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg ${
                      property.status === 'ACTIVE' ? 'bg-green-500 text-white' :
                      property.status === 'REJECTED' ? 'bg-red-500 text-white' :
                      'bg-yellow-500 text-white'
                    }`}>
                      {property.status === 'ACTIVE' ? 'Approved' : 
                       property.status === 'REJECTED' ? 'Rejected' : 'Pending'}
                    </span>
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 truncate">
                    {property.title}
                  </h3>

                  <div className="flex items-center gap-1.5 text-gray-500 text-sm mb-4">
                    <MapPin size={14} />
                    <span className="truncate">{property.locationCity}, {property.locationDistrict}</span>
                  </div>

                  <div className="flex items-center gap-4 text-xs font-bold text-gray-400 uppercase tracking-wider mb-6">
                    <span className="flex items-center gap-1"><Home size={14} /> {property.propertyType}</span>
                    <span className="flex items-center gap-1"><Maximize2 size={14} /> {property.areaSqft} sqft</span>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                    <span className="text-lg font-bold text-primary">₹{property.monthlyRent.toLocaleString()}</span>
                    <div className="flex items-center gap-1 text-primary text-xs font-black uppercase tracking-widest">
                      Review Details <ChevronRight size={14} />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>


          {pagination.total > 0 && (
            <div className="flex items-center justify-between border-t border-[color:var(--color-border)] pt-8 mt-8">
              <p className="text-sm text-gray-500 font-medium font-lg">
                Showing{" "}
                <span className="text-[color:var(--color-foreground)] font-bold">
                  {(pagination.page - 1) * pagination.limit + 1}
                </span>{" "}
                to{" "}
                <span className="text-[color:var(--color-foreground)] font-bold">
                  {Math.min(pagination.page * pagination.limit, pagination.total)}
                </span>{" "}
                of{" "}
                <span className="text-[color:var(--color-foreground)] font-bold">
                  {pagination.total}
                </span>{" "}
                properties
              </p>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => fetchProperties(Math.max(1, pagination.page - 1), pagination.status)}
                  disabled={pagination.page === 1}
                  className="p-3 bg-white dark:bg-card border border-[color:var(--color-border)] rounded-xl hover:bg-gray-50 dark:hover:bg-white/5 disabled:opacity-30 transition-all shadow-sm"
                >
                  <ChevronLeft size={20} />
                </button>

                {[...Array(pagination.pages)].map((_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => fetchProperties(i + 1, pagination.status)}
                    className={`w-12 h-12 rounded-xl font-bold transition-all ${pagination.page === i + 1
                        ? "bg-primary text-white shadow-lg shadow-primary/20 scale-105"
                        : "bg-white dark:bg-card border border-[color:var(--color-border)] hover:bg-gray-50 dark:hover:bg-white/5 text-gray-500"
                      }`}
                  >
                    {i + 1}
                  </button>
                ))}

                <button
                  onClick={() => fetchProperties(Math.min(pagination.pages, pagination.page + 1), pagination.status)}
                  disabled={pagination.page === pagination.pages}
                  className="p-3 bg-white dark:bg-card border border-[color:var(--color-border)] rounded-xl hover:bg-gray-50 dark:hover:bg-white/5 disabled:opacity-30 transition-all shadow-sm"
                >
                  <ChevronRight size={20} />
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
