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
  isOpen?: boolean;
  onClose?: () => void;
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
  isOpen,
  onClose,
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
    <>
      {/* Mobile Overlay */}
      <div
        className={`fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 transition-opacity duration-300 lg:hidden ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      <div
        className={`
        fixed lg:static inset-y-0 left-0 z-50
        flex flex-col h-full w-64 shrink-0 
        bg-[color:var(--color-surface)] text-[color:var(--color-foreground)] p-4 
        border-r border-[color:var(--color-border)] 
        transition-transform duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      `}
      >
      <div className="mb-8 pl-2">
        <Logo className="text-[color:var(--color-foreground)]" />
      </div>

      <div className="px-2 mb-6 text-[10px] font-black uppercase tracking-[0.2em] text-[color:var(--color-muted-foreground)]">
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
                  : "hover:bg-[color:var(--color-secondary)] text-[color:var(--color-muted-foreground)] hover:text-primary"
              }`}
            >
              <div className="flex items-center gap-3.5">
                <div
                  className={`transition-transform duration-200 group-hover/item:scale-110 ${isActive ? "text-white" : "text-[color:var(--color-muted)] group-hover/item:text-primary"}`}
                >
                  {item.icon}
                </div>
                <span
                  className={`text-sm tracking-tight ${isActive ? "font-black" : "font-bold"}`}
                >
                  {item.label}
                </span>
              </div>
            </button>
          );
        })}
      </nav>

      <div className="mt-auto border-t border-[color:var(--color-border)] pt-4">
        {role !== RoleTypes.ADMIN_USER && (
          <div className="flex items-center gap-3 px-3 py-2 mb-2">
            <button
              onClick={() => navigate(PAGE_ROUTES.PROFILE)}
              className="flex items-center gap-3 flex-1 min-w-0 text-left hover:bg-[color:var(--color-secondary)] p-1 rounded-lg transition-colors group"
            >
              <div className="w-9 h-9 flex items-center justify-center rounded-full bg-primary text-white font-bold text-sm overflow-hidden group-hover:scale-105 transition-transform">
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
                <p className="text-sm font-black text-[color:var(--color-foreground)] truncate">
                  {userName}
                </p>
                <p className="text-[10px] font-black uppercase tracking-widest text-[color:var(--color-muted-foreground)] truncate">
                  {role ? role.toLowerCase() : ""}
                </p>
              </div>
            </button>
            <button
              onClick={() => setIsLogoutModalOpen(true)}
              className="p-1.5 text-[color:var(--color-muted-foreground)] hover:text-primary hover:bg-[color:var(--color-secondary)] rounded-lg transition-colors"
            >
              <LogOut size={18} />
            </button>
          </div>
        )}
        {role === RoleTypes.ADMIN_USER && (
          <div className="flex items-center justify-between px-3 py-2 mb-2">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 flex items-center justify-center rounded-full bg-red-600/10 text-red-600 font-bold text-sm border border-red-200 dark:border-red-900/50">
                AD
              </div>
              <div>
                <p className="text-sm font-black text-[color:var(--color-foreground)]">
                  Admin
                </p>
                <p className="text-[10px] font-black uppercase tracking-widest text-red-500">
                  System
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsLogoutModalOpen(true)}
              className="p-1.5 text-[color:var(--color-muted-foreground)] hover:text-primary hover:bg-[color:var(--color-secondary)] rounded-lg transition-colors"
            >
              <LogOut size={18} />
            </button>
          </div>
        )}
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
    </>
  );
};

export default Sidebar;
