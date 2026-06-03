import React, { useCallback, useEffect, useRef } from "react";
import {
  Bell,
  CheckCheck,
  FileText,
  Home,
  MessageSquare,
  ShieldCheck,
  ShieldX,
  UserX,
  X,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useNotifications } from "../hooks/useNotifications";
import type { Notification, NotificationType } from "../types/notificationTypes";
import { formatDistanceToNow } from "../../../utils/dateUtils";

interface NotificationDropdownProps {
  isOpen: boolean;
  onClose: () => void;
}

const getNotificationMeta = (
  type: NotificationType,
): { icon: React.ReactNode; color: string } => {
  switch (type) {
    case "OWNER_VERIFICATION_APPROVED":
      return {
        icon: <ShieldCheck size={16} />,
        color: "text-green-500 bg-green-50 dark:bg-green-500/10",
      };
    case "OWNER_VERIFICATION_REJECTED":
      return {
        icon: <ShieldX size={16} />,
        color: "text-red-500 bg-red-50 dark:bg-red-500/10",
      };
    case "OWNER_VERIFICATION_SUBMITTED":
      return {
        icon: <ShieldCheck size={16} />,
        color: "text-blue-500 bg-blue-50 dark:bg-blue-500/10",
      };
    case "PROPERTY_APPROVED":
      return {
        icon: <Home size={16} />,
        color: "text-green-500 bg-green-50 dark:bg-green-500/10",
      };
    case "PROPERTY_REJECTED":
    case "PROPERTY_UNLISTED":
      return {
        icon: <Home size={16} />,
        color: "text-red-500 bg-red-50 dark:bg-red-500/10",
      };
    case "PROPERTY_SUBMITTED":
      return {
        icon: <Home size={16} />,
        color: "text-blue-500 bg-blue-50 dark:bg-blue-500/10",
      };
    case "USER_SUSPENDED":
      return {
        icon: <UserX size={16} />,
        color: "text-orange-500 bg-orange-50 dark:bg-orange-500/10",
      };
    case "AGREEMENT_CREATED":
    case "AGREEMENT_SIGNED":
      return {
        icon: <FileText size={16} />,
        color: "text-blue-500 bg-blue-50 dark:bg-blue-500/10",
      };
    case "NEW_MESSAGE":
      return {
        icon: <MessageSquare size={16} />,
        color: "text-purple-500 bg-purple-50 dark:bg-purple-500/10",
      };
    default:
      return {
        icon: <Bell size={16} />,
        color:
          "text-[color:var(--color-muted-foreground)] bg-[color:var(--color-secondary)]",
      };
  }
};

interface NotificationItemProps {
  notification: Notification;
  onRead: (id: string) => void;
  onClose: () => void;
}

