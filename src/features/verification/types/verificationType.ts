export type VerificationStatus = 'PENDING' | 'SUBMITTED' | 'VERIFIED' | 'REJECTED';

export interface VerificationResponse {
    success: boolean;
    message: string;
    data: {
        id: string;
        ownerId: string;
        documentType: string;
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
    };
}

export interface SubmitVerificationData {
    documentType: string;
    document: File;
}