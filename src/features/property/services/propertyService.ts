import { axiosApi } from "../../../services/api/axiosInstance";
import { API_ROUTES } from "../../../config/routes";
import type {
  CreatePropertyData,
  CreatePropertyResponse,
  GetPropertiesParams,
  PaginatedPropertyResponse,
  PropertyData,
  UploadPropertyPhotosUrlsResponse,
} from "../types/propertyTypes";

export const getOwnerProperties = async (
  params: GetPropertiesParams,
): Promise<PaginatedPropertyResponse> => {
  const response = await axiosApi.get(API_ROUTES.GET_OWNER_PROPERTIES, {
    params,
  });
  return response.data;
};

export const getAllProperties = async (
  params: GetPropertiesParams,
): Promise<PaginatedPropertyResponse> => {
  const response = await axiosApi.get(API_ROUTES.SEARCH_PROPERTIES, { params });
  return response.data;
};

export const updateProperty = (id: string, data: Partial<PropertyData>) => {
  return axiosApi.put<PropertyData>(`${API_ROUTES.SEARCH_PROPERTIES}/${id}`, data);
};

export const unlistProperty = (id: string) => {
  return axiosApi.patch(`${API_ROUTES.SEARCH_PROPERTIES}/${id}/unlist`);
};

export const relistProperty = (id: string) => {
  return axiosApi.patch(`${API_ROUTES.SEARCH_PROPERTIES}/${id}/relist`);
};

export const deleteProperty = (id: string) => {
  return axiosApi.delete(`${API_ROUTES.SEARCH_PROPERTIES}/${id}`);
};

export const createProperty = async (
  data: CreatePropertyData,
): Promise<CreatePropertyResponse> => {
  const response = await axiosApi.post(API_ROUTES.CREATE_PROPERTY, data);
  return response.data;
};

export const getPropertyPhotoUploadUrls = async (
  files: Array<{ fileName: string; contentType: string }>,
): Promise<UploadPropertyPhotosUrlsResponse> => {
  const response = await axiosApi.post(API_ROUTES.UPLOAD_PROPERTY_PHOTOS_URLS, {
    files,
  });
  return response.data;
};

export const getPropertyById = async (id: string): Promise<{ success: boolean; data: PropertyData & { bhk?: number; bathrooms?: number; floorNumber?: string; totalFloors?: number; propertyAge?: string; facingDirection?: string; furnishingStatus?: string; amenities?: string[]; preferredTenantType?: string[]; maintenanceCharges?: number; maintenanceIncluded?: boolean; } }> => {
  const response = await axiosApi.get(API_ROUTES.GET_PROPERTY_BY_ID(id));
  return response.data;
};
