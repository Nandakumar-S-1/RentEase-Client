import { axiosApi } from "../../../services/api/axiosInstance";
import { API_ROUTES } from "../../../config/routes";
import type {
  MaintenanceRequest,
  CreateMaintenanceRequestPayload,
  MaintenanceStatus,
} from "../types/maintenance";

export const maintenanceService = {
  createRequest: async (
    data: CreateMaintenanceRequestPayload,
  ): Promise<MaintenanceRequest> => {
    const response = await axiosApi.post(API_ROUTES.CREATE_MAINTENANCE, data);
    return response.data.data;
  },

  getRequests: async (): Promise<MaintenanceRequest[]> => {
    const response = await axiosApi.get(API_ROUTES.GET_MAINTENANCE);
    return response.data.data;
  },

  assignProvider: async (
    id: string,
    providerId: string,
  ): Promise<MaintenanceRequest> => {
    const response = await axiosApi.put(API_ROUTES.ASSIGN_PROVIDER(id), {
      providerId,
    });
    return response.data.data;
  },

  updateStatus: async (
    id: string,
    status: MaintenanceStatus | string,
  ): Promise<MaintenanceRequest> => {
    const response = await axiosApi.put(
      API_ROUTES.UPDATE_MAINTENANCE_STATUS(id),
      { status },
    );
    return response.data.data;
  },
};
