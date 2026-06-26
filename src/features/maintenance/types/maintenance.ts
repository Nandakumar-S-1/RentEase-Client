export const MaintenanceStatus = {
  PENDING: "PENDING",
  ASSIGNED: "ASSIGNED",
  IN_PROGRESS: "IN_PROGRESS",
  COMPLETED: "COMPLETED",
  VERIFIED: "VERIFIED",
  DISPUTED: "DISPUTED",
  CANCELLED: "CANCELLED",
} as const;

export type MaintenanceStatus =
  (typeof MaintenanceStatus)[keyof typeof MaintenanceStatus];

export const MaintenanceUrgency = {
  LOW: "LOW",
  MEDIUM: "MEDIUM",
  HIGH: "HIGH",
  CRITICAL: "CRITICAL",
} as const;

export type MaintenanceUrgency =
  (typeof MaintenanceUrgency)[keyof typeof MaintenanceUrgency];

export interface MaintenanceRequest {
  id: string;
  requestNumber: string;
  propertyId: string;
  tenantId: string;
  ownerId: string;
  issueType: string;
  issueTitle: string;
  issueDescription: string;
  urgencyLevel: MaintenanceUrgency | string;
  photos: string[];
  preferredVisitDate: string | null;
  preferredVisitTimeStart: string | null;
  preferredVisitTimeEnd: string | null;
  availableAnytime: boolean;
  assignedProviderId: string | null;
  providerAcceptedAt: string | null;
  providerEtaMinutes: number | null;
  providerArrivalTime: string | null;
  status: MaintenanceStatus | string;
  workStartedAt: string | null;
  workCompletedAt: string | null;
  completionPhotos: string[];
  workDescription: string | null;
  actualCost: number | null;
  costPaidBy: string | null;
  isVerifiedByTenant: boolean;
  tenantVerificationStatus: string | null;
  tenantRating: number | null;
  tenantFeedback: string | null;
  verifiedAt: string | null;
  isDisputed: boolean;
  disputeReason: string | null;
  submittedAt: string;
  updatedAt: string;
  closedAt: string | null;
  propertyTitle?: string;
  tenantName?: string;
  providerName?: string;
}

export interface CreateMaintenanceRequestPayload {
  propertyId: string;
  issueType: string;
  issueTitle: string;
  issueDescription: string;
  urgencyLevel: MaintenanceUrgency | string;
  photos: string[];
  preferredVisitDate?: string;
  preferredVisitTimeStart?: string;
  preferredVisitTimeEnd?: string;
  availableAnytime?: boolean;
}
