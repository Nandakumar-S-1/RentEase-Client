import { axiosApi } from "../../../services/api/axiosInstance";
import { API_ROUTES } from "../../../config/routes";
import type {
  GetNotificationsResponse,
  UnreadCountResponse,
} from "../types/notificationTypes";

export const getMyNotifications = async (
  page: number,
  limit: number = 15,
): Promise<GetNotificationsResponse> => {
  const response = await axiosApi.get(API_ROUTES.GET_NOTIFICATIONS, {
    params: { page, limit },
  });
  return response.data;
};

export const getUnreadCount = async (): Promise<UnreadCountResponse> => {
  const response = await axiosApi.get(API_ROUTES.GET_UNREAD_COUNT);
  return response.data;
};

export const markAsRead = async (id: string): Promise<void> => {
  await axiosApi.patch(API_ROUTES.MARK_NOTIFICATION_READ(id));
};

export const markAllAsRead = async (): Promise<void> => {
  await axiosApi.patch(API_ROUTES.MARK_ALL_NOTIFICATIONS_READ);
};
