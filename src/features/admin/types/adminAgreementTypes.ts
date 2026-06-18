export interface AdminAgreement {
  id: string;
  agreementNumber: string;
  status: string;
  startDate: string;
  endDate: string;
  monthlyRent: number;
  depositAmount: number;
  createdAt: string;
  owner: {
    id: string;
    fullName: string;
    email: string;
  };
  tenant: {
    id: string;
    fullName: string;
    email: string;
  } | null;
  property: {
    id: string;
    title: string;
    locationCity: string;
  };
}

export interface AdminAgreementsResponse {
  agreements: AdminAgreement[];
  total: number;
  page: number;
  limit: number;
  pages: number;
}

export interface AgreementUserDetail {
  id: string;
  fullname: string;
  email: string;
  phone?: string;
  avatarUrl?: string;
}

export interface AdminAgreementDetail {
  id: string;
  agreementNumber: string;
  propertyId: string;
  ownerId: string;
  tenantId: string;

  owner?: AgreementUserDetail;
  tenant?: AgreementUserDetail;

  startDate: string;
  endDate: string;
  lockInPeriodMonths: number;
  noticePeriodMonths: number;

  monthlyRent: number;
  depositAmount: number;
  maintenanceCharges: number;
  maintenanceIncluded: boolean;
  lateFeePerDay: number;
  lateFeeGracePeriodDays: number;
  rentEscalationPercentage: number;

  customClauses?: string;
  tenantRemarks?: string;

  ownerSignatureUrl?: string;
  ownerSignedAt?: string;
  tenantSignatureUrl?: string;
  tenantSignedAt?: string;
  agreementPdfUrl?: string;
  tenantKycDocumentUrl?: string;

  status: string;
  terminationReason?: string;
  terminatedAt?: string;

  depositPaid: boolean;
  depositPaidAt?: string;
  depositRefundStatus?: string;
  depositRefundAmount?: number;
  depositRefundDate?: string;

  createdAt: string;
  updatedAt: string;
}
