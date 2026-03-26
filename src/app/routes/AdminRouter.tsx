import { useMemo } from "react";
import { Routes, Route } from "react-router-dom";
import PublicRoute from "../guards/PublicRoute";
import ProtectedRoute from "../guards/ProtectedRoute";
import DashboardLayout from "../../components/common/DashboardLayout";

import AdminLogin from "../../features/admin/components/AdminLogin"; 
import AdminDashboard from "../../features/admin/components/AdminDashboard"; 
import AdminUserManagement from "../../features/admin/components/AdminUserManagement"; 
import AdminOwnerVerification from "../../features/admin/components/AdminOwnerVerification";
import { RoleTypes } from "../../types/Constants/role.constant";
import type { RoleType } from "../../types/Constants/role.constant"; 
import { PATH_ROUTES } from "../../config/routes";

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  const user = useMemo<{ fullname: string; role: RoleType } | null>(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  }, []);

  if (!user) return <div className="flex items-center justify-center h-screen font-bold text-primary">Loading...</div>;

  return (
    <DashboardLayout role={RoleTypes.ADMIN_USER} userName={user.fullname}>
      {children}
    </DashboardLayout>
  );
};

export const AdminRouter = () => {
  return (
    <Routes>
      <Route 
        path={PATH_ROUTES.PATH_LOGIN}
        element={<PublicRoute><AdminLogin /></PublicRoute>}
      />
      <Route
        path={PATH_ROUTES.PATH_USERS}
        element={<ProtectedRoute><AdminLayout><AdminUserManagement /></AdminLayout></ProtectedRoute>}
      />
      <Route
        path={PATH_ROUTES.PATH_DASHBOARD}
        element={<ProtectedRoute><AdminLayout><AdminDashboard /></AdminLayout></ProtectedRoute>}
      />
      <Route
        path={PATH_ROUTES.PATH_OWNERS}
        element={<ProtectedRoute><AdminLayout><AdminOwnerVerification /></AdminLayout></ProtectedRoute>}
      />
    </Routes>
  );
};
