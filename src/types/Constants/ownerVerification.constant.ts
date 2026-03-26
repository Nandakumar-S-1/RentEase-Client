export const VerificationStatus = {
  PENDING: "PENDING",
  SUBMITTED: "SUBMITTED",
  VERIFIED: "VERIFIED",
  REJECTED: "REJECTED",
} as const;

export type VerificationStatusType = (typeof VerificationStatus)[keyof typeof VerificationStatus];
