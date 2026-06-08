import { axiosApi } from "../../../services/api/axiosInstance";
import { API_ROUTES } from "../../../config/routes";

export interface Agreement {
    id: string;
    agreementNumber: string;
    propertyId: string;
    ownerId: string;
    tenantId: string;
    status: string;
    startDate: string;
    endDate: string;
    monthlyRent: number;
    depositAmount: number;
    lockInPeriodMonths?: number;
    noticePeriodMonths?: number;
    agreementPdfUrl?: string;
    ownerSignatureUrl?: string;
    tenantSignatureUrl?: string;
    tenantKycDocumentUrl?: string;
}

export interface UploadPresetFile {
    fileName: string;
    contentType: string;
}

export interface S3UploadResult {
    key: string;
    uploadUrl: string;
    publicUrl: string;
}

export const createAgreement = async (data: Partial<Agreement>): Promise<Agreement> => {
    const response = await axiosApi.post(API_ROUTES.CREATE_AGREEMENT, data);
    return response.data.data;
};

export const signOwner = async (id: string, signatureUrl: string): Promise<void> => {
    await axiosApi.post(API_ROUTES.SIGN_OWNER(id), { signatureUrl });
};

export const signTenant = async (id: string, signatureUrl: string): Promise<{ pdfUrl: string }> => {
    const response = await axiosApi.post(API_ROUTES.SIGN_TENANT(id), { signatureUrl });
    return response.data.data;
};

export const getAgreementById = async (id: string): Promise<Agreement> => {
    const response = await axiosApi.get(API_ROUTES.GET_AGREEMENT(id));
    return response.data.data;
};

export const getMyAgreements = async (): Promise<Agreement[]> => {
    const response = await axiosApi.get(API_ROUTES.GET_MY_AGREEMENTS);
    return response.data.data;
};

export const uploadKyc = async (id: string, kycUrl: string): Promise<Agreement> => {
    const response = await axiosApi.post(API_ROUTES.UPLOAD_KYC(id), { kycUrl });
    return response.data.data;
};

export const getUploadUrls = async (
    id: string,
    files: UploadPresetFile[]
): Promise<{ uploads: S3UploadResult[] }> => {
    const response = await axiosApi.post(API_ROUTES.GET_AGREEMENT_UPLOAD_URLS(id), { files });
    return response.data.data;
};
