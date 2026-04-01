import { axiosApi } from "../../../services/api/axiosInstance";
import { API_ROUTES } from "../../../config/routes";
import type {
  ProfileResponse,
  UpdateProfileData,
  UpdateProfileResponse,
} from "../types/profileTypes";

export const getProfile = async (): Promise<ProfileResponse> => {
  const response = await axiosApi.get(API_ROUTES.PROFILE);
  return response.data;
};

export const updateProfile = async (
  data: UpdateProfileData,
): Promise<UpdateProfileResponse> => {
  const response = await axiosApi.put(API_ROUTES.UPDATE_PROFILE, data);
  return response.data;
};
