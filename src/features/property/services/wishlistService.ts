import { axiosApi } from "../../../services/api/axiosInstance";
import { API_ROUTES } from "../../../config/routes";

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
}

export const getMyWishlist = async () => {
  const response = await axiosApi.get<ApiResponse<unknown[]>>(API_ROUTES.WISHLIST);
  return response.data;
};

export const toggleWishlist = async (propertyId: string) => {
  const response = await axiosApi.post<ApiResponse<{ isWishlisted: boolean }>>(API_ROUTES.TOGGLE_WISHLIST(propertyId));
  return response.data;
};

export const checkWishlisted = async (propertyId: string) => {
  const response = await axiosApi.get<ApiResponse<{ isWishlisted: boolean }>>(
    API_ROUTES.CHECK_WISHLISTED(propertyId),
  );
  return response.data;
};
