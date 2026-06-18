import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useServiceProviders } from "../hooks/useServiceProviders";
import DashboardLayout from "../../../components/common/DashboardLayout";
import { useAppSelector } from "../../../hooks/useAppSelector";
import type { RootState } from "../../../app/store/store";
import type { RoleType } from "../../../types/constants/role.constant";
import { Plus, XCircle, ChevronLeft, Search } from "lucide-react";
import { LoadingOverlay, Modal, Pagination } from "../../../components/common";
import { serviceProviderSchema } from "../schemas/propertySchemas";
import { ServiceProviderCard } from "./partials/ServiceProviderCard";
import { ServiceProviderForm } from "./partials/ServiceProviderForm";

const ServiceProviderManagement: React.FC = () => {
  const { propertyId } = useParams<{ propertyId: string }>();
  const navigate = useNavigate();
  const { user } = useAppSelector((state: RootState) => state.auth);
  const {
    providers,
    loading,
    page,
    total,
    limit,
    setPage,
    addProvider,
    removeProvider,
    toggleStatus,
    updateProvider,
  } = useServiceProviders(propertyId || "", 6);

  const [isAdding, setIsAdding] = useState(false);
  const [editingProviderId, setEditingProviderId] = useState<string | null>(
    null,
  );
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [providerToDelete, setProviderToDelete] = useState<string | null>(null);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [providerToToggle, setProviderToToggle] = useState<{
    id: string;
    nextStatus: boolean;
  } | null>(null);

  const [newProvider, setNewProvider] = useState({
    providerName: "",
    providerType: "Electrician",
    phone: "",
    typicalChargesMin: "",
    typicalChargesMax: "",
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const parseOptionalNumber = (v: string) =>
    v.trim() === "" ? undefined : Number(v);

  const validateForm = () => {
    const result = serviceProviderSchema.safeParse(newProvider);
    if (!result.success) {
      const errors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        errors[issue.path[0]?.toString() || "unknown"] = issue.message;
      });
      setFormErrors(errors);
      return false;
    }

    setFormErrors({});
    return true;
  };

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    if (editingProviderId) {
      await updateProvider(editingProviderId, {
        ...newProvider,
        typicalChargesMin: parseOptionalNumber(newProvider.typicalChargesMin),
        typicalChargesMax: parseOptionalNumber(newProvider.typicalChargesMax),
      });
    } else {
      await addProvider({
        ...newProvider,
        typicalChargesMin: parseOptionalNumber(newProvider.typicalChargesMin),
        typicalChargesMax: parseOptionalNumber(newProvider.typicalChargesMax),
      });
    }

    setIsAdding(false);
    setEditingProviderId(null);
    setNewProvider({
      providerName: "",
      providerType: "Electrician",
      phone: "",
      typicalChargesMin: "",
      typicalChargesMax: "",
    });
    setFormErrors({});
  };

  const startEdit = (provider: {
    id: string;
    providerName: string;
    providerType: string;
    phone: string;
    typicalChargesMin?: number;
    typicalChargesMax?: number;
  }) => {
    setNewProvider({
      providerName: provider.providerName,
      providerType: provider.providerType,
      phone: provider.phone,
      typicalChargesMin: provider.typicalChargesMin?.toString() || "",
      typicalChargesMax: provider.typicalChargesMax?.toString() || "",
    });
    setEditingProviderId(provider.id);
    setIsAdding(true);
    setFormErrors({});
  };

  const confirmDelete = (id: string) => {
    setProviderToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const confirmToggleStatus = (id: string, nextStatus: boolean) => {
    setProviderToToggle({ id, nextStatus });
    setIsStatusModalOpen(true);
  };

  if (loading && providers.length === 0) return <LoadingOverlay />;

  return (
    <DashboardLayout
      role={user?.role as RoleType}
      userName={user?.fullname || "Owner"}
    >
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
            <h1 className="text-4xl font-black text-[color:var(--color-foreground)] tracking-tight">
              Service Providers
            </h1>
            <p className="text-gray-500 font-medium tracking-wide">
              Manage trusted contacts for maintenance and repairs.
            </p>
          </div>
          <button
            onClick={() => setIsAdding(!isAdding)}
            className="flex items-center gap-2 px-8 py-3.5 bg-primary text-white font-black rounded-lg shadow-xl shadow-primary/30 hover:scale-105 transition-all lg:w-fit"
          >
            {isAdding ? <XCircle size={20} /> : <Plus size={20} />}
            {isAdding ? "Cancel" : "Add Provider"}
          </button>
        </div>

        {isAdding && (
          <ServiceProviderForm
            newProvider={newProvider}
            setNewProvider={setNewProvider}
            formErrors={formErrors}
            handleAddSubmit={handleAddSubmit}
          />
        )}

        {/* Providers List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading && (
            <div className="col-span-full py-20 flex items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          )}

          {!loading &&
            (!providers ||
              (Array.isArray(providers) && providers.length === 0)) && (
              <div className="col-span-full py-20 bg-gray-50 dark:bg-white/5 rounded-xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-center px-6">
                <div className="w-16 h-16 bg-white dark:bg-card rounded-lg shadow-sm flex items-center justify-center mb-4 text-gray-300">
                  <Search size={32} />
                </div>
                <h3 className="text-xl font-black text-gray-800 dark:text-white mb-2">
                  No Service Providers Linked
                </h3>
                <p className="text-gray-500 font-medium max-w-sm">
                  Add local electricians, plumbers, or cleaners to make property
                  maintenance easier for you and your tenants.
                </p>
              </div>
            )}

          {Array.isArray(providers) &&
            providers.map((p) => (
              <ServiceProviderCard
                key={p.id}
                provider={p}
                startEdit={startEdit}
                confirmToggleStatus={confirmToggleStatus}
                confirmDelete={confirmDelete}
              />
            ))}
        </div>

        {/* Pagination Controls */}
        {!loading && total > limit && (
          <Pagination
            page={page}
            total={total}
            totalPages={Math.ceil(total / limit)}
            limit={limit}
            itemName="service providers"
            onPageChange={setPage}
          />
        )}

        <Modal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={() => {
            if (providerToDelete) removeProvider(providerToDelete);
            setIsDeleteModalOpen(false);
          }}
          title="Remove Service Provider"
          description="Are you sure you want to remove this service provider? This action cannot be undone."
          confirmText="Remove"
          isDestructive={true}
        />
        <Modal
          isOpen={isStatusModalOpen}
          onClose={() => setIsStatusModalOpen(false)}
          onConfirm={() => {
            if (providerToToggle)
              toggleStatus(providerToToggle.id, providerToToggle.nextStatus);
            setIsStatusModalOpen(false);
          }}
          title={
            providerToToggle?.nextStatus
              ? "Activate Provider"
              : "Deactivate Provider"
          }
          description={`Are you sure you want to ${providerToToggle?.nextStatus ? "activate" : "deactivate"} this service provider?`}
          confirmText={providerToToggle?.nextStatus ? "Activate" : "Deactivate"}
          isDestructive={false}
        />
      </div>
    </DashboardLayout>
  );
};

export default ServiceProviderManagement;
