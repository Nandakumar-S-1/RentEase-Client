import { Routes, Route } from "react-router-dom";
import PublicRoute from "../guards/PublicRoute";
import ProtectedRoute from "../guards/ProtectedRoute";

import AdminLogin from "../../features/admin/components/AdminLogin"; 
import AdminDashboard from "../../features/admin/components/AdminDashboard"; 
import AdminUserManagement from "../../features/admin/components/AdminUserManagement"; 
import AdminOwnerVerification from "../../features/admin/components/AdminOwnerVerification";

export const AdminRouter = () => {
  return (
    <Routes>
      <Route 
        path="/login"
        element={<PublicRoute><AdminLogin /></PublicRoute>}
      />
      <Route
        path="/users"
        element={<ProtectedRoute><AdminUserManagement /></ProtectedRoute>}
      />
      <Route
        path="/dashboard"
        element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>}
      />
      <Route
        path="/owners"
        element={<ProtectedRoute><AdminOwnerVerification /></ProtectedRoute>}
      />
    </Routes>
  );
};
