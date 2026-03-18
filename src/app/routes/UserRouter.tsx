import { Routes, Route } from "react-router-dom";
import PublicRoute from "../guards/PublicRoute";
import ProtectedRoute from "../guards/ProtectedRoute";
import { PAGE_ROUTES } from "../../config/routes";

// Lazy imports (or direct imports)
import RoleSelection from "../../features/auth/components/RoleSelection"; 
import Register from "../../features/auth/components/Register"; 
import Login from "../../features/auth/components/Login"; 
import VerifyOtp from "../../features/otp/components/VerifyOtp"; 
import ResendOtp from "../../features/otp/components/ResendOtp"; 
import ForgotPassword from "../../features/auth/components/ForgotPassword"; 
import Dashboard from "../../components/pages/Dashboard";

export const UserRouter = () => {
  return (
    <Routes>
      {/* common once */}
      <Route
        path={PAGE_ROUTES.HOME}
        element={<PublicRoute><RoleSelection /></PublicRoute>}
      />
      <Route
        path={PAGE_ROUTES.REGISTER}
        element={<PublicRoute><Register /></PublicRoute>}
      />
      <Route
        path={PAGE_ROUTES.LOGIN}
        element={<PublicRoute><Login /></PublicRoute>}
      />
      <Route
        path={PAGE_ROUTES.FORGOT_PASSWORD}
        element={<PublicRoute><ForgotPassword /></PublicRoute>}
      />
      <Route
        path={PAGE_ROUTES.RESEND_OTP}
        element={<PublicRoute><ResendOtp /></PublicRoute>}
      />

      {/* partially protected means needs email or something */}
      <Route path={PAGE_ROUTES.VERIFY_OTP} element={<VerifyOtp />} />

      {/* Protected ocne */}
      <Route
        path={PAGE_ROUTES.DASHBOARD}
        element={<ProtectedRoute><Dashboard /></ProtectedRoute>}
      />
    </Routes>
  );
};
