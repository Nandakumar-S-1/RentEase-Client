import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { RotateCcw, ArrowLeft, Clock } from 'lucide-react';
import { useVerifyOtp } from '../hooks/useVerifyOtp';
import { useResendOtp } from '../hooks/useResendOtp';
import { Button, FormMessage, AuthLayout } from '../../../components/common';
import { PAGE_ROUTES } from '../../../config/routes';

const VerifyOtp = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const email = searchParams.get('email') || '';

  const { verify, isLoading, error: verifyError, successMessage } = useVerifyOtp();
  const { resend, isLoading: resendLoading, error: resendError, successMessage: resendSuccess } = useResendOtp();

  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [resendCooldown, setResendCooldown] = useState(0);

  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  const message = successMessage || resendSuccess || verifyError || resendError || '';
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
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    const pasted = e.clipboardData.getData('text').trim();
    if (!/^\d{6}$/.test(pasted)) return;

    const newOtp = pasted.split('');
    setOtp(newOtp);
    otpRefs.current[5]?.focus();
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();

    const otpString = otp.join('');
    if (otpString.length !== 6) return;

    await verify(email, otpString);

    // If verification failed, reset OTP inputs
    if (verifyError) {
      setOtp(['', '', '', '', '', '']);
      otpRefs.current[0]?.focus();
    }
  };

  const handleResendOtp = async () => {
    await resend(email);
    setOtp(['', '', '', '', '', '']);
    otpRefs.current[0]?.focus();
    setResendCooldown(60);
  };

  return (
    <AuthLayout
      title="Verify your email"
      subtitle="Enter the 6-digit code we sent to your email"
      showLeftPanel={false}
    >
      <FormMessage message={message} isError={isError} />

      <form onSubmit={handleVerifyOtp} className="space-y-6">
        <div
          className="flex gap-2 justify-center"
          onPaste={handlePaste}
        >
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
              onChange={(e) =>
                handleOtpChange(index, e.target.value)
              }
              onKeyDown={(e) => handleKeyDown(index, e)}
              className="h-12 w-12 rounded-lg border-2 border-gray-200 text-center text-lg font-bold focus:border-primary focus:outline-none transition"
              placeholder="•"
            />
          ))}
        </div>

        <Button
          type="submit"
          loading={isLoading}
          disabled={otp.join('').length !== 6 || isLoading}
          className="w-full"
        >
          Verify Email
        </Button>
      </form>

      <div className="mt-6 flex flex-col gap-3 border-t border-gray-200 pt-6">
        <p className="text-center text-sm text-muted-foreground">
          Didn't receive the code?
        </p>

        <Button
          onClick={handleResendOtp}
          loading={resendLoading}
          disabled={resendCooldown > 0 || resendLoading}
          variant="outline"
          className="w-full"
          icon={
            resendCooldown > 0 ? (
              <Clock className="h-4 w-4" />
            ) : (
              <RotateCcw className="h-4 w-4" />
            )
          }
        >
          {resendCooldown > 0
            ? `Retry in ${resendCooldown}s`
            : 'Resend code'}
        </Button>
      </div>

      <button
        onClick={() => navigate(PAGE_ROUTES.LOGIN)}
        className="mt-8 flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-primary transition"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to sign in
      </button>
    </AuthLayout>
  );
};

export default VerifyOtp;
