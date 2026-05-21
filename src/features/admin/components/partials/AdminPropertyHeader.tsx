import React from "react";
import { ArrowLeft, ExternalLink, History } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { PAGE_ROUTES } from "../../../../config/routes";

interface AdminPropertyHeaderProps {
  property: {
    id: string;
    title: string;
    status: string;
    createdAt: string | Date;
  };
}

export const AdminPropertyHeader: React.FC<AdminPropertyHeaderProps> = ({
  property,
}) => {
  const navigate = useNavigate();

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "PENDING_APPROVAL":
        return {
          bg: "bg-amber-50 dark:bg-amber-500/10",
          text: "text-amber-600",
          border: "border-amber-200 dark:border-amber-500/20",
          label: "Awaiting Verification",
        };
      case "ACTIVE":
        return {
          bg: "bg-emerald-50 dark:bg-emerald-500/10",
          text: "text-emerald-600",
          border: "border-emerald-200 dark:border-emerald-500/20",
          label: "Publicly Active",
        };
      case "REJECTED":
        return {
          bg: "bg-red-50 dark:bg-red-500/10",
          text: "text-red-600",
          border: "border-red-200 dark:border-red-500/20",
          label: "Rejected Listing",
        };
      default:
        return {
          bg: "bg-gray-50 dark:bg-white/10",
          text: "text-gray-600",
          border: "border-gray-200 dark:border-white/20",
          label: status,
        };
    }
  };

  const statusStyle = getStatusStyle(property.status);

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
      <div className="flex items-center gap-5">
        <button
          onClick={() => navigate(PAGE_ROUTES.ADMIN_PROPERTIES)}
          className="p-4 bg-white dark:bg-card border border-gray-100 dark:border-white/5 rounded-2xl text-gray-500 hover:text-primary transition-all shadow-sm group"
        >
          <ArrowLeft
            size={22}
            className="group-hover:-translate-x-1 transition-transform"
          />
        </button>
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span
              className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${statusStyle.bg} ${statusStyle.text} ${statusStyle.border}`}
            >
              {statusStyle.label}
            </span>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1">
              <History size={12} /> Last Updated:{" "}
              {new Date(property.createdAt).toLocaleDateString()}
            </span>
          </div>
          <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">
            Audit Property:{" "}
            <span className="text-gray-500 dark:text-gray-400 font-bold">
              {property.title}
            </span>
          </h1>
        </div>
      </div>

      <div className="flex items-center gap-3 bg-white dark:bg-card p-2 rounded-3xl border border-gray-100 dark:border-white/5 shadow-sm">
        <button
          className="px-6 py-3 text-xs font-black uppercase tracking-widest text-gray-400 hover:text-primary transition-colors flex items-center gap-2"
          onClick={() => window.open(`/property/${property.id}`, "_blank")}
        >
          <ExternalLink size={16} /> Preview Mode
        </button>
      </div>
    </div>
  );
};
