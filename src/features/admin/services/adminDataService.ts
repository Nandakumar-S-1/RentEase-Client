import { axiosApi as api } from "../../../services/api/axiosInstance";
import { API_ROUTES } from "../../../config/routes";
import type {
  AdminAgreementsResponse,
  AdminAgreementDetail,
} from "../types/adminAgreementTypes";
import type { AdminPaymentsResponse } from "../types/adminPaymentTypes";
import type { Notification } from "../../notifications/types/notificationTypes";

export interface TenantKycDocument {
  documentUrl: string | null;
  agreementNumber: string;
  agreementId: string;
}

export const getAllAgreements = async (
  page: number = 1,
  limit: number = 10,
  status?: string,
  search?: string,
): Promise<AdminAgreementsResponse> => {
  const params = new URLSearchParams();
  params.append("page", String(page));
  params.append("limit", String(limit));
  if (status) params.append("status", status);
  if (search) params.append("search", search);

  const response = await api.get(
    `${API_ROUTES.ADMIN_AGREEMENTS}?${params.toString()}`,
  );
  return response.data.data;
};

export const getAllPayments = async (
  page: number = 1,
  limit: number = 10,
  status?: string,
  category?: string,
): Promise<AdminPaymentsResponse> => {
  const params = new URLSearchParams();
  params.append("page", String(page));
  params.append("limit", String(limit));
  if (status) params.append("status", status);
  if (category) params.append("category", category);

  const response = await api.get(
    `${API_ROUTES.ADMIN_PAYMENTS}?${params.toString()}`,
  );
  return response.data.data;
};

export const getUserActivity = async (
  userId: string,
  page: number = 1,
  limit: number = 20,
): Promise<Notification[]> => {
  const response = await api.get(
    `${API_ROUTES.ADMIN_USER_ACTIVITY(userId)}?page=${page}&limit=${limit}`,
  );
  return response.data.data;
};

export const getTenantKycDocument = async (
  userId: string,
): Promise<TenantKycDocument | null> => {
  const response = await api.get(
    `${API_ROUTES.ADMIN_USERS}/${userId}/kyc-document`,
  );
  return response.data.data;
};

export const getUserPayments = async (
  userId: string,
  page: number = 1,
  limit: number = 10,
): Promise<AdminPaymentsResponse> => {
  const response = await api.get(
    `${API_ROUTES.ADMIN_USERS}/${userId}/payments?page=${page}&limit=${limit}`,
  );
  return response.data.data;
};

export const getAgreementDetails = async (
  agreementId: string,
): Promise<AdminAgreementDetail> => {
  const response = await api.get(
    `${API_ROUTES.ADMIN_AGREEMENTS}/${agreementId}`,
  );
  return response.data.data;
};
