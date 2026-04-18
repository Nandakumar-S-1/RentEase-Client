import axios, { type AxiosError, type InternalAxiosRequestConfig } from "axios";
import { ENV } from "../../config/env";
import { API_ROUTES, PAGE_ROUTES } from "../../config/routes";
import { ErrorCodes } from "../../types/Constants/error.constant"; 
import { store } from "../../app/store/store";
import { logout, updateAccessToken } from "../../features/auth/slices/AuthSlice";
import toast from "react-hot-toast";

export const axiosApi = axios.create({
  baseURL: ENV.API_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// axiosApi.interceptors.request.use((config) => {
//   const token = store.getState().auth.accessToken;
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// })

// this will runs before every req & attaches teh access token with it
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

// this intercetpr will runs after every response comes back nd handle errors and token expiry
axiosApi.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    //  const originalRequest = error.config
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    if (!originalRequest) {
      return Promise.reject(error);
    }

    const status = error.response?.status;
    // const responseData = error.response?.data ||{}
    const responseData = error.response?.data as 
      | { message?: string; code?: string }
      | undefined;
    const message = responseData?.message || "";
    const errorCode = responseData?.code;

    if (
      errorCode === ErrorCodes.ACCOUNT_SUSPENDED ||
      errorCode === ErrorCodes.ACCOUNT_DEACTIVATED ||
      message.toLowerCase().includes("blocked")
    ) {
      toast.error(message || "Your account has been restricted.");
      void axiosApi.post(API_ROUTES.LOGOUT, {}).catch(() => { });
      store.dispatch(logout());
      window.location.href = PAGE_ROUTES.LOGIN;
      return Promise.reject(error);
    }

    // get new access token using the refresh token in cookie.
    const isRefreshCall = originalRequest.url?.includes(API_ROUTES.REFRESH_TOKEN);
    const isLoginCall = originalRequest.url?.includes("login");
    const isLogoutCall = originalRequest.url?.includes(API_ROUTES.LOGOUT);

    if (status === 401 && !originalRequest._retry &&
      !isRefreshCall &&! isLoginCall && !isLogoutCall) {

      originalRequest._retry = true;
      try {
        // const resp = await axiosApi.post(API_ROUTES.REFRESH_TOKEN);
        const resp = await axiosApi.post(
          API_ROUTES.REFRESH_TOKEN,
          {},
          { withCredentials: true },
        );

        const newAccessToken = resp.data?.data?.accessToken;

        if (newAccessToken) {
          store.dispatch(updateAccessToken(newAccessToken));
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return axiosApi(originalRequest);
        }
      } catch {
        //refresh token is also expired
        toast.error("your session has been expired, please login again.");
        //tell the server that the user is loging out by clling backend api for logiout
        void axiosApi.post(API_ROUTES.LOGOUT, {}).catch(() => { });
        store.dispatch(logout());
        window.location.href = PAGE_ROUTES.LOGIN;
      }
    }

    return Promise.reject(error);
  },
);
