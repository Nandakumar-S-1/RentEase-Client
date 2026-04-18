import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAppSelector } from "../../hooks/useAppSelector";
import { PAGE_ROUTES } from "../../config/routes";
import { RoleTypes } from "../../types/constants/role.constant";
import { VerificationStatus } from "../../features/auth/types/verification.types";
//This is used for pages that require the user to be logged in.
interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const user = useAppSelector((state) => state.auth.user);
  const location = useLocation();

  if (!isAuthenticated) {
    const isAdminPath = location.pathname.startsWith("/admin");
    return (
      <Navigate
        to={isAdminPath ? PAGE_ROUTES.ADMIN_LOGIN : PAGE_ROUTES.LOGIN}
        replace
      />
    );
  }

  const isAtVerifyPage = location.pathname === PAGE_ROUTES.OWNER_VERIFICATION;
  if (
    !isAtVerifyPage &&
    user?.role === RoleTypes.OWNER_USER &&
    user?.verificationStatus !== VerificationStatus.STATUS_VERIFIED
  ) {
    return <Navigate to={PAGE_ROUTES.OWNER_VERIFICATION} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
