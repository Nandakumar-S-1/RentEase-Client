export const RoleTypes = {
  ADMIN_USER: "ADMIN",
  OWNER_USER: "OWNER",
  TENANT_USER: "TENANT",
} as const;

export type RoleType = (typeof RoleTypes)[keyof typeof RoleTypes];


export type UserType = 'OWNERS' | 'TENANTS';
