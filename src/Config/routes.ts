export const buildRoutes = {
  register: (role: string) => `/register?role=${role}`,
  verifyOtp: (email: string) => `/verify-otp?email=${email}`,
};

export const PAGE_ROUTES = {
  HOME: "/",
  REGISTER: "/register",
  LOGIN: "/login",
  ADMIN_LOGIN: "/admin/login",
  FORGOT_PASSWORD: "/forgot-password",
  RESEND_OTP: "/resend-otp",
  VERIFY_OTP: "/verify-otp",
  DASHBOARD: "/dashboard",
  PROFILE: "/profile",
  ADMIN_USERS: "/admin/users",
  OWNER_VERIFICATION: "/owner/verify",
} as const;

export const API_ROUTES = {
  REGISTER: "/users/register",
  LOGIN: "/users/login",
  GOOGLE_AUTH: "/users/google-auth",
  VERIFY_OTP: "/users/verify-otp",
  RESEND_OTP: "/users/resend-otp",
  FORGOT_PASSWORD: "/users/forgot-password",
  REFRESH_TOKEN: "/users/refresh-token",
  ME: "/users/me",

  ADMIN_LOGIN: "/admin/login",
  ADMIN_GOOGLE_LOGIN: "/admin/google-login",
  ADMIN_USERS: "/admin/users",
  ADMIN_SUSPEND_USER: (userId: string) => `/admin/users/suspend/${userId}`,
  ADMIN_ACTIVATE_USER: (userId: string) => `/admin/users/activate/${userId}`,
  ADMIN_DEACTIVATE_USER: (userId: string) =>
    `/admin/users/deactivate/${userId}`,

  SUBMIT_VERIFICATION: "/owner/submit-verification",
  VERIFICATION_STATUS: "/owner/verification-status",
  ADMIN_PENDING_OWNERS: "/admin/owners/pending",
  ADMIN_OWNER_DETAILS: (id: string) => `/admin/owners/${id}`,
  ADMIN_VERIFY_OWNER: (id: string) => `/admin/owners/${id}/verify`,
  ADMIN_REJECT_OWNER: (id: string) => `/admin/owners/${id}/reject`,

  PROFILE: "/profile",
  UPDATE_PROFILE: "/profile",
} as const;

export const PATH_ROUTES = {
  PATH_LOGIN: "/login",
  PATH_USERS: "/users",
  PATH_DASHBOARD: "/dashboard",
  PATH_OWNERS: "/owners",
};
