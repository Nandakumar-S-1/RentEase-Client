import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../../hooks/useAppDispatch";
import { logout } from "../slices/AuthSlice";
import { PAGE_ROUTES } from "../../../config/routes";
import { logoutSession } from "../services/authService";

export const useLogout = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logoutSession();
    } catch {
    }
    dispatch(logout());
    navigate(PAGE_ROUTES.LOGIN, { replace: true });
  };

  return { handleLogout };
};
