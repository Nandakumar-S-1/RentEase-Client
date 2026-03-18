import React from "react";
import { Navigate } from "react-router-dom";
import { useAppSelector } from "../../hooks/useAppSelector";
import { PAGE_ROUTES } from "../../config/routes";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

  if (!isAuthenticated) {
    return <Navigate to={PAGE_ROUTES.LOGIN} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
