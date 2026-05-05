import { axiosApi } from "../../../services/api/axiosInstance";

export interface ServiceProvider {
  id: string;
  propertyId: string;
  providerType: string;
  providerName: string;
  phone: string;
  typicalChargesMin?: number;
  typicalChargesMax?: number;
  rating?: number;
  totalJobsCompleted?: number;
  isActive: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
}

const BASE_URL = '/service-providers';

export const addServiceProvider = async (data: Omit<ServiceProvider, 'id' | 'rating' | 'totalJobsCompleted' | 'isActive'>) => {
  const response = await axiosApi.post<ApiResponse<ServiceProvider>>(BASE_URL, data);
  return response.data;
};

export const getServiceProviders = async (propertyId: string) => {
  const response = await axiosApi.get<ApiResponse<ServiceProvider[]>>(`${BASE_URL}/property/${propertyId}`);
  return response.data;
};

export const toggleServiceProviderStatus = async (id: string, isActive: boolean) => {
  const response = await axiosApi.patch<ApiResponse<null>>(`${BASE_URL}/${id}/status`, { isActive });
  return response.data;
};

export const deleteServiceProvider = async (id: string) => {
  const response = await axiosApi.delete<ApiResponse<null>>(`${BASE_URL}/${id}`);
  return response.data;
};

export const updateServiceProvider = async (id: string, data: Partial<ServiceProvider>) => {
  const response = await axiosApi.put<ApiResponse<ServiceProvider>>(`${BASE_URL}/${id}`, data);
  return response.data;
};
