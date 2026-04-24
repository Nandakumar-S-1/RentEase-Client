import React, { useState } from "react";
import {
  LayoutDashboard,
  Building2,
  FileText,
  CreditCard,
  Wrench,
  MessageSquare,
  Settings,
  LogOut,
  Users,
  Flag,
  BarChart3,
  Bookmark,
  ShieldCheck,
  Search,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import Logo from "./Logo";
import { Modal } from "./index";
import { RoleTypes, type RoleType } from "../../types/constants/role.constant";
import { PAGE_ROUTES } from "../../config/routes";
import { LABELS } from "../../types/constants/label.constants";

interface SidebarProps {
  role: RoleType;
  userName: string;
  avatarUrl?: string | null;
  onLogout: () => void;
}

type SidebarMenuItem = {
  icon: React.ReactNode;
  label: string;
  path: string;
};

const Sidebar: React.FC<SidebarProps> = ({
  role,
  userName,
  avatarUrl,
  onLogout,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const menuItems: Record<RoleType, SidebarMenuItem[]> = {
    [RoleTypes.OWNER_USER]: [
      {
        icon: <LayoutDashboard size={20} />,
        label: LABELS.DASHBOARD,
        path: PAGE_ROUTES.DASHBOARD,
      },
      {
        icon: <Building2 size={20} />,
        label: LABELS.MY_PROPERTIES,
        path: PAGE_ROUTES.OWNER_PROPERTIES,
      },
      {
        icon: <Search size={20} />,
        label: LABELS.FIND_PROPERTY,
        path: PAGE_ROUTES.SEARCH_PROPERTIES,
      },
      {
        icon: <FileText size={20} />,
        label: LABELS.AGREEMENTS,
        path: PAGE_ROUTES.OWNER_AGREEMENTS,
      },
      {
        icon: <CreditCard size={20} />,
        label: LABELS.PAYMENTS,
        path: PAGE_ROUTES.OWNER_PAYMENTS,
      },
      {
        icon: <Wrench size={20} />,
        label: LABELS.MAINTENANCE,
        path: PAGE_ROUTES.OWNER_MAINTENANCE,
      },
      {
        icon: <MessageSquare size={20} />,
        label: LABELS.MESSAGES,
        path: PAGE_ROUTES.MESSAGES,
      },
      {
        icon: <Bookmark size={20} />,
        label: LABELS.SUBSCRIPTION,
        path: PAGE_ROUTES.OWNER_SUBSCRIPTION,
      },
    ],
    [RoleTypes.TENANT_USER]: [
      {
        icon: <LayoutDashboard size={20} />,
        label: LABELS.DASHBOARD,
        path: PAGE_ROUTES.DASHBOARD,
      },
      {
        icon: <Building2 size={20} />,
        label: LABELS.FIND_PROPERTY,
        path: PAGE_ROUTES.SEARCH_PROPERTIES,
      },
      {
        icon: <FileText size={20} />,
        label: LABELS.AGREEMENT,
        path: PAGE_ROUTES.TENANT_AGREEMENTS,
      },

      {
        icon: <CreditCard size={20} />,
        label: LABELS.PAYMENTS,
        path: PAGE_ROUTES.TENANT_PAYMENTS,
      },
      {
        icon: <Wrench size={20} />,
        label: LABELS.MAINTENANCE,
        path: PAGE_ROUTES.TENANT_MAINTENANCE,
      },
      {
        icon: <MessageSquare size={20} />,
        label: LABELS.MESSAGES,
        path: PAGE_ROUTES.MESSAGES,
      },
      {
        icon: <Bookmark size={20} />,
        label: LABELS.WISHLIST,
        path: PAGE_ROUTES.TENANT_WISHLIST,
      },
    ],
    [RoleTypes.ADMIN_USER]: [
      {
        icon: <LayoutDashboard size={20} />,
        label: LABELS.DASHBOARD,
        path: PAGE_ROUTES.DASHBOARD,
      },
      {
        icon: <Users size={20} />,
        label: LABELS.USER_MANAGEMENT,
        path: PAGE_ROUTES.ADMIN_USERS,
      },
      {
        icon: <ShieldCheck size={20} />,
        label: LABELS.OWNER_VERIFICATION,
        path: PAGE_ROUTES.ADMIN_OWNERS,
      },
      {
        icon: <Building2 size={20} />,
        label: LABELS.PROPERTIES,
        path: PAGE_ROUTES.ADMIN_PROPERTIES,
      },
      {
        icon: <FileText size={20} />,
        label: LABELS.AGREEMENTS,
        path: PAGE_ROUTES.ADMIN_AGREEMENTS,
      },
      {
        icon: <CreditCard size={20} />,
        label: LABELS.PAYMENTS,
        path: PAGE_ROUTES.ADMIN_PAYMENTS,
      },
      {
        icon: <Flag size={20} />,
        label: LABELS.FLAGGED_CONTENT,
        path: PAGE_ROUTES.ADMIN_FLAGGED,
      },
      {
        icon: <BarChart3 size={20} />,
        label: LABELS.ANALYTICS,
        path: PAGE_ROUTES.ADMIN_ANALYTICS,
      },
      {
        icon: <Settings size={20} />,
        label: LABELS.SETTINGS,
        path: PAGE_ROUTES.ADMIN_SETTINGS,
      },
    ],
  };

  const currentMenu = menuItems[role] || [];

  return (
    <div className="flex flex-col h-full w-64 shrink-0 bg-[color:var(--color-surface)] text-slate-600 dark:text-gray-300 p-4 border border-[color:var(--color-border)] rounded-2xl transition-colors duration-300">
      <div className="mb-8 pl-2">
        <Logo className="text-gray-900 dark:text-white" />
      </div>

      <div className="px-2 mb-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-gray-500">
        {role ? role.charAt(0) + role.slice(1).toLowerCase() : ""} Dashboard
      </div>

      <nav className="flex-1 space-y-1">
        {currentMenu.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <button
              key={item.label}
              onClick={() => navigate(item.path)}
              className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl transition-all duration-200 group/item ${
                isActive
                  ? "bg-primary text-white shadow-lg shadow-primary/20"
                  : "hover:bg-slate-50 dark:hover:bg-white/5 text-slate-600 hover:text-slate-900 dark:text-gray-400 dark:hover:text-white"
              }`}
            >
              <div className="flex items-center gap-3.5">
                <div className={`transition-transform duration-200 group-hover/item:scale-110 ${isActive ? "text-white" : "text-slate-400 group-hover/item:text-primary dark:text-gray-500"}`}>
                  {item.icon}
                </div>
                <span className={`text-sm tracking-tight ${isActive ? "font-black" : "font-bold"}`}>{item.label}</span>
              </div>
            </button>
          );
        })}
      </nav>

      <div className="mt-auto border-t border-[color:var(--color-border)] pt-4">
        <div className="flex items-center gap-3 px-3 py-2 mb-2">
          <button
            onClick={() => navigate(PAGE_ROUTES.PROFILE)}
            className="flex items-center gap-3 flex-1 min-w-0 text-left hover:bg-gray-100 dark:hover:bg-white/10 p-1 rounded-lg transition-colors group"
          >
            <div className="w-9 h-9 flex items-center justify-center rounded-full bg-[#4338ca] text-white font-bold text-sm overflow-hidden group-hover:scale-105 transition-transform">
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt={userName}
                  className="w-full h-full object-cover"
                />
              ) : userName ? (
                userName
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
              ) : (
                "??"
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-black text-slate-900 dark:text-white truncate">
                {userName}
              </p>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-gray-500 truncate">
                {role ? role.toLowerCase() : ""}
              </p>
            </div>
          </button>
          <button
            onClick={() => setIsLogoutModalOpen(true)}
            className="p-1.5 hover:bg-gray-100 dark:hover:bg-white/10 rounded-lg transition-colors"
          >
            <LogOut size={18} />
          </button>
        </div>
      </div>

      <Modal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={() => {
          setIsLogoutModalOpen(false);
          onLogout();
        }}
        title={LABELS.CONFIRM_LOGOUT}
        description={LABELS.LOGOUT_DESCRIPTION}
        confirmText={LABELS.LOGOUT}
        isDestructive={true}
      />

    </div>
  );
};

export default Sidebar;
