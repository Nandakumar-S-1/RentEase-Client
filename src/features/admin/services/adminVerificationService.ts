import { axiosApi } from "../../../services/api/axiosInstance";
import { API_ROUTES } from "../../../config/routes";

export interface PendingOwner {
    id: string;
    ownerId: string;
    documentType: string;
    documentUrl: string | null;
    status: string;
}

interface PendingOwnersResponse {
    success: boolean;
    message: string;
    data: PendingOwner[];
}

interface VerificationActionResponse {
    success: boolean;
    message: string;
}

export const getPendingOwners = async (): Promise<PendingOwnersResponse> => {
    const response = await axiosApi.get(API_ROUTES.ADMIN_PENDING_OWNERS);
    return response.data;
};

export const verifyOwner = async (ownerId: string): Promise<VerificationActionResponse> => {
    const response = await axiosApi.patch(API_ROUTES.ADMIN_VERIFY_OWNER(ownerId));
    return response.data;
};

export const rejectOwner = async (ownerId: string, rejectionReason: string): Promise<VerificationActionResponse> => {
    const response = await axiosApi.patch(API_ROUTES.ADMIN_REJECT_OWNER(ownerId), { rejectionReason });
    return response.data;
};
