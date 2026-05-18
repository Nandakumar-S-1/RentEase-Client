export const PropertyStatus = {
  PENDING_APPROVAL: "PENDING_APPROVAL",
  ACTIVE: "ACTIVE",
  UNLISTED: "UNLISTED",
  REJECTED: "REJECTED",
  PENDING: "PENDING",
} as const;

export type PropertyStatusType =
  (typeof PropertyStatus)[keyof typeof PropertyStatus];

export const PropertyTypes = {
  FLAT: "FLAT",
  HOUSE: "HOUSE",
  PG: "PG",
  SHOP: "SHOP",
  LAND: "LAND",
} as const;

export type PropertyType = (typeof PropertyTypes)[keyof typeof PropertyTypes];

export const FurnishingStatus = {
  UNFURNISHED: "Unfurnished",
  SEMI_FURNISHED: "Semi-Furnished",
  FULLY_FURNISHED: "Fully Furnished",
} as const;

export const FACING_DIRECTIONS = ["North", "South", "East", "West"] as const;

export const TenantTypePref = {
  FAMILY: "Family",
  BACHELORS: "Bachelors",
  COMPANY: "Company",
  ANYONE: "Anyone",
} as const;

export const AMENITIES_OPTIONS = [
  "2-wheeler Parking",
  "4-wheeler Parking",
  "WIFI",
  "Power Backup",
  "Water Supply 24/7",
  "Security",
  "Lift",
  "Gym",
  "Swimming Pool",
  "Club House",
  "Park",
  "Intercom",
] as const;

export const LAND_AMENITIES = [
  "Fenced Boundary",
  "Gate Protected",
  "Security Guard",
  "Water Connection",
  "Electricity Connection",
  "Road Access",
  "Corner Plot",
] as const;
