import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Eye, EyeOff, ShieldCheck } from "lucide-react";
import {
  Input,
  Button,
  FormMessage,
  AuthLayout,
} from "../../../components/common";
import {
  loginAdmin,
  loginAdminWithGoogle,
} from "../../auth/services/authService";
import type { LoginData } from "../../auth/types/authTypes";
import { PAGE_ROUTES } from "../../../config/routes";
import type { ApiError } from "../../../types/common";
import { useAppDispatch } from "../../../hooks/useAppDispatch";
import { setCredentials } from "../../auth/slices/AuthSlice";
import { auth, googleProvider } from "../../../config/firebase.config";
import { signInWithPopup } from "firebase/auth";
const AdminLogin = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [formData, setFormData] = useState<LoginData>({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setIsError(false);

    if (!formData.email || !formData.password) {
      setIsError(true);
      setMessage("Admin credentials are required");
      return;
    }

    try {
      setIsLoading(true);

      const response = await loginAdmin({
        email: formData.email,
        password: formData.password,
      });

      dispatch(
        setCredentials({
          user: response.data.user,
          accessToken: response.data.accessToken,
        }),
      );

      setMessage("Admin access granted!");

      setTimeout(() => {
        navigate(PAGE_ROUTES.DASHBOARD);
      }, 1000);
    } catch (error) {
      setIsError(true);
      const apiError = error as ApiError;
      setMessage(
        apiError?.response?.data?.message ||
          "Admin login failed. Please check your credentials.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleAdminLogin = async () => {
    setMessage("");
    setIsError(false);
    try {
      setIsLoading(true);
      const result = await signInWithPopup(auth, googleProvider);
      const idToken = await result.user.getIdToken();

      const response = await loginAdminWithGoogle(idToken);
      dispatch(
        setCredentials({
          user: response.data.user,
          accessToken: response.data.accessToken,
        }),
      );
      setMessage("Admin access granted!");

      setTimeout(() => {
        navigate(PAGE_ROUTES.DASHBOARD);
      }, 1000);
    } catch (error) {
      setIsError(true);
      const apiError = error as ApiError;
      setMessage(
        apiError?.response?.data?.message ||
          "Admin Google login failed. Please try again.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Admin Control Center"
      subtitle="Secure entrance for platform administrators"
      leftPanelDescription="Access the RentEase management suite. Monitor platform health, manage users, and oversee all rental operations."
    >
      <div className="flex justify-center mb-6">
        <div className="p-3 bg-primary/10 rounded-full">
          <ShieldCheck className="h-8 w-8 text-primary" />
        </div>
      </div>

      <FormMessage message={message} isError={isError} />

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          name="email"
          type="email"
          placeholder="admin@rentease.com"
          label="Admin Email"
          value={formData.email}
          onChange={handleChange}
          icon={<Mail className="h-4 w-4" />}
          required
        />

        <Input
          name="password"
          type={showPassword ? "text" : "password"}
          placeholder="Enter admin password"
          label="Password"
          value={formData.password}
          onChange={handleChange}
          icon={
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-muted-foreground hover:text-foreground"
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          }
          required
        />

        <Button
          type="submit"
          loading={isLoading}
          className="w-full bg-gray-900 hover:bg-black"
        >
          Login to Console
        </Button>

        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-gray-200" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white px-2 text-muted-foreground">
              Or continue with
            </span>
          </div>
        </div>

        <button
          type="button"
          disabled={isLoading}
          onClick={handleGoogleAdminLogin}
          className="flex w-full items-center justify-center gap-3 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-bold text-gray-700 transition-all hover:bg-gray-50 hover:border-gray-300 disabled:opacity-50"
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24">
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            />
          </svg>
          Google
        </button>
      </form>

      <p className="mt-8 text-center text-xs text-muted-foreground uppercase tracking-widest bg-gray-100 py-2 rounded-lg">
        Protected by RentEase Security
      </p>
    </AuthLayout>
  );
};

export default AdminLogin;
