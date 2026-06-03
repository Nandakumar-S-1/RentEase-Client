export type NotificationType =
  | "OWNER_VERIFICATION_APPROVED"
  | "OWNER_VERIFICATION_REJECTED"
  | "OWNER_VERIFICATION_SUBMITTED"
  | "PROPERTY_APPROVED"
  | "PROPERTY_REJECTED"
  | "PROPERTY_UNLISTED"
  | "PROPERTY_SUBMITTED"
  | "USER_SUSPENDED"
  | "AGREEMENT_CREATED"
  | "AGREEMENT_SIGNED"
  | "NEW_MESSAGE";

export interface Notification {
  id: string;
  notificationType: NotificationType;
  title: string;
  message: string;
  notificationData: Record<string, unknown> | null;
  actionUrl: string | null;
  relatedEntityType: string | null;
  relatedEntityId: string | null;
  isRead: boolean;
  readAt: string | null;
  createdAt: string;
}

export interface GetNotificationsResponse {
  success: boolean;
  data: {
    notifications: Notification[];
    unreadCount: number;
  };
}

export interface UnreadCountResponse {
  success: boolean;
  data: {
    unreadCount: number;
  };
}

export interface NotificationsState {
  items: Notification[];
  unreadCount: number;
  page: number;
  hasMore: boolean;
  isLoading: boolean;
  isFetchingMore: boolean;
}
