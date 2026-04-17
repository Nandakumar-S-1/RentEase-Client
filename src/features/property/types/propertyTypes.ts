export interface PropertyData {
  id: string;
  title: string;
  description: string;
  propertyType: string;
  locationCity: string;
  locationDistrict: string;
  monthlyRent: number;
  depositAmount: number;
  status: string;
  photos: string[];
  primaryPhotoIndex: number;
  createdAt: string;
}

export interface GetPropertiesParams {
  status?: string;
  page?: number;
  limit?: number;
}

export interface PaginatedPropertyResponse {
  success: boolean;
  data: {
    properties: PropertyData[];
    total: number;
    page: number;
    limit: number;
  };
}

export interface CreatePropertyData {
  title: string;
  description: string;
  propertyType: string;

  locationDistrict: string;
  locationCity: string;
  locationPinCode: string;
  fullAddress: string;

  monthlyRent: number;
  depositAmount: number;

  photos?: string[];
  primaryPhotoIndex?: number;
}

export interface PropertyPhotoUpload {
  key: string;
  uploadUrl: string;
  publicUrl: string;
}

export interface UploadPropertyPhotosUrlsResponse {
  success: boolean;
  data: {
    uploads: PropertyPhotoUpload[];
  };
}

export interface CreatePropertyResponse {
  success: boolean;
  data: {
    id: string;
    title: string;
    status: string;
  };
}
