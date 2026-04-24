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

const BASE_URL = '/service-providers';

export const addServiceProvider = async (data: Omit<ServiceProvider, 'id' | 'rating' | 'totalJobsCompleted' | 'isActive'>) => {
  const response = await axiosApi.post<ServiceProvider>(BASE_URL, data);
  return response.data;
};

export const getServiceProviders = async (propertyId: string) => {
  const response = await axiosApi.get<ServiceProvider[]>(`${BASE_URL}/property/${propertyId}`);
  return response.data;
};

export const toggleServiceProviderStatus = async (id: string, isActive: boolean) => {
  const response = await axiosApi.patch(`${BASE_URL}/${id}/status`, { isActive });
  return response.data;
};

export const deleteServiceProvider = async (id: string) => {
  const response = await axiosApi.delete(`${BASE_URL}/${id}`);
  return response.data;
};
