import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Notification, NotificationsState } from "../types/notificationTypes";

const initialState: NotificationsState = {
  items: [],
  unreadCount: 0,
  page: 1,
  hasMore: true,
  isLoading: false,
  isFetchingMore: false,
};

const notificationSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },

    setFetchingMore: (state, action: PayloadAction<boolean>) => {
      state.isFetchingMore = action.payload;
    },

    setInitialNotifications: (
      state,
      action: PayloadAction<{ notifications: Notification[]; unreadCount: number; limit: number }>,
    ) => {
      state.items = action.payload.notifications;
      state.unreadCount = action.payload.unreadCount;
      state.page = 1;
      state.hasMore = action.payload.notifications.length >= action.payload.limit;
      state.isLoading = false;
    },

    appendNotifications: (
      state,
      action: PayloadAction<{ notifications: Notification[]; limit: number }>,
    ) => {
      const incoming = action.payload.notifications;
      // avoid duplicates
      const existingIds = new Set(state.items.map((n) => n.id));
      const newItems = incoming.filter((n) => !existingIds.has(n.id));
      state.items.push(...newItems);
      state.page += 1;
      state.hasMore = incoming.length >= action.payload.limit;
      state.isFetchingMore = false;
    },

    markOneAsRead: (state, action: PayloadAction<string>) => {
      const notification = state.items.find((n) => n.id === action.payload);
      if (notification && !notification.isRead) {
        notification.isRead = true;
        notification.readAt = new Date().toISOString();
        state.unreadCount = Math.max(0, state.unreadCount - 1);
      }
    },

    markAllRead: (state) => {
      state.items.forEach((n) => {
        n.isRead = true;
        n.readAt = n.readAt ?? new Date().toISOString();
      });
      state.unreadCount = 0;
    },

    setUnreadCount: (state, action: PayloadAction<number>) => {
      state.unreadCount = action.payload;
    },

    resetNotifications: () => initialState,
  },
});

export const {
  setLoading,
  setFetchingMore,
  setInitialNotifications,
  appendNotifications,
  markOneAsRead,
  markAllRead,
  setUnreadCount,
  resetNotifications,
} = notificationSlice.actions;

export default notificationSlice.reducer;