const NotificationItem: React.FC<NotificationItemProps> = ({
  notification,
  onRead,
  onClose,
}) => {
  const navigate = useNavigate();
  const { icon, color } = getNotificationMeta(
    notification.notificationType as NotificationType,
  );

  const handleClick = () => {
    if (!notification.isRead) {
      onRead(notification.id);
    }
    if (notification.actionUrl) {
      navigate(notification.actionUrl);
    }
    onClose();
  };

  return (
    <div
      onClick={handleClick}
      className={`flex items-start gap-3 px-4 py-3 cursor-pointer transition-colors hover:bg-[color:var(--color-secondary)] ${
        !notification.isRead
          ? "bg-[color:var(--color-secondary)]/40"
          : ""
      }`}
    >
      {/* Type icon */}
      <div
        className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center mt-0.5 ${color}`}
      >
        {icon}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p
          className={`text-sm leading-snug ${
            !notification.isRead
              ? "font-semibold text-[color:var(--color-foreground)]"
              : "font-medium text-[color:var(--color-foreground)]"
          }`}
        >
          {notification.title}
        </p>
        <p className="text-xs text-[color:var(--color-muted-foreground)] mt-0.5 line-clamp-2">
          {notification.message}
        </p>
        <p className="text-[11px] text-[color:var(--color-muted-foreground)] mt-1">
          {formatDistanceToNow(notification.createdAt)}
        </p>
      </div>

      {/* Unread dot */}
      {!notification.isRead && (
        <span className="flex-shrink-0 w-2 h-2 rounded-full bg-primary mt-2" />
      )}
    </div>
  );
};

export const NotificationDropdown: React.FC<NotificationDropdownProps> = ({
  isOpen,
  onClose,
}) => {
  const {
    items,
    unreadCount,
    hasMore,
    isLoading,
    isFetchingMore,
    fetchInitial,
    fetchMore,
    handleMarkAsRead,
    handleMarkAllAsRead,
  } = useNotifications();

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Fetch on open
  useEffect(() => {
    if (isOpen) {
      fetchInitial();
    }
  }, [isOpen, fetchInitial]);

  // Close on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleOutsideClick);
    }
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [isOpen, onClose]);

  // Infinite scroll handler
  const handleScroll = useCallback(() => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const { scrollTop, scrollHeight, clientHeight } = el;
    if (scrollHeight - scrollTop - clientHeight < 80) {
      fetchMore();
    }
  }, [fetchMore]);

  if (!isOpen) return null;

  return (
    <div
      ref={dropdownRef}
      className="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-[color:var(--color-surface)] border border-[color:var(--color-border)] rounded-2xl shadow-xl overflow-hidden z-50"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-[color:var(--color-border)]">
        <div className="flex items-center gap-2">
          <Bell size={16} className="text-[color:var(--color-foreground)]" />
          <span className="font-semibold text-sm text-[color:var(--color-foreground)]">
            Notifications
          </span>
          {unreadCount > 0 && (
            <span className="text-[11px] font-bold bg-primary text-white rounded-full px-1.5 py-0.5 leading-none">
              {unreadCount > 99 ? "99+" : unreadCount}
            </span>
          )}
        </div>
        <div className="flex items-center gap-1">
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllAsRead}
              className="flex items-center gap-1 text-xs text-primary hover:text-primary/80 transition-colors px-2 py-1 rounded-lg hover:bg-primary/10"
              title="Mark all as read"
            >
              <CheckCheck size={14} />
              <span>All read</span>
            </button>
          )}
          <button
            onClick={onClose}
            className="p-1.5 text-[color:var(--color-muted-foreground)] hover:text-[color:var(--color-foreground)] hover:bg-[color:var(--color-secondary)] rounded-lg transition-colors"
          >
            <X size={16} />
          </button>
        </div>
      </div>

      {/* Scrollable list */}
      <div
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className="overflow-y-auto max-h-[420px] divide-y divide-[color:var(--color-border)]"
      >
        {isLoading ? (
          <NotificationSkeletons />
        ) : items.length === 0 ? (
          <EmptyNotifications />
        ) : (
          <>
            {items.map((notification) => (
              <NotificationItem
                key={notification.id}
                notification={notification}
                onRead={handleMarkAsRead}
                onClose={onClose}
              />
            ))}

            {isFetchingMore && (
              <div className="flex justify-center py-3">
                <span className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              </div>
            )}

            {!hasMore && items.length > 0 && (
              <p className="text-center text-xs text-[color:var(--color-muted-foreground)] py-3">
                You're all caught up
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
};

const NotificationSkeletons: React.FC = () => (
  <>
    {Array.from({ length: 4 }).map((_, i) => (
      <div key={i} className="flex items-start gap-3 px-4 py-3 animate-pulse">
        <div className="w-8 h-8 rounded-full bg-[color:var(--color-border)] flex-shrink-0" />
        <div className="flex-1 space-y-2 pt-0.5">
          <div className="h-3 bg-[color:var(--color-border)] rounded w-3/4" />
          <div className="h-3 bg-[color:var(--color-border)] rounded w-full" />
          <div className="h-2.5 bg-[color:var(--color-border)] rounded w-1/4" />
        </div>
      </div>
    ))}
  </>
);

const EmptyNotifications: React.FC = () => (
  <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
    <div className="w-12 h-12 rounded-full bg-[color:var(--color-secondary)] flex items-center justify-center mb-3">
      <Bell size={22} className="text-[color:var(--color-muted-foreground)]" />
    </div>
    <p className="text-sm font-medium text-[color:var(--color-foreground)]">
      No notifications yet
    </p>
    <p className="text-xs text-[color:var(--color-muted-foreground)] mt-1">
      We'll let you know when something happens
    </p>
  </div>
);
