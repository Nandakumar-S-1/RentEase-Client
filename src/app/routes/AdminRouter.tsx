import { useMemo } from "react";
import { Routes, Route } from "react-router-dom";
import PublicRoute from "../guards/PublicRoute";
import ProtectedRoute from "../guards/ProtectedRoute";
import DashboardLayout from "../../components/common/DashboardLayout";

import AdminLogin from "../../features/admin/components/AdminLogin";
import AdminDashboard from "../../features/admin/components/AdminDashboard";
import AdminUserManagement from "../../features/admin/components/AdminUserManagement";
import AdminUserDetail from "../../features/admin/components/AdminUserDetail";
import AdminOwnerVerification from "../../features/admin/components/AdminOwnerVerification";
import { RoleTypes } from "../../types/constants/role.constant";
import type { RoleType } from "../../types/constants/role.constant";
import { PATH_ROUTES } from "../../config/routes";
import NotFound from "../../components/common/NotFound";

function parseStoredUser() {
  const storedUser = localStorage.getItem("user");
  if (!storedUser) return null;

  try {
    return JSON.parse(storedUser) as { fullname: string; role: RoleType };
  } catch {
    localStorage.removeItem("user");
    return null;
  }
}

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  const user = useMemo<{ fullname: string; role: RoleType } | null>(() => {
    return parseStoredUser();
  }, []);

  if (!user)
    return (
      <div className="flex items-center justify-center h-screen font-bold text-primary">
        Loading...
      </div>
    );

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
        element={
          <PublicRoute>
            <AdminLogin />
          </PublicRoute>
        }
      />
      <Route
        path={PATH_ROUTES.PATH_USERS}
        element={
          <ProtectedRoute>
            <AdminLayout>
              <AdminUserManagement />
            </AdminLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path={PATH_ROUTES.PATH_DETAILS}
        element={
          <ProtectedRoute>
            <AdminLayout>
              <AdminUserDetail />
            </AdminLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path={PATH_ROUTES.PATH_DASHBOARD}
        element={
          <ProtectedRoute>
            <AdminLayout>
              <AdminDashboard />
            </AdminLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path={PATH_ROUTES.PATH_OWNERS}
        element={
          <ProtectedRoute>
            <AdminLayout>
              <AdminOwnerVerification />
            </AdminLayout>
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};
