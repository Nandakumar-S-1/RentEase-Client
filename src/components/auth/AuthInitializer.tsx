import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { axiosApi } from "../../services/api/axiosInstance";
import { API_ROUTES, PAGE_ROUTES } from "../../config/routes";
import {
  updateIsAuthenticated,
  updateAccessToken,
  setCredentials,
} from "../../features/auth/slices/AuthSlice";
import { useDispatch } from "react-redux";

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
    const initializeAuth = async () => {
      try {
        const intendedPath = location.pathname;

        const initialAuthResponse = await axiosApi.post(
          API_ROUTES.REFRESH_TOKEN,
          {},
          { withCredentials: true },
        );

        const accessToken = initialAuthResponse.data?.data?.accessToken;

        
        if (accessToken) {
          // updateAccessToken saves to both Redux AND localStorage via the reducer
          dispatch(updateAccessToken(accessToken));
          dispatch(updateIsAuthenticated());

          try {
            const meRes = await axiosApi.get(API_ROUTES.ME);
            const user = meRes.data?.data?.user;
            if (user) {
              dispatch(setCredentials({ user, accessToken }));
            }
          } catch {
          }

          const isAuthPage =
            intendedPath === PAGE_ROUTES.LOGIN ||
            intendedPath === PAGE_ROUTES.REGISTER ||
            intendedPath === PAGE_ROUTES.HOME;

          if (isAuthPage) {
            navigate(PAGE_ROUTES.DASHBOARD, { replace: true });
          } else {
            navigate(intendedPath, { replace: true });
          }
        }
      } catch (err) {
        console.log(" No valid session found:", err);
        localStorage.removeItem("accessToken"); 
      } finally {
        setTimeout(() => setLoading(false), 1500);
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
