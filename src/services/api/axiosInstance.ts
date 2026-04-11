import axios, { type AxiosError, type InternalAxiosRequestConfig } from "axios";
import { ENV } from "../../config/env";
import { API_ROUTES, PAGE_ROUTES } from "../../config/routes";
import { ErrorCodes } from "../../types/constants/error.constant";
import { store } from "../../app/store/store";
import { logout, updateAccessToken } from "../../features/auth/slices/AuthSlice";
import toast from "react-hot-toast";

// 1. CREATE THE INSTANCE
// This is a custom version of axios pre-configured with our base URL and credentials.
export const axiosApi = axios.create({
  baseURL: ENV.API_BASE_URL,
  withCredentials: true, // automatically sends cookies (refresh token) with every request
  headers: {
    "Content-Type": "application/json",
  },
});

// 2. REQUEST INTERCEPTOR
// Runs before every request is sent. Attaches the access token from Redux to the header.
axiosApi.interceptors.request.use(
  (config) => {
    const accessToken = store.getState().auth.accessToken;
    if (accessToken && config.headers) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error: AxiosError) => Promise.reject(error),
);

// 3. RESPONSE INTERCEPTOR
// Runs after every response comes back. Handles errors like token expiry and account suspension.
axiosApi.interceptors.response.use(
  (response) => response, // if successful, just return the response as-is

  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    if (!originalRequest) return Promise.reject(error);

    const status = error.response?.status;
    const responseData = error.response?.data as
      | { message?: string; code?: string }
      | undefined;
    const message = responseData?.message || "";
    const errorCode = responseData?.code;

    // --- CASE 1: Account is suspended or deactivated ---
    // Check this first. If account is blocked, log them out immediately.
    if (
      errorCode === ErrorCodes.ACCOUNT_SUSPENDED ||
      errorCode === ErrorCodes.ACCOUNT_DEACTIVATED ||
      message.toLowerCase().includes("blocked")
    ) {
      toast.error(message || "Your account has been restricted.");
      store.dispatch(logout());
      window.location.href = PAGE_ROUTES.LOGIN;
      return Promise.reject(error);
    }

    // --- CASE 2: Token expired (401) ---
    // Try to get a new access token using the refresh token cookie.
    // _retry flag prevents infinite loops (we only try once).
    const isRefreshCall = originalRequest.url?.includes(API_ROUTES.REFRESH_TOKEN);
    const isLoginCall = originalRequest.url?.includes("login");

    if (status === 401 && !originalRequest._retry && !isRefreshCall && !isLoginCall) {
      originalRequest._retry = true;

      try {
        // Call refresh-token. The browser automatically sends the httpOnly cookie.
        const refreshResponse = await axiosApi.post(
          API_ROUTES.REFRESH_TOKEN,
          {},
          { withCredentials: true },
        );

        const newAccessToken = refreshResponse.data?.data?.accessToken;

        if (newAccessToken) {
          // Save the new token in Redux (and localStorage via the reducer)
          store.dispatch(updateAccessToken(newAccessToken));

          // Update the failed request's header and retry it
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return axiosApi(originalRequest);
        }
      } catch {
        // Refresh token is also expired — log the user out completely
        toast.error("Session expired. Please login again.");
        store.dispatch(logout());
        window.location.href = PAGE_ROUTES.LOGIN;
      }
    }

    return Promise.reject(error);
  },
);
