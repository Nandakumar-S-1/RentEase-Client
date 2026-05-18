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

export const useServiceProviders = (
  propertyId: string,
  initialLimit: number = 6,
) => {
  const [providers, setProviders] = useState<ServiceProvider[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [limit] = useState(initialLimit);

  const fetchProviders = useCallback(
    async (targetPage: number = page) => {
      if (!propertyId) return;
      try {
        setLoading(true);
        const res = await getServiceProviders(propertyId, targetPage, limit);
        if (res && res.success) {
          setProviders(res.data.providers);
          setTotal(res.data.total);
          setPage(res.data.page);
        }
      } catch (error) {
        console.error("Failed to fetch service providers:", error);
      } finally {
        setLoading(false);
      }
    },
    [propertyId, page, limit],
  );

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
    page,
    total,
    limit,
    setPage,
    addProvider,
    removeProvider,
    updateProvider,
    toggleStatus,
    refresh: fetchProviders,
  };
};
