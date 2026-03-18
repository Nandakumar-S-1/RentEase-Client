// // hooks/useForgotPassword.ts
// import { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { axiosApi } from '../../../services/api/axiosInstance';
// import { PAGE_ROUTES } from '../../../config/routes';
// import type { ApiError } from '../../../types/common';

// export const useForgotPassword = () => {
//   const navigate = useNavigate();

//   const [step, setStep] = useState<'email' | 'otp' | 'reset'>('email');
//   const [email, setEmail] = useState('');
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [successMessage, setSuccessMessage] = useState<string | null>(null);

//   const sendOtp = async (emailInput: string) => {
//     try {
//       setIsLoading(true);
//       setError(null);
//       await axiosApi.post('/users/forgot-password', { email: emailInput });
//       setEmail(emailInput);
//       setSuccessMessage('OTP sent to your email');
//       setStep('otp');
//     } catch (err) {
//       const apiError = err as ApiError;
//       setError(apiError?.response?.data?.message || 'Failed to send OTP');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const verifyOtp = async (otp: string) => {
//     try {
//       setIsLoading(true);
//       setError(null);
//       await axiosApi.post('/users/verify-reset-otp', { email, otp });
//       setSuccessMessage('OTP verified');
//       setStep('reset');
//     } catch (err) {
//       const apiError = err as ApiError;
//       setError(apiError?.response?.data?.message || 'Invalid OTP');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const resetPassword = async (newPassword: string) => {
//     try {
//       setIsLoading(true);
//       setError(null);
//       await axiosApi.post('/users/reset-password', { email, newPassword });
//       setSuccessMessage('Password reset successful!');
//       setTimeout(() => navigate(PAGE_ROUTES.LOGIN), 2000);
//     } catch (err) {
//       const apiError = err as ApiError;
//       setError(apiError?.response?.data?.message || 'Failed to reset password');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const goBack = () => {
//     setStep('email');
//     setError(null);
//     setSuccessMessage(null);
//   };

//   return { step, email, isLoading, error, successMessage, sendOtp, verifyOtp, resetPassword, goBack };
// };