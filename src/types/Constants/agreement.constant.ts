export const AgreementStatus = {
  DRAFT: "DRAFT",
  PENDING_TENANT_SIGNATURE: "PENDING_TENANT_SIGNATURE",
  PENDING_PAYMENT: "PENDING_PAYMENT",
  ACTIVE: "ACTIVE",
  EXPIRED: "EXPIRED",
  TERMINATED: "TERMINATED",
} as const;

export type AgreementStatusType =
  (typeof AgreementStatus)[keyof typeof AgreementStatus];

export const DepositRefundStatus = {
  PENDING: "PENDING",
  PARTIAL: "PARTIAL",
  FULL: "FULL",
  DISPUTED: "DISPUTED",
} as const;

export type DepositRefundStatusType =
  (typeof DepositRefundStatus)[keyof typeof DepositRefundStatus];
