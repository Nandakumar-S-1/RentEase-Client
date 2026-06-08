import React from "react";
import {
  Wrench,
  Phone,
  Star,
  Edit2,
  CheckCircle2,
  XCircle,
  Trash2,
} from "lucide-react";

interface ServiceProvider {
  id: string;
  providerName: string;
  providerType: string;
  phone: string;
  typicalChargesMin?: number;
  typicalChargesMax?: number;
  rating?: number;
  isActive: boolean;
}

interface ServiceProviderCardProps {
  provider: ServiceProvider;
  startEdit: (provider: ServiceProvider) => void;
  confirmToggleStatus: (id: string, nextStatus: boolean) => void;
  confirmDelete: (id: string) => void;
}

export const ServiceProviderCard: React.FC<ServiceProviderCardProps> = ({
  provider,
  startEdit,
  confirmToggleStatus,
  confirmDelete,
}) => {
  return (
    <div className="bg-white dark:bg-card border border-[color:var(--color-border)] rounded-xl p-6 hover:shadow-xl transition-all group overflow-hidden relative">
      <div className="flex justify-between items-start mb-6">
        <div className="w-12 h-12 bg-primary/10 text-primary rounded-lg flex items-center justify-center mb-4">
          <Wrench size={24} />
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => startEdit(provider)}
            className="p-2 text-primary bg-primary/5 hover:bg-primary/10 rounded-xl transition-all"
            title="Edit"
          >
            <Edit2 size={18} />
          </button>
          <button
            onClick={() => confirmToggleStatus(provider.id, !provider.isActive)}
            className={`p-2 rounded-xl transition-all ${
              provider.isActive
                ? "text-green-500 bg-green-50 hover:bg-green-100"
                : "text-gray-400 bg-gray-50 hover:bg-gray-100"
            }`}
            title={provider.isActive ? "Deactivate" : "Activate"}
          >
            {provider.isActive ? (
              <CheckCircle2 size={18} />
            ) : (
              <XCircle size={18} />
            )}
          </button>
          <button
            onClick={() => confirmDelete(provider.id)}
            className="p-2 text-red-500 bg-red-50 hover:bg-red-100 rounded-xl transition-all"
            title="Remove"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <h4 className="text-lg font-black text-gray-800 dark:text-white group-hover:text-primary transition-colors">
            {provider.providerName}
          </h4>
          <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 bg-gray-100 dark:bg-white/5 px-2 py-0.5 rounded-md inline-block mt-1">
            {provider.providerType}
          </span>
        </div>

        <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-white/5 p-3 rounded-lg">
          <div className="w-8 h-8 bg-white dark:bg-card rounded-xl flex items-center justify-center shadow-sm">
            <Phone size={14} className="text-primary" />
          </div>
          <span className="text-sm font-black">{provider.phone}</span>
        </div>

        <div className="flex justify-between items-center pt-2">
          <div className="flex flex-col">
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
              Typical Charges
            </span>
            <span className="text-sm font-black text-gray-800 dark:text-white">
              ₹{provider.typicalChargesMin} - ₹{provider.typicalChargesMax}
            </span>
          </div>
          <div className="flex items-center gap-1 bg-yellow-50 text-yellow-600 px-3 py-1.5 rounded-xl">
            <Star size={14} fill="currentColor" />
            <span className="text-sm font-black">
              {provider.rating || "N/A"}
            </span>
          </div>
        </div>
      </div>

      <div
        className={`absolute top-0 right-0 w-2 h-full ${
          provider.isActive ? "bg-green-500/10" : "bg-gray-200/10"
        }`}
      />
    </div>
  );
};
