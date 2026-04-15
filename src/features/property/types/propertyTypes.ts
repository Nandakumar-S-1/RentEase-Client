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
