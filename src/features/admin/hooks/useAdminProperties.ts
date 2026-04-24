import { useState, useCallback } from "react";
import { approveProperty, rejectProperty, getAllPropertiesForAdmin } from "../services/adminPropertyService";
import type { PropertyData } from "../../property/types/propertyTypes";
import { toast } from "react-hot-toast";
import { getApiErrorMessage } from "../../../types/common";

export const useAdminProperties = () => {
  const [properties, setProperties] = useState<PropertyData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 6,
    total: 0,
    pages: 1,
    status: "PENDING_APPROVAL" as string
  });

  const fetchProperties = useCallback(async (page: number = 1, status: string = "PENDING_APPROVAL") => {
    try {
      setLoading(true);
      const response = await getAllPropertiesForAdmin(page, pagination.limit, status);
      if (response.success) {
        setProperties(response.data.properties);
        setPagination((prev) => ({
          ...prev,
          page: response.data.page,
          total: response.data.total,
          pages: Math.ceil(response.data.total / response.data.limit),
          status
        }));
      }
      setError(null);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch properties";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [pagination.limit]);

  const approve = async (id: string) => {
    try {
      setLoading(true);
      await approveProperty(id);
      setProperties((prev) => prev.filter((p) => p.id !== id));
      toast.success("Property approved successfully");
      fetchProperties(pagination.page, pagination.status);
    } catch (err: unknown) {
      toast.error(getApiErrorMessage(err, "Failed to approve property"));
    } finally {
      setLoading(false);
    }
  };

  const reject = async (id: string, reason: string) => {
    try {
      setLoading(true);
      await rejectProperty(id, reason);
      setProperties((prev) => prev.filter((p) => p.id !== id));
      toast.success("Property rejected successfully");
      fetchProperties(pagination.page, pagination.status);
    } catch (err: unknown) {
      toast.error(getApiErrorMessage(err, "Failed to reject property"));
    } finally {
      setLoading(false);
    }
  };

  return {
    properties,
    loading,
    error,
    pagination,
    fetchProperties,
    approve,
    reject,
  };
};
