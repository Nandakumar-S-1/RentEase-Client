import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { RotateCcw, ArrowLeft, Clock } from 'lucide-react';
import { verifyOtp, resendOtp } from '../../services/otpService';
import type { ApiError } from '../../Types/auth';
import { Button, FormMessage } from '../Common';
import { AuthLayout } from '../Common/AuthLayout';


const VerifyOtp = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const email = searchParams.get('email') || '';

  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);


useEffect(() => {
  let timer: ReturnType<typeof setInterval>;

  if (resendCooldown > 0) {
    timer = setInterval(() => {
      setResendCooldown((prev) => prev - 1);
    }, 1000);
  }

  return () => clearInterval(timer);
}, [resendCooldown]);

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    if (value.length > 1) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    setIsError(false);

    const otpString = otp.join('');
    if (otpString.length !== 6) {
      setIsError(true);
      setMessage('Please enter all 6 digits');
      return;
    }

    try {
      setIsLoading(true);
      const response = await verifyOtp(email, otpString);

      localStorage.setItem('accessToken', response.accessToken);
      localStorage.setItem('refreshToken', response.refreshToken);
      localStorage.setItem('user', JSON.stringify(response));

      setMessage('Email verified successfully!');
      setTimeout(() => {
        navigate('/dashboard');
      }, 1000);
    } catch (error) {
      setIsError(true);
      const apiError = error as ApiError;
      setMessage(
        apiError?.response?.data?.message || 'Failed to verify OTP'
      );
      setOtp(['', '', '', '', '', '']);
      otpRefs.current[0]?.focus();
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    try {
      setResendLoading(true);
      setMessage('');
      setIsError(false);

      await resendOtp(email);
      setMessage('OTP resent to your email');
      setOtp(['', '', '', '', '', '']);
      otpRefs.current[0]?.focus();
      setResendCooldown(60);
    } catch (error) {
      setIsError(true);
      const apiError = error as ApiError;
      setMessage(
        apiError?.response?.data?.message || 'Failed to resend OTP'
      );
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Verify your email"
      subtitle="Enter the 6-digit code we sent to your email"
      showLeftPanel={false}
    >
      <FormMessage message={message} isError={isError} />

      <form onSubmit={handleVerifyOtp} className="space-y-6">
        {/* OTP Inputs */}
        <div className="flex gap-2 justify-center">
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(el) => {
                otpRefs.current[index] = el;
              }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleOtpChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              className="h-12 w-12 rounded-lg border-2 border-gray-200 text-center text-lg font-bold focus:border-primary focus:outline-none transition"
              placeholder="•"
            />
          ))}
        </div>

        {/* Verify Button */}
        <Button
          type="submit"
          loading={isLoading}
          disabled={otp.join('').length !== 6}
          className="w-full"
        >
          Verify Email
        </Button>
      </form>

      {/* Resend Section */}
      <div className="mt-6 flex flex-col gap-3 border-t border-gray-200 pt-6">
        <p className="text-center text-sm text-muted-foreground">
          Didn't receive the code?
        </p>

        <Button
          onClick={handleResendOtp}
          loading={resendLoading}
          disabled={resendCooldown > 0}
          variant="outline"
          className="w-full"
          icon={resendCooldown > 0 ? <Clock className="h-4 w-4" /> : <RotateCcw className="h-4 w-4" />}
        >
          {resendCooldown > 0 ? `Retry in ${resendCooldown}s` : 'Resend code'}
        </Button>
      </div>

      {/* Back Button */}
      <button
        onClick={() => navigate('/login')}
        className="mt-8 flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-primary transition"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to sign in
      </button>
    </AuthLayout>
  );
};

export default VerifyOtp;

// import React, { useState, useRef } from 'react';
// import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
// import { Home, RotateCcw, ArrowLeft } from 'lucide-react';
// import { axiosApi } from '../services/api';

// const VerifyOtp = () => {
//     const navigate = useNavigate();
//     const [searchParams] = useSearchParams();

//     const email = searchParams.get("email") || "";

//     const [otp, setOtp] = useState(['', '', '', '', '', '']);
//     const [message, setMessage] = useState('');
//     const [isError, setIsError] = useState(false);
//     const [isLoading, setIsLoading] = useState(false);
//     const [resendLoading, setResendLoading] = useState(false)

//     const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

//     const handleOtpChange = (index: number, value: string) => {

//         if (!/^\d*$/.test(value)) return;

//         if (value.length > 1) return;

//         const newOtp = [...otp];
//         newOtp[index] = value;
//         setOtp(newOtp);

//         if (value && index < 5) {
//             otpRefs.current[index + 1]?.focus();
//         }
//     };

//     const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
//         if (e.key === 'Backspace') {
//             if (!otp[index] && index > 0) {
//                 otpRefs.current[index - 1]?.focus();
//             }
//         }
//     };

//     const handleVerifyOtp = async (e: React.FormEvent) => {
//         e.preventDefault();

