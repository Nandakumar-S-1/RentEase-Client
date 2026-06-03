import React, { useCallback, useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import { Bell, Search, Settings, Menu } from "lucide-react";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import { useAppSelector } from "../../hooks/useAppSelector";
import { logout } from "../../features/auth/slices/AuthSlice";
import { resetNotifications, setUnreadCount } from "../../features/notifications/slices/notificationSlice";
import { RoleTypes } from "../../types/constants/role.constant";
import { useNavigate } from "react-router-dom";
import { PAGE_ROUTES } from "../../config/routes";
import {
  checkSession,
  logoutSession,
} from "../../features/auth/services/authService";
import type { RoleType } from "../../types/constants/role.constant";
import { ThemeToggle } from "./ThemeToggle";
import type { RootState } from "../../app/store/store";
import { NotificationDropdown } from "../../features/notifications/components/NotificationDropdown";
import { getUnreadCount } from "../../features/notifications/services/notificationService";

interface DashboardLayoutProps {
  children: React.ReactNode;
  role: RoleType;
  userName: string;
  hideSearch?: boolean;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  children,
  role,
  userName,
  hideSearch = true,
}) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user } = useAppSelector((state: RootState) => state.auth);
  const unreadCount = useAppSelector(
    (state: RootState) => state.notifications.unreadCount,
  );
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logoutSession();
    } catch {
      // ontinue with logout
    }
    dispatch(logout());
    dispatch(resetNotifications());
    const loginPath =
      role === RoleTypes.ADMIN_USER
        ? PAGE_ROUTES.ADMIN_LOGIN
        : PAGE_ROUTES.LOGIN;
    navigate(loginPath, { replace: true });
  };

  const handleCloseNotif = useCallback(() => setIsNotifOpen(false), []);

  useEffect(() => {
    checkSession().catch(() => {});
  }, []);

  useEffect(() => {
    const fetchUnread = async () => {
      try {
        const res = await getUnreadCount();
        dispatch(setUnreadCount(res.data.unreadCount));
      } catch (err) {
        console.error("Failed to fetch unread notification count:", err);
      }
    };
    if (user) {
      fetchUnread();
    }
  }, [dispatch, user]);

  return (
    <div className="flex h-screen bg-[color:var(--color-background)] overflow-hidden font-sans">
      <Sidebar
        role={role}
        userName={userName}
        avatarUrl={user?.avatarUrl}
        onLogout={handleLogout}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Responsive Header */}
        <header className="h-16 bg-[color:var(--color-surface)] border-b border-[color:var(--color-border)] flex items-center justify-between px-4 lg:px-8 shrink-0 z-30">
          <div className="flex items-center gap-4 flex-1">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 -ml-2 text-slate-600 lg:hidden hover:bg-slate-100 rounded-lg transition-colors"
            >
              <Menu size={24} />
            </button>

            <div className="flex-1 max-w-xl hidden md:block">
              {!hideSearch && (
                <div className="relative group">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-[color:var(--color-muted-foreground)] group-focus-within:text-primary transition-colors">
                    <Search size={18} />
                  </span>
                  <input
                    type="text"
                    placeholder="Search properties, agreements..."
                    className="block w-full pl-10 pr-3 py-2 border border-[color:var(--color-border)] rounded-xl bg-[color:var(--color-background)] text-sm text-[color:var(--color-foreground)] placeholder:text-[color:var(--color-muted-foreground)] focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  />
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 md:gap-4">
            <ThemeToggle />
            {/* Notification bell */}
            <div className="relative">
              <button
                onClick={() => setIsNotifOpen((prev) => !prev)}
                className="relative p-2 text-[color:var(--color-muted-foreground)] hover:text-[color:var(--color-foreground)] hover:bg-[color:var(--color-secondary)] rounded-lg transition-all"
              >
                <Bell size={20} />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 flex items-center justify-center min-w-[16px] h-4 px-0.5 text-[10px] font-bold bg-danger text-white rounded-full border-2 border-[color:var(--color-surface)]">
                    {unreadCount > 99 ? "99+" : unreadCount}
                  </span>
                )}
              </button>
              <NotificationDropdown
                isOpen={isNotifOpen}
                onClose={handleCloseNotif}
              />
            </div>
            <button
              onClick={() =>
                navigate(
                  role === RoleTypes.ADMIN_USER
                    ? PAGE_ROUTES.ADMIN_SETTINGS
                    : PAGE_ROUTES.PROFILE,
                )
              }
              className="p-2 text-[color:var(--color-muted-foreground)] hover:text-[color:var(--color-foreground)] hover:bg-[color:var(--color-secondary)] rounded-lg transition-all"
            >
              <Settings size={20} />
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto bg-[color:var(--color-background)]">
          <div className="max-w-[1600px] mx-auto p-4 md:p-6 lg:p-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
