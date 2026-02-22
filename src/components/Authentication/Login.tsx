import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Eye, EyeOff } from 'lucide-react';
import { Input, Button, FormMessage, AuthLayout } from "../Common"
import { loginUser } from '../../services/authService'; 
import type { ApiError, LoginData } from '../../Types/auth';


const Login = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState<LoginData>({
    email: '',
    password: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    setIsError(false);

    if (!formData.email || !formData.password) {
      setIsError(true);
      setMessage('Email and password are required');
      return;
    }

    try {
      setIsLoading(true);

      const response = await loginUser({
        email: formData.email,
        password: formData.password,
      });

      localStorage.setItem('accessToken', response.data.accessToken);
      localStorage.setItem('refreshToken', response.data.refreshToken);
      localStorage.setItem('user', JSON.stringify(response.data.user));

      setMessage('Login successful!');

      setTimeout(() => {
        navigate('/dashboard');
      }, 1000);
    } catch (error) {
      setIsError(true);
      const apiError = error as ApiError;
      setMessage(
        apiError?.response?.data?.message || 'Login failed. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in to your account to continue"
      leftPanelDescription="Welcome back! Sign in to your account to continue managing your rental properties or finding your perfect home."
    >
      <FormMessage message={message} isError={isError} />

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          name="email"
          type="email"
          placeholder="you@example.com"
          label="Email"
          value={formData.email}
          onChange={handleChange}
          icon={<Mail className="h-4 w-4" />}
          required
        />

        <Input
          name="password"
          type={showPassword ? 'text' : 'password'}
          placeholder="Enter your password"
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

        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2">
            <input type="checkbox" className="rounded" />
            <span className="text-sm text-muted-foreground">
              Remember me for 30 days
            </span>
          </label>
          <a href="#" className="text-sm text-primary hover:underline">
            Forgot password?
          </a>
        </div>

        <Button type="submit" loading={isLoading} className="w-full">
          Sign in
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        Don't have an account?{' '}
        <button
          onClick={() => navigate('/')}
          className="font-medium text-primary hover:underline"
        >
          Sign up
        </button>
      </p>
    </AuthLayout>
  );
};

export default Login;

