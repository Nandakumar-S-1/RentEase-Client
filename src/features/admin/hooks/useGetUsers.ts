import { useState, useEffect, useCallback } from "react";
import { getAllUsers } from "../services/adminService";
import type { UserResponse } from "../types/adminTypes";
import type { ApiError } from "../../../types/common";
import type { RoleType } from "../../../types/Constants/role.constant";

export const useGetUsers = (
  page = 1,
  limit = 10,
  role?: RoleType
) => {
  const [users, setUsers] = useState<UserResponse[]>([]);
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
    } catch (error) {
      const apiError = error as ApiError;
      setError(apiError?.response?.data?.message || 'fallback message');
    } finally {
      setIsLoading(false);
    }
  }, [page, limit, role]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return { users, isLoading, error, totalPages, refetch: fetchUsers };
};
