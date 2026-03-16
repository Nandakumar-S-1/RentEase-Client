export const PAGE_ROUTES = {
  HOME: '/',
  REGISTER: '/register',
  LOGIN: '/login',
  ADMIN_LOGIN: '/admin/login',
  FORGOT_PASSWORD: '/forgot-password',
  RESEND_OTP: '/resend-otp',
  VERIFY_OTP: '/verify-otp',
  DASHBOARD: '/dashboard',
  ADMIN_USERS: '/admin/users',
  OWNER_VERIFICATION: '/owner/verify',
} as const;

export const API_ROUTES = {
  REGISTER: '/users/register',
  LOGIN: '/users/login',
  ADMIN_LOGIN: '/admin/login',
  GOOGLE_AUTH: '/users/google-auth',
  VERIFY_OTP: '/users/verify-otp',
  RESEND_OTP: '/users/resend-otp',
  FORGOT_PASSWORD: '/users/forgot-password',
  REFRESH_TOKEN: '/users/refresh-token',
} as const;
