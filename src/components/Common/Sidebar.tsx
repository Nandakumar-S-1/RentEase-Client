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
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import Logo from "./Logo";
import { Modal } from "./index";
import { RoleTypes, type RoleType } from "../../types/constants/role.constant";
import { PAGE_ROUTES } from "../../config/routes";

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

const Sidebar: React.FC<SidebarProps> = ({ role, userName, avatarUrl, onLogout }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const menuItems: Record<RoleType, SidebarMenuItem[]> = {
    [RoleTypes.OWNER_USER]: [
      {
        icon: <LayoutDashboard size={20} />,
        label: "Dashboard",
        path: "/dashboard",
      },
      {
        icon: <Building2 size={20} />,
        label: "My Properties",
        path: "/owner/properties",
      },
      {
        icon: <FileText size={20} />,
        label: "Agreements",
        path: "/owner/agreements",
      },
      {
        icon: <CreditCard size={20} />,
        label: "Payments",
        path: "/owner/payments",
      },
      {
        icon: <Wrench size={20} />,
        label: "Maintenance",
        path: "/owner/maintenance",
      },
      {
        icon: <MessageSquare size={20} />,
        label: "Messages",
        path: PAGE_ROUTES.MESSAGES,
      },
      {
        icon: <Bookmark size={20} />,
        label: "Subscription",
        path: "/owner/subscription",
      },
    ],
    [RoleTypes.TENANT_USER]: [
      {
        icon: <LayoutDashboard size={20} />,
        label: "Dashboard",
        path: "/dashboard",
      },
      {
        icon: <Building2 size={20} />,
        label: "Find Property",
        path: "/tenant/search",
      },
      {
        icon: <FileText size={20} />,
        label: "Agreement",
        path: "/tenant/agreements",
      },
      {
        icon: <CreditCard size={20} />,
        label: "Payments",
        path: "/tenant/payments",
      },
      {
        icon: <Wrench size={20} />,
        label: "Maintenance",
        path: "/tenant/maintenance",
      },
      {
        icon: <MessageSquare size={20} />,
        label: "Messages",
        path: PAGE_ROUTES.MESSAGES,
      },
      {
        icon: <Bookmark size={20} />,
        label: "Wishlist",
        path: "/tenant/wishlist",
      },
    ],
    [RoleTypes.ADMIN_USER]: [
      {
        icon: <LayoutDashboard size={20} />,
        label: "Dashboard",
        path: "/dashboard",
      },
      {
        icon: <Users size={20} />,
        label: "User Management",
        path: "/admin/users",
      },
      {
        icon: <ShieldCheck size={20} />,
        label: "Owner Verification",
        path: "/admin/owners",
      },
      {
        icon: <Building2 size={20} />,
        label: "Properties",
        path: "/admin/properties",
      },
      {
        icon: <FileText size={20} />,
        label: "Agreements",
        path: "/admin/agreements",
      },
      {
        icon: <CreditCard size={20} />,
        label: "Payments",
        path: "/admin/payments",
      },
      {
        icon: <Flag size={20} />,
        label: "Flagged Content",
        path: "/admin/flagged",
      },
      {
        icon: <BarChart3 size={20} />,
        label: "Analytics",
        path: "/admin/analytics",
      },
      {
        icon: <Settings size={20} />,
        label: "Settings",
        path: "/admin/settings",
      },
    ],
  };

  const currentMenu = menuItems[role] || [];

  return (
    <div className="flex flex-col h-full w-64 shrink-0 bg-[color:var(--color-surface)] text-gray-600 dark:text-gray-300 p-4 border border-[color:var(--color-border)] rounded-2xl">
      <div className="mb-8 pl-2">
        <Logo className="text-gray-900 dark:text-white" />
      </div>

      <div className="px-2 mb-6 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-500">
        {role ? role.charAt(0) + role.slice(1).toLowerCase() : ""} Dashboard
      </div>

      <nav className="flex-1 space-y-1">
        {currentMenu.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <button
              key={item.label}
              onClick={() => navigate(item.path)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-colors ${
                isActive
                  ? "bg-primary text-white"
                  : "hover:bg-gray-100 hover:text-gray-900 dark:hover:bg-white/10 dark:hover:text-white"
              }`}
            >
              <div className="flex items-center gap-3">
                {item.icon}
                <span className="text-sm font-medium">{item.label}</span>
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
                <img src={avatarUrl} alt={userName} className="w-full h-full object-cover" />
              ) : (
                userName
                  ? userName
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                  : "??"
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                {userName}
              </p>
              <p className="text-xs text-gray-500 truncate">
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
        title="Confirm Logout"
        description="Are you sure you want to log out of your account?"
        confirmText="Log Out"
        isDestructive={true}
      />
    </div>
  );
};

export default Sidebar;
