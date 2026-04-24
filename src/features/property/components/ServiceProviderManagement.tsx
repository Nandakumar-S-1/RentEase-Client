import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useServiceProviders } from "../hooks/useServiceProviders";
import DashboardLayout from "../../../components/common/DashboardLayout";
import { useAppSelector } from "../../../hooks/useAppSelector";
import type { RootState } from "../../../app/store/store";
import type { RoleType } from "../../../types/constants/role.constant";
import {
  Plus,
  Trash2,
  Phone,
  Wrench,
  CheckCircle2,
  XCircle,
  ChevronLeft,
  Search,
  Star
} from "lucide-react";
import { LoadingOverlay } from "../../../components/common";

const PROVIDER_TYPES = [
  "Electrician", "Plumber", "Cleaner", "Painter", "Carpenter",
  "Pest Control", "AC Service", "Gardener", "Security", "Other"
];

const ServiceProviderManagement: React.FC = () => {
  const { propertyId } = useParams<{ propertyId: string }>();
  const navigate = useNavigate();
  const { user } = useAppSelector((state: RootState) => state.auth);
  const { providers, loading, addProvider, removeProvider, toggleStatus } = useServiceProviders(propertyId || "");

  const [isAdding, setIsAdding] = useState(false);
  const [newProvider, setNewProvider] = useState({
    providerName: "",
    providerType: "Electrician",
    phone: "",
    typicalChargesMin: "",
    typicalChargesMax: "",
  });

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await addProvider({
      ...newProvider,
      typicalChargesMin: Number(newProvider.typicalChargesMin) || 0,
      typicalChargesMax: Number(newProvider.typicalChargesMax) || 0,
    });
    setIsAdding(false);
    setNewProvider({
      providerName: "",
      providerType: "Electrician",
      phone: "",
      typicalChargesMin: "",
      typicalChargesMax: "",
    });
  };

  if (loading && providers.length === 0) return <LoadingOverlay />;

  return (
    <DashboardLayout role={user?.role as RoleType} userName={user?.fullname || "Owner"}>
      <div className="max-w-5xl mx-auto space-y-8 pb-20">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-1">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-gray-500 hover:text-primary font-bold text-sm mb-2 transition-all"
            >
              <ChevronLeft size={16} /> Back to Property
            </button>
            <h1 className="text-4xl font-black text-[color:var(--color-foreground)] tracking-tight">Service Providers</h1>
            <p className="text-gray-500 font-medium tracking-wide">Manage trusted contacts for maintenance and repairs.</p>
          </div>
          <button
            onClick={() => setIsAdding(!isAdding)}
            className="flex items-center gap-2 px-8 py-3.5 bg-primary text-white font-black rounded-2xl shadow-xl shadow-primary/30 hover:scale-105 transition-all lg:w-fit"
          >
            {isAdding ? <XCircle size={20} /> : <Plus size={20} />}
            {isAdding ? "Cancel" : "Add Provider"}
          </button>
        </div>

        {/* Add Provider Form */}
        {isAdding && (
          <div className="bg-white dark:bg-card border-2 border-primary/20 rounded-[2.5rem] p-8 shadow-xl animate-in fade-in slide-in-from-top-4">
            <h3 className="text-xl font-black mb-6">New Service Provider</h3>
            <form onSubmit={handleAddSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-black text-gray-700 ml-1">Provider Name *</label>
                <input
                  required
                  value={newProvider.providerName}
                  onChange={(e) => setNewProvider({ ...newProvider, providerName: e.target.value })}
                  className="w-full px-6 py-4 bg-gray-50 dark:bg-white/5 border border-[color:var(--color-border)] rounded-2xl focus:ring-2 focus:ring-primary/20 text-sm font-medium"
                  placeholder="e.g. John Doe"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-black text-gray-700 ml-1">Service Category</label>
                <select
                  value={newProvider.providerType}
                  onChange={(e) => setNewProvider({ ...newProvider, providerType: e.target.value })}
                  className="w-full px-6 py-4 bg-gray-50 dark:bg-white/5 border border-[color:var(--color-border)] rounded-2xl text-sm font-medium"
                >
                  {PROVIDER_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-black text-gray-700 ml-1">Phone Number *</label>
                <input
                  required
                  value={newProvider.phone}
                  onChange={(e) => setNewProvider({ ...newProvider, phone: e.target.value })}
                  className="w-full px-6 py-4 bg-gray-50 dark:bg-white/5 border border-[color:var(--color-border)] rounded-2xl text-sm font-medium"
                  placeholder="e.g. +91 9876543210"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-black text-gray-700 ml-1">Min Charges (₹)</label>
                <input
                  type="number"
                  value={newProvider.typicalChargesMin}
                  onChange={(e) => setNewProvider({ ...newProvider, typicalChargesMin: e.target.value })}
                  className="w-full px-6 py-4 bg-gray-50 dark:bg-white/5 border border-[color:var(--color-border)] rounded-2xl text-sm font-medium"
                  placeholder="500"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-black text-gray-700 ml-1">Max Charges (₹)</label>
                <input
                  type="number"
                  value={newProvider.typicalChargesMax}
                  onChange={(e) => setNewProvider({ ...newProvider, typicalChargesMax: e.target.value })}
                  className="w-full px-6 py-4 bg-gray-50 dark:bg-white/5 border border-[color:var(--color-border)] rounded-2xl text-sm font-medium"
                  placeholder="2000"
                />
              </div>
              <div className="flex items-end">
                <button type="submit" className="w-full py-4 bg-primary text-white font-black rounded-2xl hover:bg-primary-dark transition-all shadow-lg shadow-primary/20">
                  Save Provider
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Providers List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading && (
            <div className="col-span-full py-20 flex items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          )}

          {!loading && (!providers || (Array.isArray(providers) && providers.length === 0)) && (
            <div className="col-span-full py-20 bg-gray-50 dark:bg-white/5 rounded-[2.5rem] border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-center px-6">
              <div className="w-16 h-16 bg-white dark:bg-card rounded-2xl shadow-sm flex items-center justify-center mb-4 text-gray-300">
                <Search size={32} />
              </div>
              <h3 className="text-xl font-black text-gray-800 dark:text-white mb-2">No Service Providers Linked</h3>
              <p className="text-gray-500 font-medium max-w-sm">Add local electricians, plumbers, or cleaners to make property maintenance easier for you and your tenants.</p>
            </div>
          )}

          {Array.isArray(providers) && providers.map((p) => (
            <div key={p.id} className="bg-white dark:bg-card border border-[color:var(--color-border)] rounded-[2.5rem] p-6 hover:shadow-xl transition-all group overflow-hidden relative">
              <div className="flex justify-between items-start mb-6">
                <div className="w-12 h-12 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mb-4">
                  <Wrench size={24} />
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => toggleStatus(p.id, !p.isActive)}
                    className={`p-2 rounded-xl transition-all ${p.isActive ? "text-green-500 bg-green-50 hover:bg-green-100" : "text-gray-400 bg-gray-50 hover:bg-gray-100"}`}
                    title={p.isActive ? "Deactivate" : "Activate"}
                  >
                    {p.isActive ? <CheckCircle2 size={18} /> : <XCircle size={18} />}
                  </button>
                  <button
                    onClick={() => removeProvider(p.id)}
                    className="p-2 text-red-500 bg-red-50 hover:bg-red-100 rounded-xl transition-all"
                    title="Remove"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="text-lg font-black text-gray-800 dark:text-white group-hover:text-primary transition-colors">{p.providerName}</h4>
                  <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 bg-gray-100 dark:bg-white/5 px-2 py-0.5 rounded-md inline-block mt-1">{p.providerType}</span>
                </div>

                <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-white/5 p-3 rounded-2xl">
                  <div className="w-8 h-8 bg-white dark:bg-card rounded-xl flex items-center justify-center shadow-sm">
                    <Phone size={14} className="text-primary" />
                  </div>
                  <span className="text-sm font-black">{p.phone}</span>
                </div>

                <div className="flex justify-between items-center pt-2">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Typical Charges</span>
                    <span className="text-sm font-black text-gray-800 dark:text-white">
                      ₹{p.typicalChargesMin} - ₹{p.typicalChargesMax}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 bg-yellow-50 text-yellow-600 px-3 py-1.5 rounded-xl">
                    <Star size={14} fill="currentColor" />
                    <span className="text-sm font-black">{p.rating || "N/A"}</span>
                  </div>
                </div>
              </div>

              <div className={`absolute top-0 right-0 w-2 h-full ${p.isActive ? "bg-green-500/10" : "bg-gray-200/10"}`} />
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ServiceProviderManagement;
