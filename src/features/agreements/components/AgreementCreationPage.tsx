import React, { useState, useEffect } from "react";
import { Building2, Calendar, ShieldCheck, Mail, IndianRupee, Clock, ChevronRight, ArrowLeft } from "lucide-react";
import { getOwnerProperties } from "../../property/services/propertyService";
import type { PropertyData, PaginatedPropertyResponse } from "../../property/types/propertyTypes";
import { useAgreements } from "../hooks/useAgreements";
import { useNavigate } from "react-router-dom";
import { PAGE_ROUTES } from "../../../config/routes";
import DashboardLayout from "../../../components/common/DashboardLayout";
import { useAppSelector } from "../../../hooks/useAppSelector";
import type { RootState } from "../../../app/store/store";
import type { RoleType } from "../../../types/constants/role.constant";
import toast from "react-hot-toast";

const AgreementCreationPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAppSelector((state: RootState) => state.auth);
  const { createAgreement, isLoading } = useAgreements();

  const [properties, setProperties] = useState<PropertyData[]>([]);
  const [selectedPropertyId, setSelectedPropertyId] = useState("");
  const [tenantEmail, setTenantEmail] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [monthlyRent, setMonthlyRent] = useState("");
  const [depositAmount, setDepositAmount] = useState("");
  const [lockInMonths, setLockInMonths] = useState("6");
  const [customTerms, setCustomTerms] = useState("");
  const [apiError, setApiError] = useState<string | null>(null);
  const [durationDisplay, setDurationDisplay] = useState("");

  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      if (end > start) {
        let months = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());
        if (end.getDate() < start.getDate()) {
            months--;
        }
        const remainingStart = new Date(start);
        remainingStart.setMonth(start.getMonth() + months);
        const diffTime = Math.abs(end.getTime() - remainingStart.getTime());
        const days = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        setDurationDisplay(`${months} Months, ${days} Days`);
      } else {
        setDurationDisplay("Invalid Dates");
      }
    } else {
      setDurationDisplay("");
    }
  }, [startDate, endDate]);

  useEffect(() => {
    // Fetch owner properties
    getOwnerProperties({ status: "ACTIVE" })
      .then((res: PaginatedPropertyResponse) => {
        const list = res.data?.properties || [];
        setProperties(list);
        if (list.length > 0) {
          setSelectedPropertyId(list[0].id);
          setMonthlyRent(list[0].monthlyRent.toString());
          setDepositAmount((list[0].monthlyRent * 2).toString()); // default deposit 2x rent
        }
      })
      .catch(() => {
        toast.error("Failed to load properties");
      });
  }, []);

  const handlePropertyChange = (propertyId: string) => {
    setSelectedPropertyId(propertyId);
    const selected = properties.find((p) => p.id === propertyId);
    if (selected) {
      setMonthlyRent(selected.monthlyRent.toString());
      setDepositAmount((selected.monthlyRent * 2).toString());
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError(null);
    if (!selectedPropertyId) {
      toast.error("Please select a property");
      return;
    }
    if (!tenantEmail) {
      toast.error("Please provide tenant email");
      return;
    }
    if (!startDate || !endDate) {
      toast.error("Please enter validity dates");
      return;
    }
    if (new Date(endDate) <= new Date(startDate)) {
      toast.error("End date must be after start date");
      return;
    }

    const payload = {
      propertyId: selectedPropertyId,
      tenantEmail,
      startDate: new Date(startDate).toISOString(),
      endDate: new Date(endDate).toISOString(),
      monthlyRent: Number(monthlyRent),
      depositAmount: Number(depositAmount),
      lockInPeriodMonths: Number(lockInMonths),
      noticePeriodMonths: 2,
      customClauses: customTerms,
    };

    try {
      await createAgreement(payload);
      toast.success("Draft agreement created successfully!");
      navigate(PAGE_ROUTES.OWNER_AGREEMENTS);
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || err.message || "Failed to create agreement";
      setApiError(errorMsg);
      toast.error(errorMsg);
    }
  };

  return (
    <DashboardLayout role={user?.role as RoleType} userName={user?.fullname || "User"}>
      <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500 pb-20">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(PAGE_ROUTES.OWNER_AGREEMENTS)}
            className="w-12 h-12 flex items-center justify-center bg-white dark:bg-card border border-[color:var(--color-border)] rounded-lg hover:bg-[color:var(--color-secondary)] transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-3xl font-black text-[color:var(--color-foreground)] tracking-tight">
              Draft New Lease Agreement
            </h1>
            <p className="text-sm font-medium text-[color:var(--color-muted-foreground)]">
              Establish legally secure terms for your property and tenant.
            </p>
          </div>
        </div>

        <div className="bg-white dark:bg-card border border-[color:var(--color-border)] rounded-xl shadow-sm overflow-hidden">
          <form onSubmit={handleFormSubmit} className="p-8 md:p-10 space-y-8">
            {apiError && (
              <div className="p-4 bg-red-50 text-red-600 rounded-lg text-sm font-semibold border border-red-100 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 shrink-0" />
                {apiError}
              </div>
            )}
            
            {/* Asset Selection */}
            <div className="space-y-3">
              <label className="text-xs font-black uppercase tracking-widest text-[color:var(--color-muted-foreground)] flex items-center gap-2">
                <Building2 size={16} className="text-primary" /> Select Active Listing *
              </label>
              <select
                value={selectedPropertyId}
                onChange={(e) => handlePropertyChange(e.target.value)}
                className="w-full px-6 py-4 border border-[color:var(--color-border)] bg-[color:var(--color-secondary)]/50 dark:bg-white/5 rounded-lg text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-[color:var(--color-foreground)]"
              >
                {properties.length === 0 ? (
                  <option value="">No active listings available</option>
                ) : (
                  properties.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.title} - ₹{p.monthlyRent}/mo ({p.fullAddress})
                    </option>
                  ))
                )}
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Tenant Email */}
              <div className="space-y-3">
                <label className="text-xs font-black uppercase tracking-widest text-[color:var(--color-muted-foreground)] flex items-center gap-2">
                  <Mail size={16} className="text-primary" /> Tenant Email Address *
                </label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    placeholder="name@example.com"
                    value={tenantEmail}
                    onChange={(e) => setTenantEmail(e.target.value)}
                    className="w-full pl-12 pr-6 py-4 border border-[color:var(--color-border)] bg-[color:var(--color-secondary)]/50 dark:bg-white/5 rounded-lg text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-[color:var(--color-foreground)]"
                  />
                  <Mail size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-[color:var(--color-muted-foreground)]" />
                </div>
              </div>

              {/* Lock-In Period */}
              <div className="space-y-3">
                <label className="text-xs font-black uppercase tracking-widest text-[color:var(--color-muted-foreground)] flex items-center gap-2">
                  <Clock size={16} className="text-primary" /> Lock-in Period (Months) *
                </label>
                <input
                  type="number"
                  min="0"
                  required
                  value={lockInMonths}
                  onChange={(e) => setLockInMonths(e.target.value)}
                  className="w-full px-6 py-4 border border-[color:var(--color-border)] bg-[color:var(--color-secondary)]/50 dark:bg-white/5 rounded-lg text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-[color:var(--color-foreground)]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Rent */}
              <div className="space-y-3">
                <label className="text-xs font-black uppercase tracking-widest text-[color:var(--color-muted-foreground)] flex items-center gap-2">
                  <IndianRupee size={16} className="text-primary" /> Monthly Rent (INR) *
                </label>
                <div className="relative">
                  <input
                    type="number"
                    required
                    value={monthlyRent}
                    onChange={(e) => setMonthlyRent(e.target.value)}
                    className="w-full pl-12 pr-6 py-4 border border-[color:var(--color-border)] bg-[color:var(--color-secondary)]/50 dark:bg-white/5 rounded-lg text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-[color:var(--color-foreground)]"
                  />
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[color:var(--color-muted-foreground)] font-bold text-lg">₹</span>
                </div>
              </div>

              {/* Deposit */}
              <div className="space-y-3">
                <label className="text-xs font-black uppercase tracking-widest text-[color:var(--color-muted-foreground)] flex items-center gap-2">
                  <IndianRupee size={16} className="text-primary" /> Security Deposit (INR) *
                </label>
                <div className="relative">
                  <input
                    type="number"
                    required
                    value={depositAmount}
                    onChange={(e) => setDepositAmount(e.target.value)}
                    className="w-full pl-12 pr-6 py-4 border border-[color:var(--color-border)] bg-[color:var(--color-secondary)]/50 dark:bg-white/5 rounded-lg text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-[color:var(--color-foreground)]"
                  />
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[color:var(--color-muted-foreground)] font-bold text-lg">₹</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Start Date */}
              <div className="space-y-3">
                <label className="text-xs font-black uppercase tracking-widest text-[color:var(--color-muted-foreground)] flex items-center gap-2">
                  <Calendar size={16} className="text-primary" /> Agreement Start Date *
                </label>
                <input
                  type="date"
                  required
                  min={today}
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-6 py-4 border border-[color:var(--color-border)] bg-[color:var(--color-secondary)]/50 dark:bg-white/5 rounded-lg text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-[color:var(--color-foreground)]"
                />
              </div>

              {/* End Date */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-black uppercase tracking-widest text-[color:var(--color-muted-foreground)] flex items-center gap-2">
                    <Calendar size={16} className="text-primary" /> Agreement End Date *
                  </label>
                  {durationDisplay && (
                    <span className="text-xs font-black text-primary bg-primary/10 px-3 py-1 rounded-full">
                      Duration: {durationDisplay}
                    </span>
                  )}
                </div>
                <input
                  type="date"
                  required
                  min={startDate || today}
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full px-6 py-4 border border-[color:var(--color-border)] bg-[color:var(--color-secondary)]/50 dark:bg-white/5 rounded-lg text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-[color:var(--color-foreground)]"
                />
              </div>
            </div>

            {/* Custom Terms */}
            <div className="space-y-3">
              <label className="text-xs font-black uppercase tracking-widest text-[color:var(--color-muted-foreground)]">
                Additional Terms & Conditions
              </label>
              <textarea
                rows={4}
                placeholder="E.g., No painting walls, no sub-letting, maintenance details..."
                value={customTerms}
                onChange={(e) => setCustomTerms(e.target.value)}
                className="w-full px-6 py-4 border border-[color:var(--color-border)] bg-[color:var(--color-secondary)]/50 dark:bg-white/5 rounded-lg text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-[color:var(--color-foreground)]"
              />
            </div>

            {/* Legal / Policy terms */}
            <div className="p-6 bg-primary/5 dark:bg-primary/10 rounded-xl flex gap-4 items-start border border-primary/20">
              <ShieldCheck className="w-8 h-8 text-primary shrink-0" />
              <div>
                <h5 className="text-sm font-black uppercase tracking-wider text-primary">
                  Legally Secure & Compliant
                </h5>
                <p className="text-xs font-medium text-primary/70 leading-relaxed mt-2 max-w-xl">
                  By submitting this form, you will create a digital draft. Both parties must execute
                  via biometric/digital signature matching the tenancy guidelines before activating.
                </p>
              </div>
            </div>

            <div className="pt-6 flex justify-end gap-4 border-t border-[color:var(--color-border)]">
              <button
                type="button"
                onClick={() => navigate(PAGE_ROUTES.OWNER_AGREEMENTS)}
                className="px-8 py-4 rounded-lg text-sm font-black tracking-widest text-[color:var(--color-muted-foreground)] hover:bg-[color:var(--color-secondary)] transition-all"
              >
                CANCEL
              </button>
              <button
                type="submit"
                disabled={isLoading || properties.length === 0}
                className="px-10 py-4 bg-primary text-white rounded-lg text-sm font-black tracking-widest hover:scale-[1.02] disabled:opacity-50 transition-all flex items-center gap-2 shadow-xl shadow-primary/20"
              >
                {isLoading ? "GENERATING DRAFT..." : "CONFIRM & DRAFT"} <ChevronRight size={18} />
              </button>
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AgreementCreationPage;
