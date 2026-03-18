import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../../hooks/useAppDispatch";
import { logout } from "../../../app/store/slices/AuthSlice";
import { PAGE_ROUTES } from "../../../config/routes";

export const useLogout = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate(PAGE_ROUTES.LOGIN, { replace: true });
  };

  return { handleLogout };
};
