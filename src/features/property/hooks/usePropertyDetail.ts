import { useState, useEffect, useCallback } from "react";
import { getPropertyById } from "../services/propertyService";
import type { PropertyData } from "../types/propertyTypes";

export const usePropertyDetail = (id?: string) => {
  const [property, setProperty] = useState<PropertyData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDetail = useCallback(async (propertyId: string) => {
    try {
      setLoading(true);
      const response = await getPropertyById(propertyId);
      setProperty(response.data);
      setError(null);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch property details";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (id) {
      fetchDetail(id);
    }
  }, [id, fetchDetail]);

  return {
    property,
    loading,
    error,
    refresh: () => id && fetchDetail(id),
  };
};
