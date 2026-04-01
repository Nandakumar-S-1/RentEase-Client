export type VerificationStatus =
  | "PENDING"
  | "SUBMITTED"
  | "VERIFIED"
  | "REJECTED";

export interface VerificationResponse {
  success: boolean;
  message: string;
  data: {
    id: string;
    ownerId: string;
    documentType: string | null;
    documentUrl: string | null;
    status: VerificationStatus;
    rejectionReason: string | null;
    submittedAt: string;
  };
}

export interface VerificationStatusResponse {
  success: boolean;
  message: string;
  data: {
    verificationStatus: VerificationStatus;
    rejectionReason: string | null;
    documentType: string | null;
    documentUrl: string | null;
  };
}

export interface SubmitVerificationData {
  documentType: string;
  document: File;
}