//         setMessage('');
//         setIsError(false);

//         const otpString = otp.join('');
//         if (otpString.length !== 6) {
//             setIsError(true);
//             setMessage('Please enter all 6 digits');
//             return;
//         }

//         try {
//             setIsLoading(true);


//             const response = await axiosApi.post('/users/verify-otp', {
//                 email,
//                 otp: otpString,
//             });

//             console.log('OTP verification successful:', response.data);

//             localStorage.setItem('accessToken', response.data.data.accessToken);
//             localStorage.setItem('refreshToken', response.data.data.refreshToken);
//             localStorage.setItem('user', JSON.stringify(response.data.data.user));

//             setMessage('Email verified successfully!');

//             setTimeout(() => {
//                 navigate('/dashboard');
//             }, 1000);
//         } catch (error: any) {
//             setIsError(true);
//             setMessage(
//                 error?.response?.data?.message || 'Failed to verify OTP. Please try again.'
//             );

//             setOtp(['', '', '', '', '', '']);
//             otpRefs.current[0]?.focus();
//         } finally {
//             setIsLoading(false);
//         }
//     };

//     const handleResendOtp = async () => {
//         try {
//             setResendLoading(true);
//             setMessage('');
//             setIsError(false);

//             const response = await axiosApi.post('/users/resend-otp', {
//                 email,
//             });

//             setMessage('OTP resent to your email');

//             setOtp(['', '', '', '', '', '']);
//             otpRefs.current[0]?.focus();
//         } catch (error: any) {
//             setIsError(true);
//             setMessage(
//                 error?.response?.data?.message || 'Failed to resend OTP. Please try again.'
//             );
//         } finally {
//             setResendLoading(false);
//         }
//     };

//     return (
//         <div className="flex min-h-screen items-center justify-center px-4 bg-white">
//             <div className="w-full max-w-md">
//                 {/* Logo */}
//                 <div className="mb-8 flex flex-col items-center gap-2">
//                     <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/20">
//                         <Home className="h-6 w-6 text-primary" />
//                     </div>
//                     <span className="text-2xl font-bold text-primary">RentEase</span>
//                 </div>

//                 {/* Title */}
//                 <h1 className="mb-2 text-center text-2xl font-bold text-card-foreground">
//                     Verify your email
//                 </h1>
//                 <p className="mb-6 text-center text-sm text-muted-foreground">
//                     Enter the 6-digit code we sent to your email
//                 </p>

//                 {/* Message */}
//                 {message && (
//                     <p
//                         className={`mb-4 text-center text-sm font-medium ${isError ? 'text-destructive' : 'text-green-600'
//                             }`}
//                     >
//                         {message}
//                     </p>
//                 )}

//                 {/* OTP Form */}
//                 <form onSubmit={handleVerifyOtp} className="space-y-6">
//                     {/* OTP Inputs */}
//                     <div className="flex gap-2 justify-center">
//                         {otp.map((digit, index) => (
//                             <input
//                                 key={index}
//                                 ref={(el) => {
//                                     otpRefs.current[index] = el;
//                                 }}
//                                 type="text"
//                                 inputMode="numeric"
//                                 maxLength={1}
//                                 value={digit}
//                                 onChange={(e) => handleOtpChange(index, e.target.value)}
//                                 onKeyDown={(e) => handleKeyDown(index, e)}
//                                 className="h-12 w-12 rounded-lg border-2 border-gray-200 text-center text-lg font-bold text-card-foreground focus:border-primary focus:outline-none"
//                                 placeholder="•"
//                             />
//                         ))}
//                     </div>

//                     {/* Verify Button */}
//                     <button
//                         type="submit"
//                         disabled={isLoading || otp.join('').length !== 6}
//                         className="w-full rounded-lg bg-primary py-3 font-medium text-white transition hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
//                     >
//                         {isLoading ? 'Verifying...' : 'Verify Email'}
//                     </button>
//                 </form>

//                 {/* Resend OTP */}
//                 <div className="mt-6 flex flex-col gap-3">
//                     <p className="text-center text-sm text-muted-foreground">
//                         Didn't receive the code?
//                     </p>
//                     <button
//                         onClick={handleResendOtp}
//                         disabled={resendLoading}
//                         className="flex items-center justify-center gap-2 rounded-lg border border-primary py-2 font-medium text-primary transition hover:bg-primary/5 disabled:opacity-50"
//                     >
//                         <RotateCcw className="h-4 w-4" />
//                         {resendLoading ? 'Sending...' : 'Resend code'}
//                     </button>
//                 </div>

//                 {/* Back to Sign In */}
//                 <button
//                     onClick={() => navigate('/login')}
//                     className="mt-8 flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-primary"
//                 >
//                     <ArrowLeft className="h-4 w-4" />
//                     Back to sign in
//                 </button>
//             </div>
//         </div>
//     );
// };

// export default VerifyOtp;