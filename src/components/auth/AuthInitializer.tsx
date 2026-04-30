import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { axiosApi } from "../../services/api/axiosInstance";
import { API_ROUTES, PAGE_ROUTES } from "../../config/routes";
import {
  updateIsAuthenticated,
  updateAccessToken,
  setCredentials,
  logout,
} from "../../features/auth/slices/AuthSlice";
import { useDispatch } from "react-redux";

import { RoleTypes } from "../../types/constants/role.constant";

interface AuthInitializerProps {
  children: React.ReactNode;
}

export const AuthInitializer: React.FC<AuthInitializerProps> = ({
  children,
}) => {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();

  useEffect(() => {
    const initialPath = location.pathname;

    const initializeAuth = async () => {
      try {
        const initialAuthResponse = await axiosApi.post(
          API_ROUTES.REFRESH_TOKEN,
          {},
          { withCredentials: true },
        );

        const accessToken = initialAuthResponse.data?.data?.accessToken;

        if (accessToken) {
          dispatch(updateAccessToken(accessToken));
          dispatch(updateIsAuthenticated());

          let currentUser = null;
          try {
            const meRes = await axiosApi.get(API_ROUTES.ME);
            currentUser = meRes.data?.data?.user;
            if (currentUser) {
              dispatch(setCredentials({ user: currentUser, accessToken }));
            }
          } catch { }

          const isAuthPage =
            initialPath === PAGE_ROUTES.LOGIN ||
            initialPath === PAGE_ROUTES.ADMIN_LOGIN ||
            initialPath === PAGE_ROUTES.REGISTER ||
            initialPath === PAGE_ROUTES.HOME;

          if (isAuthPage) {
            const target = currentUser?.role === RoleTypes.ADMIN_USER
              ? PAGE_ROUTES.ADMIN_DASHBOARD
              : PAGE_ROUTES.DASHBOARD;

            if (window.location.pathname !== target) {
              navigate(target, { replace: true });
            }
          }
        }
      } catch (err) {
        console.log("Session initialization skipped or failed:", err);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black flex flex-col items-center justify-center z-50">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold font-kaushan text-primary tracking-wider mb-20 animate-pulse">
          RentEase
        </h1>
      </div>
    );
  }

  return <>{children}</>;
};
