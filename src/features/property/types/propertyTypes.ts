export interface PropertyData {
  id: string;
  ownerId: string;
  title: string;
  description: string;
  propertyType: string;
  locationCity: string;
  locationDistrict: string;
  locationPincode: string;
  fullAddress: string;
  monthlyRent: number;
  depositAmount: number;
  status: string;
  photos: string[];
  primaryPhotoIndex: number;
  createdAt: string;
  areaSqft?: number | null;
  latitude?: number | null;
  longitude?: number | null;
  nearbyLandmarks?: string | null;
  rejectionReason?: string | null;

  // New detailed properties
  bhk?: number | null;
  bathrooms?: number | null;
  floorNumber?: string | null;
  propertyAge?: string | null;
  facingDirection?: string | null;
  furnishingStatus?: string | null;
  amenities?: string[];
  preferredTenantType?: string[];
  maintenanceCharges?: number;
  maintenanceIncluded?: boolean;
  
  // Analytics
  viewsCount?: number;
  wishlistCount?: number;
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

  areaSqft?: number | null;
  latitude?: number | null;
  longitude?: number | null;
  nearbyLandmarks?: string | null;

  bhk?: number | null;
  bathrooms?: number | null;
  floorNumber?: string | null;
  totalFloors?: number | null;
  propertyAge?: string | null;
  facingDirection?: string | null;
  furnishingStatus?: string | null;

  amenities?: string[];
  preferredTenantType?: string[];

  maintenanceCharges?: number;
  maintenanceIncluded?: boolean;
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
