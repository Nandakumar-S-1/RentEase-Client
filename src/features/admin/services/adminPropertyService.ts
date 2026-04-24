import { axiosApi } from "../../../services/api/axiosInstance";
import { API_ROUTES } from "../../../config/routes";
import type { PropertyData } from "../../property/types/propertyTypes";

interface PendingPropertiesResponse {
  success: boolean;
  message: string;
  data: {
    properties: PropertyData[];
    total: number;
    page: number;
    limit: number;
  };
}

interface ActionResponse {
  success: boolean;
  message: string;
}

export const getPendingProperties = async (page: number = 1, limit: number = 10): Promise<PendingPropertiesResponse> => {
  const response = await axiosApi.get(API_ROUTES.ADMIN_PENDING_PROPERTIES, {
    params: { page, limit }
  });
  return response.data;
};

export const getAllPropertiesForAdmin = async (page: number = 1, limit: number = 10, status: string): Promise<PendingPropertiesResponse> => {
  const response = await axiosApi.get(API_ROUTES.SEARCH_PROPERTIES, {
    params: { page, limit, status }
  });
  return response.data;
};

export const approveProperty = async (id: string): Promise<ActionResponse> => {
  const response = await axiosApi.patch(API_ROUTES.ADMIN_VERIFY_PROPERTY(id));
  return response.data;
};

export const rejectProperty = async (id: string, reason: string): Promise<ActionResponse> => {
  const response = await axiosApi.patch(API_ROUTES.ADMIN_REJECT_PROPERTY(id), {
    rejectionReason: reason
  });
  return response.data;
};
