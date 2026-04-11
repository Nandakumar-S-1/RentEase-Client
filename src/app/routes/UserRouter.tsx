import { Routes, Route } from "react-router-dom";
import PublicRoute from "../guards/PublicRoute";
import ProtectedRoute from "../guards/ProtectedRoute";
import { PAGE_ROUTES } from "../../config/routes";

import RoleSelection from "../../features/auth/components/RoleSelection";
import Register from "../../features/auth/components/Register";
import Login from "../../features/auth/components/Login";
import VerifyOtp from "../../features/otp/components/VerifyOtp";
import ForgotPassword from "../../features/auth/components/ForgotPassword";
import Dashboard from "../../components/pages/Dashboard";
import OwnerVerification from "../../features/verification/components/OwnerVerification";
import ProfilePage from "../../features/profile/components/ProfilePage";
import ChatPage from "../../features/chat/components/ChatPage";
import NotFound from "../../components/common/NotFound";

export const UserRouter = () => {
  return (
    <Routes>
      <Route
        path={PAGE_ROUTES.HOME}
        element={
          <PublicRoute>
            <RoleSelection />
          </PublicRoute>
        }
      />
      <Route
        path={PAGE_ROUTES.REGISTER}
        element={
          <PublicRoute>
            <Register />
          </PublicRoute>
        }
      />
      <Route
        path={PAGE_ROUTES.LOGIN}
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />
      <Route
        path={PAGE_ROUTES.FORGOT_PASSWORD}
        element={
          <PublicRoute>
            <ForgotPassword />
          </PublicRoute>
        }
      />
      {/* partially protected means needs email or something */}
      <Route path={PAGE_ROUTES.VERIFY_OTP} element={<VerifyOtp />} />

      {/* Protected ocne */}
      <Route
        path={PAGE_ROUTES.DASHBOARD}
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path={PAGE_ROUTES.OWNER_VERIFICATION}
        element={
          <ProtectedRoute>
            <OwnerVerification />
          </ProtectedRoute>
        }
      />
      <Route
        path={PAGE_ROUTES.PROFILE}
        element={
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        }
      />
      <Route
        path={PAGE_ROUTES.MESSAGES}
        element={
          <ProtectedRoute>
            <ChatPage />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};
