export interface UserResponse {
  id: string;
  email: string;
  fullname: string;
  phone: string;
  role: "ADMIN" | "OWNER" | "TENANT";
  isEmailVerified: boolean;
  isActive: boolean;
  isSuspended: boolean;
  createdAt: string;
}
