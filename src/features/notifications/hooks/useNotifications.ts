import { useCallback, useRef } from "react";
import { useAppDispatch } from "../../../hooks/useAppDispatch";
import { useAppSelector } from "../../../hooks/useAppSelector";
import type { RootState } from "../../../app/store/store";
import {
  setLoading,
  setFetchingMore,
  setInitialNotifications,
  appendNotifications,
  markOneAsRead,
  markAllRead,
} from "../slices/notificationSlice";
import {
  getMyNotifications,
  markAsRead,
  markAllAsRead,
} from "../services/notificationService";

const PAGE_LIMIT = 15;

export const useNotifications = () => {
  const dispatch = useAppDispatch();
  const { items, unreadCount, page, hasMore, isLoading, isFetchingMore } =
    useAppSelector((state: RootState) => state.notifications);

  const loadingRef = useRef(false);

  const fetchInitial = useCallback(async () => {
    if (loadingRef.current) return;
    loadingRef.current = true;
    dispatch(setLoading(true));
    try {
      const res = await getMyNotifications(1, PAGE_LIMIT);
      dispatch(
        setInitialNotifications({
          notifications: res.data.notifications,
          unreadCount: res.data.unreadCount,
          limit: PAGE_LIMIT,
        }),
      );
    } catch {
      dispatch(setLoading(false));
    } finally {
      loadingRef.current = false;
    }
  }, [dispatch]);

  const fetchMore = useCallback(async () => {
    if (!hasMore || isFetchingMore || loadingRef.current) return;
    loadingRef.current = true;
    dispatch(setFetchingMore(true));
    try {
      const nextPage = page + 1;
      const res = await getMyNotifications(nextPage, PAGE_LIMIT);
      dispatch(
        appendNotifications({
          notifications: res.data.notifications,
          limit: PAGE_LIMIT,
        }),
      );
    } catch {
      dispatch(setFetchingMore(false));
    } finally {
      loadingRef.current = false;
    }
  }, [dispatch, hasMore, isFetchingMore, page]);

  const handleMarkAsRead = useCallback(
    async (id: string) => {
      dispatch(markOneAsRead(id));
      try {
        await markAsRead(id);
      } catch {
        // optimistic update stays — minor UX tradeoff
      }
    },
    [dispatch],
  );

  const handleMarkAllAsRead = useCallback(async () => {
    dispatch(markAllRead());
    try {
      await markAllAsRead();
    } catch {
      // optimistic update stays
    }
  }, [dispatch]);

  return {
    items,
    unreadCount,
    hasMore,
    isLoading,
    isFetchingMore,
    fetchInitial,
    fetchMore,
    handleMarkAsRead,
    handleMarkAllAsRead,
  };
};
