import { axiosApi } from "../../../services/api/axiosInstance";
import { API_ROUTES } from "../../../config/routes";
import type { GetPropertiesParams, PaginatedPropertyResponse } from "../types/propertyTypes";

export const getOwnerProperties = async (params: GetPropertiesParams): Promise<PaginatedPropertyResponse> => {
  const response = await axiosApi.get(API_ROUTES.GET_OWNER_PROPERTIES, { params });
  return response.data;
};
