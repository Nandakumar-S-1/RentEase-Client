import { API_ROUTES } from "../../../config/routes";
import { axiosApi } from "../../../services/api/axiosInstance";

export const getAllUsers = async (
  page = 1,
  limit = 10,
  role?: "OWNER" | "TENANT",
) => {
  const params: Record<string ,string|number> = { page, limit };
  if (role) {
    params.role = role;
  }
  const response = await axiosApi.get(API_ROUTES.ADMIN_USERS, {
    params,
  });
  return response.data;
};

export const suspendUser = async (userId: string) => {
  const response = await axiosApi.patch(API_ROUTES.ADMIN_SUSPEND_USER(userId));
  return response.data;
};

export const activateUser = async (userId: string) => {
  const response = await axiosApi.patch(API_ROUTES.ADMIN_ACTIVATE_USER(userId));
  return response.data;
};

export const deactivateUser = async (userId: string) => {
  const response = await axiosApi.patch( API_ROUTES.ADMIN_DEACTIVATE_USER(userId));
  return response.data;
};
