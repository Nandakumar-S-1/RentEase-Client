import React from "react";
import { FileText, Clock, CheckCircle } from "lucide-react";
import type { Agreement } from "../services/agreementService";

interface AgreementStatsProps {
  agreements: Agreement[];
}

export const AgreementStats: React.FC<AgreementStatsProps> = ({ agreements }) => {
  const pendingCount = agreements.filter((a) => a.status !== "ACTIVE").length;
  const activeCount = agreements.filter((a) => a.status === "ACTIVE").length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-white dark:bg-card border border-gray-100 dark:border-white/5 p-8 rounded-xl shadow-sm relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl" />
        <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center text-primary mb-6">
          <FileText size={24} />
        </div>
        <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">
          Total Contracts
        </p>
        <p className="text-4xl font-black text-gray-900 dark:text-white">
          {agreements.length}
        </p>
      </div>

      <div className="bg-white dark:bg-card border border-gray-100 dark:border-white/5 p-8 rounded-xl shadow-sm relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-3xl" />
        <div className="w-12 h-12 bg-amber-500/10 rounded-lg flex items-center justify-center text-amber-500 mb-6">
          <Clock size={24} />
        </div>
        <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">
          Pending Actions
        </p>
        <p className="text-4xl font-black text-gray-900 dark:text-white">
          {pendingCount}
        </p>
      </div>

      <div className="bg-white dark:bg-card border border-gray-100 dark:border-white/5 p-8 rounded-xl shadow-sm relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-3xl" />
        <div className="w-12 h-12 bg-emerald-500/10 rounded-lg flex items-center justify-center text-emerald-500 mb-6">
          <CheckCircle size={24} />
        </div>
        <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">
          Activated Leases
        </p>
        <p className="text-4xl font-black text-gray-900 dark:text-white">
          {activeCount}
        </p>
      </div>
    </div>
  );
};
