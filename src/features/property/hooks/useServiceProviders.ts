import { useState, useCallback, useEffect } from "react";
import {
  getServiceProviders,
  addServiceProvider,
  deleteServiceProvider,
  toggleServiceProviderStatus,
  type ServiceProvider,
  updateServiceProvider,
} from "../services/serviceProviderService";
import { toast } from "react-hot-toast";

export const useServiceProviders = (propertyId: string) => {
  const [providers, setProviders] = useState<ServiceProvider[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchProviders = useCallback(async () => {
    if (!propertyId) return;
    try {
      setLoading(true);
      const res = await getServiceProviders(propertyId);
      if (res && res.success) {
        setProviders(res.data);
      }
    } catch (error) {
      console.error("Failed to fetch service providers:", error);
    } finally {
      setLoading(false);
    }
  }, [propertyId]);

  useEffect(() => {
    fetchProviders();
  }, [fetchProviders]);

  const addProvider = async (
    data: Omit<
      ServiceProvider,
      "id" | "rating" | "totalJobsCompleted" | "isActive" | "propertyId"
    >,
  ) => {
    try {
      await addServiceProvider({ ...data, propertyId });
      toast.success("Service provider added");
      fetchProviders();
    } catch {
      toast.error("Failed to add provider");
    }
  };

  const removeProvider = async (id: string) => {
    try {
      await deleteServiceProvider(id);
      toast.success("Provider removed");
      fetchProviders();
    } catch {
      toast.error("Failed to remove provider");
    }
  };

  const toggleStatus = async (id: string, isActive: boolean) => {
    try {
      await toggleServiceProviderStatus(id, isActive);
      fetchProviders();
    } catch {
      toast.error("Failed to update status");
    }
  };

  const updateProvider = async (id: string, data: Partial<ServiceProvider>) => {
    try {
      await updateServiceProvider(id, data);
      toast.success("Provider updated");
      fetchProviders();
    } catch {
      toast.error("Failed to update provider");
    }
  };

  return {
    providers,
    loading,
    addProvider,
    removeProvider,
    updateProvider,
    toggleStatus,
    refresh: fetchProviders,
  };
};
