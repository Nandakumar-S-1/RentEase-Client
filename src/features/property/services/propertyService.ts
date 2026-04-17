import { axiosApi } from "../../../services/api/axiosInstance";
import { API_ROUTES } from "../../../config/routes";
import type {
  CreatePropertyData,
  CreatePropertyResponse,
  GetPropertiesParams,
  PaginatedPropertyResponse,
  UploadPropertyPhotosUrlsResponse,
} from "../types/propertyTypes";

export const getOwnerProperties = async (params: GetPropertiesParams): Promise<PaginatedPropertyResponse> => {
  const response = await axiosApi.get(API_ROUTES.GET_OWNER_PROPERTIES, { params });
  return response.data;
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
