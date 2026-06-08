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
        return { bg: "bg-amber-50 dark:bg-amber-500/10", text: "text-amber-600", border: "border-amber-200 dark:border-amber-500/20", label: "Pending Approval" };
      case "ACTIVE":
        return { bg: "bg-emerald-50 dark:bg-emerald-500/10", text: "text-emerald-600", border: "border-emerald-200 dark:border-emerald-500/20", label: "Active" };
      case "REJECTED":
        return { bg: "bg-red-50 dark:bg-red-500/10", text: "text-red-600", border: "border-red-200 dark:border-red-500/20", label: "Rejected" };
      default:
        return { bg: "bg-gray-50 dark:bg-white/10", text: "text-gray-600", border: "border-gray-200 dark:border-white/20", label: status };
    }
  };

  const statusStyle = getStatusStyle(property.status);

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate(PAGE_ROUTES.ADMIN_PROPERTIES)}
          className="p-2 rounded-xl border border-[color:var(--color-border)] hover:bg-[color:var(--color-secondary)] transition-colors"
        >
          <ArrowLeft size={18} />
        </button>
        <div>
          <div className="flex items-center gap-3 mb-1">
            <span className={`px-3 py-1 rounded-lg text-xs font-semibold border ${statusStyle.bg} ${statusStyle.text} ${statusStyle.border}`}>
              {statusStyle.label}
            </span>
            <span className="text-xs text-[color:var(--color-muted-foreground)] flex items-center gap-1">
              <History size={12} />
              {new Date(property.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
            </span>
          </div>
          <h1 className="text-2xl font-bold text-[color:var(--color-foreground)]">
            {property.title}
          </h1>
        </div>
      </div>
    </div>
  );
};
