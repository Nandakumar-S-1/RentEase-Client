import { API_ROUTES } from "../../../config/routes";
import type { AuthResponse, LoginData, RegisterData } from "../types/authTypes";
import { axiosApi } from "../../../services/api/axiosInstance";

export const registerUser = async (
  data: RegisterData,
): Promise<AuthResponse> => {
  const response = await axiosApi.post(API_ROUTES.REGISTER, data);
  return response.data;
};

export const loginUser = async (data: LoginData): Promise<AuthResponse> => {
  const response = await axiosApi.post(API_ROUTES.LOGIN, data);
  return response.data;
};

export const loginAdmin = async (data: LoginData): Promise<AuthResponse> => {
  const response = await axiosApi.post(API_ROUTES.ADMIN_LOGIN, data);
  return response.data;
};

export const loginAdminWithGoogle = async (
  idToken: string,
): Promise<AuthResponse> => {
  const response = await axiosApi.post(API_ROUTES.ADMIN_GOOGLE_LOGIN, {
    idToken,
  });
  return response.data;
};

export const googleLogin = async (
  idToken: string,
  role: string,
): Promise<AuthResponse> => {
  const response = await axiosApi.post(API_ROUTES.GOOGLE_AUTH, {
    idToken,
    role,
  });
  return response.data;
};

export const logoutUser = (): void => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("user");
};

export const getCurrentUser = () => {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
};

export const getAccesToken = (): null | string => {
  return localStorage.getItem("accessToken");
};

export const isLoggedIn = (): boolean => {
  return !!localStorage.getItem("accessToken");
};

export const checkSession = async (): Promise<AuthResponse> => {
  const response = await axiosApi.get(API_ROUTES.ME);
  return response.data;
};
