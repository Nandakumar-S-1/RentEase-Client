import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithPopup } from "firebase/auth";
import { useAppDispatch } from "../../../hooks/useAppDispatch";
import { setCredentials } from "../../../app/store/slices/AuthSlice";
import { googleLogin } from "../services/authService";
import { auth, googleProvider } from "../../../config/firebase.config";
import { PAGE_ROUTES } from "../../../config/routes";

export const useGoogleAuth = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loginWithGoogle = async (role: "TENANT" | "OWNER") => {
    try {
      setIsLoading(true);
      setError(null);

      const result = await signInWithPopup(auth, googleProvider);
      const idToken = await result.user.getIdToken();
      const response = await googleLogin(idToken, role);

      dispatch(
        setCredentials({
          user: response.data.user,
          accessToken: response.data.accessToken,
          refreshToken: response.data.refreshToken,
        })
      );

      setTimeout(() => navigate(PAGE_ROUTES.DASHBOARD), 1000);
    } catch (err: any) {
      console.error("Google auth error:", err);
      setError(err?.response?.data?.message || "Google login failed");
    } finally {
      setIsLoading(false);
    }
  };

  return { loginWithGoogle, isLoading, error };
};
