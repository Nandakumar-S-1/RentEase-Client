import { useMemo, lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import PublicRoute from "../guards/PublicRoute";
import ProtectedRoute from "../guards/ProtectedRoute";
import DashboardLayout from "../../components/common/DashboardLayout";
import { RoleTypes } from "../../types/constants/role.constant";
import type { RoleType } from "../../types/constants/role.constant";
import { PATH_ROUTES } from "../../config/routes";
import { LoadingOverlay } from "../../components/common";

// Lazy load components
const AdminLogin = lazy(
  () => import("../../features/admin/components/AdminLogin"),
);
const AdminDashboard = lazy(
  () => import("../../features/admin/components/AdminDashboard"),
);
const AdminUserManagement = lazy(
  () => import("../../features/admin/components/AdminUserManagement"),
);
const AdminUserDetail = lazy(
  () => import("../../features/admin/components/AdminUserDetail"),
);
const AdminOwnerVerification = lazy(
  () => import("../../features/admin/components/AdminOwnerVerification"),
);
const AdminProperties = lazy(
  () => import("../../features/admin/components/AdminProperties"),
);
const AdminPropertyDetails = lazy(
  () => import("../../features/admin/components/AdminPropertyDetails"),
);
const NotFound = lazy(() => import("../../components/common/NotFound"));

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

  if (!user) return <LoadingOverlay />;

  return (
    <DashboardLayout role={RoleTypes.ADMIN_USER} userName={user.fullname}>
      {children}
    </DashboardLayout>
  );
};

export const AdminRouter = () => {
  return (
    <Suspense fallback={<LoadingOverlay />}>
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
          path={PATH_ROUTES.PATH_USER_DETAILS}
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
        <Route
          path={PATH_ROUTES.PATH_PROPERTIES}
          element={
            <ProtectedRoute>
              <AdminLayout>
                <AdminProperties />
              </AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path={PATH_ROUTES.PATH_PROPERTY_DETAILS}
          element={
            <ProtectedRoute>
              <AdminLayout>
                <AdminPropertyDetails />
              </AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
};
