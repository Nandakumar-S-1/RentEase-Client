import type { RoleType } from "../../../types/constants/role.constant";

export interface UserResponse {
  id: string;
  email: string;
  fullname: string;
  phone: string;
  role: RoleType;
  isEmailVerified: boolean;
  isActive: boolean;
  isSuspended: boolean;
  createdAt: string;
}
