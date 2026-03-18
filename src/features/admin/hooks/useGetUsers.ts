import { useState, useEffect, useCallback } from "react";
import { getAllUsers } from "../services/adminService";

export const useGetUsers = (
  page = 1,
  limit = 10,
  role?: "OWNER" | "TENANT"
) => {
  const [users, setUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(0);

  const fetchUsers = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await getAllUsers(page, limit, role);
      setUsers(response.data?.users || []);
      setTotalPages(response.data?.totalPages || 0);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to fetch users.");
    } finally {
      setIsLoading(false);
    }
  }, [page, limit, role]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return { users, isLoading, error, totalPages, refetch: fetchUsers };
};
