import { axiosApi } from "../../../services/api/axiosInstance";
import { API_ROUTES } from "../../../config/routes";

export const getMyWishlist = () => {
  return axiosApi.get(API_ROUTES.WISHLIST);
};

export const toggleWishlist = (propertyId: string) => {
  return axiosApi.post(API_ROUTES.TOGGLE_WISHLIST(propertyId));
};

export const checkWishlisted = (propertyId: string) => {
  return axiosApi.get<{ isWishlisted: boolean }>(
    API_ROUTES.CHECK_WISHLISTED(propertyId),
  );
};
