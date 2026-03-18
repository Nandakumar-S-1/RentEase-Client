// export const ROUTES = {
//   HOME: "/",
//   LOGIN: "/login",
//   REGISTER: "/register",
//   VERIFY_OTP: "/verify-otp",
// };

export const buildRoutes = {
  register: (role: string) => `/register?role=${role}`,
  verifyOtp: (email: string) => `/verify-otp?email=${email}`,
};

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
  GOOGLE_AUTH: '/users/google-auth',
  VERIFY_OTP: '/users/verify-otp',
  RESEND_OTP: '/users/resend-otp',
  FORGOT_PASSWORD: '/users/forgot-password',
  REFRESH_TOKEN: '/users/refresh-token',

  ADMIN_LOGIN: '/admin/login',
  ADMIN_USERS: "/admin/users",
  ADMIN_SUSPEND_USER: (userId: string) => `/admin/users/suspend/${userId}`,
  ADMIN_ACTIVATE_USER: (userId: string) => `/admin/users/activate/${userId}`,
  ADMIN_DEACTIVATE_USER: (userId: string) => `/admin/users/deactivate/${userId}`,
} as const;
