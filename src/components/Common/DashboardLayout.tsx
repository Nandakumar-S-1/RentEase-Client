import React, { useEffect } from "react";
import Sidebar from "./Sidebar";
import { Bell, Search, Settings } from "lucide-react";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import { useAppSelector } from "../../hooks/useAppSelector";
import { logout } from "../../features/auth/slices/AuthSlice";
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

interface DashboardLayoutProps {
  children: React.ReactNode;
  role: RoleType;
  userName: string;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  children,
  role,
  userName,
}) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user } = useAppSelector((state: RootState) => state.auth);

  const handleLogout = async () => {
    try {
      await logoutSession();
    } catch {
      // ontinue with logout
    }
    dispatch(logout());
    const loginPath =
      role === RoleTypes.ADMIN_USER
        ? PAGE_ROUTES.ADMIN_LOGIN
        : PAGE_ROUTES.LOGIN;
    navigate(loginPath, { replace: true });
  };

  useEffect(() => {
    checkSession().catch(() => {});
  }, []);

  return (
    <div className="flex h-screen bg-[color:var(--color-background)] overflow-hidden font-sans p-4 gap-4">
      <Sidebar
        role={role}
        userName={userName}
        avatarUrl={user?.avatarUrl}
        onLogout={handleLogout}
      />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-16 bg-[color:var(--color-surface)] border border-[color:var(--color-border)] flex items-center justify-between px-6 shrink-0 rounded-2xl">
          <div className="flex-1 max-w-xl">
            <div className="relative group">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400 group-focus-within:text-primary transition-colors">
                <Search size={18} />
              </span>
              <input
                type="text"
                placeholder="Search anything..."
                className="block w-full pl-10 pr-3 py-2 border border-[color:var(--color-border)] rounded-xl bg-[color:var(--color-card)] text-sm text-[color:var(--color-foreground)] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              />
            </div>
          </div>

          <div className="flex items-center gap-4 ml-4">
            <ThemeToggle />
            <button className="relative p-2 text-gray-400 hover:text-gray-600 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-white/10 rounded-lg transition-all">
              <Bell size={20} />
              <span className="absolute top-1.5 right-1.5 flex items-center justify-center w-4 h-4 text-[10px] font-bold bg-danger text-white rounded-full border-2 border-white">
                3
              </span>
            </button>
            <button
              onClick={() => navigate(PAGE_ROUTES.PROFILE)}
              className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-white/10 rounded-lg transition-all"
            >
              <Settings size={20} />
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto custom-scrollbar pt-4">
          <div className="h-full bg-[color:var(--color-surface)] border border-[color:var(--color-border)] rounded-2xl p-6 overflow-hidden">
            <div className="h-full overflow-y-auto custom-scrollbar pr-1">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
