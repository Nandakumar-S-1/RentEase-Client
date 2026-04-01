import axios, { type AxiosError, type InternalAxiosRequestConfig } from "axios";
import { ENV } from "../../config/env";
import { API_ROUTES, PAGE_ROUTES } from "../../config/routes";
import { ErrorCodes } from "../../types/constants/error.constant";

export const axiosApi = axios.create({
  baseURL: ENV.API_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

interface QueuedRequest {
  resolve: (value?: unknown) => void;
  reject: (err: unknown) => void;
}

let isItRefreshing = false;
let failedQueue: QueuedRequest[] = [];

const processQueue = (error: unknown): void => {
  failedQueue.forEach((p) => {
    if (error) {
      p.reject(error);
    } else {
      p.resolve();
    }
  });
  failedQueue = [];
};

const clearAuthAndRedirect = (): void => {
  localStorage.removeItem("user");
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  window.location.href = PAGE_ROUTES.LOGIN;
};
//for request
//pulls the accessToken from localStorage and attaches it to the
// authorization bearer <token> header for every api call.

axiosApi.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken && config.headers) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (err) => {
    return Promise.reject(err);
  },
);

//for response
// this listens for 401 unauthorized errors. If the token is expired, it calls the /refresh-token endpoint,
//  updates localStorage, and retries the original failed request.
axiosApi.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };
    if (!originalRequest) return Promise.reject(error);
    const status = error.response?.status;

    if (status === 401) {
      const errorCode = (error.response?.data as { code?: string })?.code;
      if (
        errorCode === ErrorCodes.ACCOUNT_SUSPENDED ||
        errorCode === ErrorCodes.ACCOUNT_DEACTIVATED
      ) {
        if (!originalRequest.url?.includes("/login")) {
          clearAuthAndRedirect();
        }
        return Promise.reject(error);
      }

      if (
        originalRequest.url?.includes("/login") ||
        originalRequest.url?.includes("/refresh-token")
      ) {
        if (originalRequest.url?.includes("/refresh-token")) {
          clearAuthAndRedirect();
        }
        return Promise.reject(error);
      }

      if (!originalRequest._retry) {
        if (isItRefreshing) {
          return new Promise((resolve, reject) => {
            failedQueue.push({
              resolve,
              reject,
            });
          })
            .then(() => axiosApi(originalRequest))
            .catch((err) => Promise.reject(err));
        }
        originalRequest._retry = true;
        isItRefreshing = true;

        try {
          // Silent refresh call - automatically includes the refreshToken cookie
          const refreshResponse = await axiosApi.post(API_ROUTES.REFRESH_TOKEN);
          const newAccessToken = refreshResponse.data?.data?.accessToken;
          if (newAccessToken) {
            localStorage.setItem("accessToken", newAccessToken);
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          }
          processQueue(null);
          return axiosApi(originalRequest);
        } catch (refreshError) {
          processQueue(refreshError);
          clearAuthAndRedirect();
          return Promise.reject(refreshError);
        } finally {
          isItRefreshing = false;
        }
      }
      clearAuthAndRedirect();
      return Promise.reject(error);
    }

    if (status && status >= 500) {
      console.error(`🔴 Server Error [${status}]:`, error.message);
    }

    return Promise.reject(error);
  },
);
