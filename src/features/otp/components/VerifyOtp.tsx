import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { RotateCcw, ArrowLeft, Clock } from "lucide-react";
import { useVerifyOtp } from "../hooks/useVerifyOtp";
import { useResendOtp } from "../hooks/useResendOtp";
import { Button, FormMessage, AuthLayout } from "../../../components/common";
import { PAGE_ROUTES } from "../../../config/routes";

const VerifyOtp = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email") || "";

  const {
    verify,
    isLoading,
    error: verifyError,
    successMessage,
  } = useVerifyOtp();
  const {
    resend,
    isLoading: resendLoading,
    error: resendError,
    successMessage: resendSuccess,
  } = useResendOtp();

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [resendCooldown, setResendCooldown] = useState(60); // Start timer immediately

  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  const message =
    successMessage || resendSuccess || verifyError || resendError || "";
  const isError = !!(verifyError || resendError);

  useEffect(() => {
    if (!email) {
      navigate(PAGE_ROUTES.LOGIN);
    }
  }, [email, navigate]);

  useEffect(() => {
    if (resendCooldown <= 0) return;

    const timer = setInterval(() => {
      setResendCooldown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

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
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    const pasted = e.clipboardData.getData("text").trim();
    if (!/^\d{6}$/.test(pasted)) return;

    const newOtp = pasted.split("");
    setOtp(newOtp);
    otpRefs.current[5]?.focus();
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();

    const otpString = otp.join("");
    if (otpString.length !== 6) return;

    await verify(email, otpString);

    if (verifyError) {
      setOtp(["", "", "", "", "", ""]);
      otpRefs.current[0]?.focus();
    }
  };

  const handleResendOtp = async () => {
    await resend(email);
    setOtp(["", "", "", "", "", ""]);
    otpRefs.current[0]?.focus();
    setResendCooldown(60);
  };

  return (
    <AuthLayout
      title="Security Check"
      subtitle={`We've sent a 6-digit verification code to ${email}`}
      showLeftPanel={false}
    >
      <div className="relative z-10 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <FormMessage message={message} isError={isError} />

        <form onSubmit={handleVerifyOtp} className="space-y-8">
          <div className="flex gap-3 justify-center" onPaste={handlePaste}>
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
                className="h-14 w-12 rounded-2xl border-2 border-gray-100 bg-white/50 backdrop-blur-sm text-center text-xl font-black text-primary focus:border-primary focus:ring-4 focus:ring-primary/10 focus:outline-none transition-all shadow-sm"
                placeholder="-"
              />
            ))}
          </div>

          <Button
            type="submit"
            loading={isLoading}
            disabled={otp.join("").length !== 6 || isLoading}
            className="w-full py-4 text-lg font-black rounded-2xl shadow-xl shadow-primary/25 hover:scale-[1.02] active:scale-95 transition-all"
          >
            Verify & Continue
          </Button>
        </form>

        <div className="flex flex-col gap-4">
          <div className="relative py-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-100"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase tracking-widest font-black text-gray-400">
              <span className="bg-white px-4">Wait time</span>
            </div>
          </div>

          <div className="flex flex-col items-center gap-4">
            {resendCooldown > 0 ? (
              <div className="flex items-center gap-2 px-6 py-3 bg-gray-50 rounded-2xl border border-gray-100">
                <Clock className="h-4 w-4 text-primary animate-pulse" />
                <span className="text-sm font-black text-gray-600">
                  Resend available in <span className="text-primary">{resendCooldown}s</span>
                </span>
              </div>
            ) : (
              <button
                onClick={handleResendOtp}
                disabled={resendLoading}
                className="flex items-center gap-2 px-8 py-3 text-primary font-black hover:bg-primary/5 rounded-2xl transition-all"
              >
                <RotateCcw className={`h-4 w-4 ${resendLoading ? 'animate-spin' : ''}`} />
                Resend Code
              </button>
            )}
          </div>
        </div>

        <button
          onClick={() => navigate(PAGE_ROUTES.LOGIN)}
          className="w-full flex items-center justify-center gap-2 text-sm font-bold text-gray-400 hover:text-primary transition-all group"
        >
          <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
          Return to Login
        </button>
      </div>
    </AuthLayout>
  );
};

export default VerifyOtp;
