import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAppSelector } from "../../hooks/useAppSelector";
import { PAGE_ROUTES } from "../../config/routes";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const user = useAppSelector((state) => state.auth.user);
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to={PAGE_ROUTES.LOGIN} replace />;
  }

  const isOnVerifyPage = location.pathname === PAGE_ROUTES.OWNER_VERIFICATION;
  if (
    !isOnVerifyPage &&
    user?.role === "OWNER" &&
    user?.verificationStatus !== "VERIFIED"
  ) {
    return <Navigate to={PAGE_ROUTES.OWNER_VERIFICATION} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
