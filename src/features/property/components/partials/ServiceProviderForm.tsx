import React from "react";

const PROVIDER_TYPES = [
  "Electrician",
  "Plumber",
  "Cleaner",
  "Painter",
  "Carpenter",
  "Pest Control",
  "AC Service",
  "Gardener",
  "Security",
  "Other",
];

interface ServiceProviderFormProps {
  newProvider: {
    providerName: string;
    providerType: string;
    phone: string;
    typicalChargesMin: string;
    typicalChargesMax: string;
  };
  setNewProvider: React.Dispatch<React.SetStateAction<{
    providerName: string;
    providerType: string;
    phone: string;
    typicalChargesMin: string;
    typicalChargesMax: string;
  }>>;
  formErrors: Record<string, string>;
  handleAddSubmit: (e: React.FormEvent) => void;
}

export const ServiceProviderForm: React.FC<ServiceProviderFormProps> = ({
  newProvider,
  setNewProvider,
  formErrors,
  handleAddSubmit,
}) => {
  return (
    <div className="bg-white dark:bg-card border-2 border-primary/20 rounded-xl p-8 shadow-xl animate-in fade-in slide-in-from-top-4">
      <h3 className="text-xl font-black mb-6">New Service Provider</h3>
      <form
        onSubmit={handleAddSubmit}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        <div className="space-y-2">
          <label className="text-sm font-black text-gray-700 ml-1">
            Provider Name *
          </label>
          <input
            value={newProvider.providerName}
            onChange={(e) =>
              setNewProvider({
                ...newProvider,
                providerName: e.target.value,
              })
            }
            className={`w-full px-6 py-4 bg-gray-50 dark:bg-white/5 border ${formErrors.providerName ? "border-red-500" : "border-[color:var(--color-border)]"} rounded-lg focus:ring-2 focus:ring-primary/20 text-sm font-medium`}
            placeholder="e.g. John Doe"
          />
          {formErrors.providerName && (
            <p className="text-red-500 text-[10px] font-bold mt-1 ml-1">
              {formErrors.providerName}
            </p>
          )}
        </div>
        <div className="space-y-2">
          <label className="text-sm font-black text-gray-700 ml-1">
            Service Category
          </label>
          <select
            value={newProvider.providerType}
            onChange={(e) =>
              setNewProvider({
                ...newProvider,
                providerType: e.target.value,
              })
            }
            className={`w-full px-6 py-4 bg-gray-50 dark:bg-white/5 border ${formErrors.providerType ? "border-red-500" : "border-[color:var(--color-border)]"} rounded-lg text-sm font-medium`}
          >
            {PROVIDER_TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
          {formErrors.providerType && (
            <p className="text-red-500 text-[10px] font-bold mt-1 ml-1">
              {formErrors.providerType}
            </p>
          )}
        </div>
        <div className="space-y-2">
          <label className="text-sm font-black text-gray-700 ml-1">
            Phone Number *
          </label>
          <input
            value={newProvider.phone}
            onChange={(e) =>
              setNewProvider({ ...newProvider, phone: e.target.value })
            }
            className={`w-full px-6 py-4 bg-gray-50 dark:bg-white/5 border ${formErrors.phone ? "border-red-500" : "border-[color:var(--color-border)]"} rounded-lg text-sm font-medium`}
            placeholder="e.g. +91 9876543210"
          />
          {formErrors.phone && (
            <p className="text-red-500 text-[10px] font-bold mt-1 ml-1">
              {formErrors.phone}
            </p>
          )}
        </div>
        <div className="space-y-2">
          <label className="text-sm font-black text-gray-700 ml-1">
            Min Charges (₹)
          </label>
          <input
            type="number"
            min="0"
            value={newProvider.typicalChargesMin}
            onChange={(e) =>
              setNewProvider({
                ...newProvider,
                typicalChargesMin: e.target.value,
              })
            }
            className={`w-full px-6 py-4 bg-gray-50 dark:bg-white/5 border ${formErrors.typicalChargesMin ? "border-red-500" : "border-[color:var(--color-border)]"} rounded-lg text-sm font-medium`}
            placeholder="500"
          />
          {formErrors.typicalChargesMin && (
            <p className="text-red-500 text-[10px] font-bold mt-1 ml-1">
              {formErrors.typicalChargesMin}
            </p>
          )}
        </div>
        <div className="space-y-2">
          <label className="text-sm font-black text-gray-700 ml-1">
            Max Charges (₹)
          </label>
          <input
            type="number"
            min="0"
            value={newProvider.typicalChargesMax}
            onChange={(e) =>
              setNewProvider({
                ...newProvider,
                typicalChargesMax: e.target.value,
              })
            }
            className={`w-full px-6 py-4 bg-gray-50 dark:bg-white/5 border ${formErrors.typicalChargesMax ? "border-red-500" : "border-[color:var(--color-border)]"} rounded-lg text-sm font-medium`}
            placeholder="2000"
          />
          {formErrors.typicalChargesMax && (
            <p className="text-red-500 text-[10px] font-bold mt-1 ml-1">
              {formErrors.typicalChargesMax}
            </p>
          )}
        </div>
        <div className="flex items-end">
          <button
            type="submit"
            className="w-full py-4 bg-primary text-white font-black rounded-lg hover:bg-primary-dark transition-all shadow-lg shadow-primary/20"
          >
            Save Provider
          </button>
        </div>
      </form>
    </div>
  );
};
