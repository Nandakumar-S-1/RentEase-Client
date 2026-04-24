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
  ADMIN_USER_DETAIL: "/admin/users/:id",
  OWNER_VERIFICATION: "/owner/verify",
  MESSAGES: "/messages",
  OWNER_PROPERTIES: "/owner/properties",
  OWNER_AGREEMENTS: "/owner/agreements",
  OWNER_PAYMENTS: "/owner/payments",
  OWNER_MAINTENANCE: "/owner/maintenance",
  OWNER_SUBSCRIPTION: "/owner/subscription",
  OWNER_ADD_PROPERTY: "/owner/properties/add",
  OWNER_EDIT_PROPERTY: "/owner/properties/edit/:id",
  OWNER_PROPERTY_DETAIL: "/owner/properties/:id",
  OWNER_PROPERTY_SERVICE_PROVIDERS:
    "/owner/properties/:propertyId/service-providers",
  TENANT_AGREEMENTS: "/tenant/agreements",
  TENANT_PAYMENTS: "/tenant/payments",
  TENANT_MAINTENANCE: "/tenant/maintenance",
  TENANT_WISHLIST: "/tenant/wishlist",
  ADMIN_PROPERTIES: "/admin/properties",
  ADMIN_PROPERTY_DETAIL: "/admin/properties/:id",
  ADMIN_OWNERS: "/admin/owners",
  ADMIN_AGREEMENTS: "/admin/agreements",
  ADMIN_PAYMENTS: "/admin/payments",
  ADMIN_FLAGGED: "/admin/flagged",
  ADMIN_ANALYTICS: "/admin/analytics",
  ADMIN_SETTINGS: "/admin/settings",
  PROPERTY_DETAIL: "/properties/:id",
  SEARCH_PROPERTIES: "/search",
  ONBOARDING: "/onboarding",
} as const;


export const API_ROUTES = {
  REGISTER: "/users/register",
  LOGIN: "/users/login",
  GOOGLE_AUTH: "/users/google-auth",
  VERIFY_OTP: "/users/verify-otp",
  RESEND_OTP: "/users/resend-otp",
  FORGOT_PASSWORD: "/users/forgot-password",
  REFRESH_TOKEN: "/users/refresh-token",
  LOGOUT: "/users/logout",
  ME: "/users/me",

  ADMIN_LOGIN: "/admin/login",
  ADMIN_GOOGLE_LOGIN: "/admin/google-login",
  ADMIN_USERS: "/admin/users",
  ADMIN_SUSPEND_USER: (userId: string) => `/admin/users/suspend/${userId}`,
  ADMIN_ACTIVATE_USER: (userId: string) => `/admin/users/activate/${userId}`,
  ADMIN_DEACTIVATE_USER: (userId: string) =>
    `/admin/users/deactivate/${userId}`,
  ADMIN_USER_DETAILS: (userId: string) => `/admin/users/${userId}`,

  SUBMIT_VERIFICATION: "/owner/submit-verification",
  VERIFICATION_STATUS: "/owner/verification-status",
  ADMIN_PENDING_OWNERS: "/admin/owners/pending",
  ADMIN_OWNER_DETAILS: (id: string) => `/admin/owners/${id}`,
  ADMIN_VERIFY_OWNER: (id: string) => `/admin/owners/${id}/verify`,
  ADMIN_REJECT_OWNER: (id: string) => `/admin/owners/${id}/reject`,

  PROFILE: "/profile",
  UPDATE_PROFILE: "/profile",
  UPLOAD_AVATAR: "/profile/avatar",
  GET_OWNER_PROPERTIES: "/properties/owner",
  CREATE_PROPERTY: "/properties",
  UPLOAD_PROPERTY_PHOTOS_URLS: "/properties/photos/upload-urls",
  ADMIN_PENDING_PROPERTIES: "/admin/properties/pending",
  ADMIN_VERIFY_PROPERTY: (id: string) => `/admin/properties/${id}/verify`,
  ADMIN_REJECT_PROPERTY: (id: string) => `/admin/properties/${id}/reject`,
  GET_PROPERTY_BY_ID: (id: string) => `/properties/${id}`,
  SEARCH_PROPERTIES: "/properties",

  WISHLIST: "/wishlist",
  TOGGLE_WISHLIST: (propertyId: string) => `/wishlist/${propertyId}`,
  CHECK_WISHLISTED: (propertyId: string) => `/wishlist/check/${propertyId}`,
} as const;

export const PATH_ROUTES = {
  PATH_LOGIN: "/login",
  PATH_USERS: "/users",
  PATH_DASHBOARD: "/dashboard",
  PATH_OWNERS: "/owners",
<<<<<<< HEAD
  PATH_DETAILS:'users/:id'
=======
  PATH_PROPERTIES: 'properties',
  PATH_PROPERTY_DETAILS: "/properties/:id",
  PATH_USER_DETAILS: "/users/:id",
>>>>>>> 8176578 (fix: remove mapbox token and use env variables)
};
