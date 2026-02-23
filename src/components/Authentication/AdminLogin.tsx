import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Eye, EyeOff, ShieldCheck } from 'lucide-react';
import { Input, Button, FormMessage, AuthLayout } from "../Common";
import { loginAdmin } from '../../services/authService';
import type { ApiError, LoginData } from '../../Types/auth';

const AdminLogin = () => {
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
            setMessage('Admin credentials are required');
            return;
        }

        try {
            setIsLoading(true);

            const response = await loginAdmin({
                email: formData.email,
                password: formData.password,
            });

            localStorage.setItem('accessToken', response.data.accessToken);
            localStorage.setItem('refreshToken', response.data.refreshToken);
            localStorage.setItem('user', JSON.stringify(response.data.user));

            setMessage('Admin access granted!');

            setTimeout(() => {
                navigate('/dashboard');
            }, 1000);
        } catch (error) {
            setIsError(true);
            const apiError = error as ApiError;
            setMessage(
                apiError?.response?.data?.message || 'Admin login failed. Please check your credentials.'
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
                    type={showPassword ? 'text' : 'password'}
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

                <Button type="submit" loading={isLoading} className="w-full bg-gray-900 hover:bg-black">
                    Login to Console
                </Button>
            </form>

            <p className="mt-8 text-center text-xs text-muted-foreground uppercase tracking-widest bg-gray-100 py-2 rounded-lg">
                Protected by RentEase Security
            </p>
        </AuthLayout>
    );
};

export default AdminLogin;
