import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, ArrowLeft } from "lucide-react";
import {
  Button,
  FormMessage,
  Input,
  AuthLayout,
} from "../../../components/common";
import { axiosApi } from "../../../services/api/axiosInstance";
import { API_ROUTES, PAGE_ROUTES } from "../../../config/routes";
import type { ApiError } from "../../../types/common";

const ForgotPassword = () => {
  const navigate = useNavigate();

  const [step, setStep] = useState<"email" | "otp" | "reset">("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setIsError(false);

    if (!email) {
      setIsError(true);
      setMessage("Email is required");
      return;
    }

    try {
      setIsLoading(true);
      await axiosApi.post(API_ROUTES.FORGOT_PASSWORD, { email });
      setMessage("OTP sent to your email");
      setStep("otp");
    } catch (error) {
      setIsError(true);
      const apiError = error as ApiError;
      setMessage(apiError?.response?.data?.message || "Failed to send OTP");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setIsError(false);

    const otpString = otp.join("");
    if (otpString.length !== 6) {
      setIsError(true);
      setMessage("Please enter all 6 digits");
      return;
    }

    try {
      setIsLoading(true);
      await axiosApi.post("/users/verify-reset-otp", { email, otp: otpString });
      setMessage("OTP verified");
      setStep("reset");
    } catch (error) {
      setIsError(true);
      const apiError = error as ApiError;
      setMessage(apiError?.response?.data?.message || "Invalid OTP");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setIsError(false);

    if (newPassword.length < 8) {
      setIsError(true);
      setMessage("Password must be at least 8 characters");
      return;
    }

    if (newPassword !== confirmPassword) {
      setIsError(true);
      setMessage("Passwords do not match");
      return;
    }

    try {
      setIsLoading(true);
      await axiosApi.post("/users/reset-password", {
        email,
        newPassword,
      });

      setMessage("Password reset successful!");
      setTimeout(() => {
        navigate(PAGE_ROUTES.LOGIN);
      }, 2000);
    } catch (error) {
      setIsError(true);
      const apiError = error as ApiError;
      setMessage(
        apiError?.response?.data?.message || "Failed to reset password",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const otpRefs = React.useRef<(HTMLInputElement | null)[]>([]);

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    if (value.length > 0) {
      newOtp[index] = value.substring(value.length - 1);
      setOtp(newOtp);

      if (index < 5 && value !== "") {
        otpRefs.current[index + 1]?.focus();
      }
    } else {
      newOtp[index] = "";
      setOtp(newOtp);
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  return (
    <AuthLayout
      title={
        step === "email"
          ? "Forgot Password"
          : step === "otp"
            ? "Enter Reset Code"
            : "Reset Password"
      }
      subtitle={
        step === "email"
          ? "Enter your email to receive a reset code"
          : step === "otp"
            ? "Enter the 6-digit code sent to your email"
            : "Create a new password"
      }
      showLeftPanel={false}
    >
      <FormMessage message={message} isError={isError} />

      {step === "email" && (
        <form onSubmit={handleSendOtp} className="space-y-4">
          <Input
            name="email"
            type="email"
            placeholder="you@example.com"
            label="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            icon={<Mail className="h-4 w-4" />}
            required
          />

          <Button type="submit" loading={isLoading} className="w-full">
            Send Reset Code
          </Button>
        </form>
      )}

      {step === "otp" && (
        <form onSubmit={handleVerifyOtp} className="space-y-6">
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
                className="h-12 w-12 rounded-lg border-2 border-gray-200 text-center text-lg font-bold focus:border-primary focus:outline-none"
                placeholder="•"
              />
            ))}
          </div>

          <Button
            type="submit"
            loading={isLoading}
            disabled={otp.join("").length !== 6}
            className="w-full"
          >
            Verify Code
          </Button>

          <button
            type="button"
            onClick={() => {
              setStep("email");
              setOtp(["", "", "", "", "", ""]);
              setMessage("");
            }}
            className="w-full text-sm text-primary hover:underline"
          >
            Back
          </button>
        </form>
      )}

      {step === "reset" && (
        <form onSubmit={handleResetPassword} className="space-y-4">
          <Input
            name="newPassword"
            type={showPassword ? "text" : "password"}
            placeholder="New password (min 8 characters)"
            label="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />

          <Input
            name="confirmPassword"
            type={showPassword ? "text" : "password"}
            placeholder="Confirm password"
            label="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={showPassword}
              onChange={(e) => setShowPassword(e.target.checked)}
              className="rounded"
            />
            <span className="text-sm text-muted-foreground">Show password</span>
          </label>

          <Button type="submit" loading={isLoading} className="w-full">
            Reset Password
          </Button>
        </form>
      )}

      <button
        onClick={() => navigate(PAGE_ROUTES.LOGIN)}
        className="mt-8 flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-primary"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to login
      </button>
    </AuthLayout>
  );
};

export default ForgotPassword;

// const ForgotPassword = () => {
//   const navigate = useNavigate();
//   const { step, isLoading, error, successMessage, sendOtp, verifyOtp, resetPassword, goBack } = useForgotPassword();

//   const [emailInput, setEmailInput] = useState('');
//   const [otp, setOtp] = useState(['', '', '', '', '', '']);
//   const [newPassword, setNewPassword] = useState('');
//   const [confirmPassword, setConfirmPassword] = useState('');
//   const [showPassword, setShowPassword] = useState(false);
//   const [localError, setLocalError] = useState('');

//   const otpRefs = React.useRef<(HTMLInputElement | null)[]>([]);

//   const message = successMessage || localError || error || '';
//   const isError = !!(localError || error);

//   const handleOtpChange = (index: number, value: string) => {
//     if (!/^\d*$/.test(value)) return;
//     const newOtp = [...otp];
//     newOtp[index] = value.substring(value.length - 1);
//     setOtp(newOtp);
//     if (value && index < 5) otpRefs.current[index + 1]?.focus();
//   };

//   const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
//     if (e.key === 'Backspace' && !otp[index] && index > 0) {
//       otpRefs.current[index - 1]?.focus();
//     }
//   };

//   const handleResetSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLocalError('');
//     if (newPassword.length < 8) {
//       setLocalError('Password must be at least 8 characters');
//       return;
//     }
//     if (newPassword !== confirmPassword) {
//       setLocalError('Passwords do not match');
//       return;
//     }
//     await resetPassword(newPassword);
//   };

//   return (
//     <AuthLayout
//       title={step === 'email' ? 'Forgot Password' : step === 'otp' ? 'Enter Reset Code' : 'Reset Password'}
//       subtitle={
//         step === 'email'
//           ? 'Enter your email to receive a reset code'
//           : step === 'otp'
//           ? 'Enter the 6-digit code sent to your email'
//           : 'Create a new password'
//       }
//       showLeftPanel={false}
//     >
//       <FormMessage message={message} isError={isError} />

//       {step === 'email' && (
//         <form onSubmit={(e) => { e.preventDefault(); sendOtp(emailInput); }} className="space-y-4">
//           <Input
//             name="email"
//             type="email"
//             placeholder="you@example.com"
//             label="Email"
//             value={emailInput}
//             onChange={(e) => setEmailInput(e.target.value)}
//             icon={<Mail className="h-4 w-4" />}
//             required
//           />
//           <Button type="submit" loading={isLoading} className="w-full">
//             Send Reset Code
//           </Button>
//         </form>
//       )}

//       {step === 'otp' && (
//         <form onSubmit={(e) => { e.preventDefault(); verifyOtp(otp.join('')); }} className="space-y-6">
//           <div className="flex gap-2 justify-center">
//             {otp.map((digit, index) => (
//               <input
//                 key={index}
//                 ref={(el) => { otpRefs.current[index] = el; }}
//                 type="text"
//                 inputMode="numeric"
//                 maxLength={1}
//                 value={digit}
//                 onChange={(e) => handleOtpChange(index, e.target.value)}
//                 onKeyDown={(e) => handleKeyDown(index, e)}
//                 className="h-12 w-12 rounded-lg border-2 border-gray-200 text-center text-lg font-bold focus:border-primary focus:outline-none"
//                 placeholder="•"
//               />
//             ))}
//           </div>
//           <Button type="submit" loading={isLoading} disabled={otp.join('').length !== 6} className="w-full">
//             Verify Code
//           </Button>
//           <button type="button" onClick={goBack} className="w-full text-sm text-primary hover:underline">
//             Back
//           </button>
//         </form>
//       )}

//       {step === 'reset' && (
//         <form onSubmit={handleResetSubmit} className="space-y-4">
//           <Input name="newPassword" type={showPassword ? 'text' : 'password'} placeholder="New password (min 8 characters)" label="New Password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required />
//           <Input name="confirmPassword" type={showPassword ? 'text' : 'password'} placeholder="Confirm password" label="Confirm Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
//           <label className="flex items-center gap-2">
//             <input type="checkbox" checked={showPassword} onChange={(e) => setShowPassword(e.target.checked)} className="rounded" />
//             <span className="text-sm text-muted-foreground">Show password</span>
//           </label>
//           <Button type="submit" loading={isLoading} className="w-full">
//             Reset Password
//           </Button>
//         </form>
//       )}

//       <button onClick={() => navigate(PAGE_ROUTES.LOGIN)} className="mt-8 flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-primary">
//         <ArrowLeft className="h-4 w-4" />
//         Back to login
//       </button>
//     </AuthLayout>
//   );
// };

// export default ForgotPassword;
