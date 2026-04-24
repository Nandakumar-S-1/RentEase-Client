import { useState, useEffect, useCallback } from "react";
import {
  getOwnerProperties,
  getAllProperties,
} from "../services/propertyService";
import type { PropertyData, GetPropertiesParams } from "../types/propertyTypes";

export const useProperty = (mode: "owner" | "search" = "owner") => {
  const [properties, setProperties] = useState<PropertyData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit] = useState(6);
  const [status, setStatus] = useState<string | undefined>(undefined);
  const [layout, setLayout] = useState<"grid" | "list">("grid");

  const fetchProperties = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const params: GetPropertiesParams = {
        page,
        limit,
        status: status === "ALL" ? undefined : status,
      };

      const response = await (mode === "owner"
        ? getOwnerProperties(params)
        : getAllProperties(params));

      if (response.success) {
        setProperties(response.data.properties);
        setTotal(response.data.total);
      }
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to fetch properties";
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [page, limit, status, mode]);

  useEffect(() => {
    fetchProperties();
  }, [fetchProperties]);

  return {
    properties,
    loading,
    error,
    total,
    page,
    setPage,
    status,
    setStatus,
    layout,
    setLayout,
    fetchProperties,
  };
};
