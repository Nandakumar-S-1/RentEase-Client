import { z } from "zod";
import { PropertyTypes } from "../../../types/constants/property.constant";

export const propertySchema = z.object({
  title: z
    .string()
    .min(5, "Title must be at least 5 characters")
    .max(100, "Title cannot exceed 100 characters"),
  description: z
    .string()
    .min(20, "Description must be at least 20 characters")
    .max(2000, "Description is too long"),
  propertyType: z.nativeEnum(PropertyTypes),
  bhk: z.coerce.number().int().positive().optional().nullable(),
  bathrooms: z.coerce.number().int().positive().optional().nullable(),
  floorNumber: z.string().optional().nullable(),
  totalFloors: z.coerce.number().int().positive().optional().nullable(),
  propertyAge: z.string().optional().nullable(),
  facingDirection: z.string().optional().nullable(),
  furnishingStatus: z.string().optional().nullable(),

  locationDistrict: z.string().min(2, "District is required"),
  locationCity: z.string().min(2, "City is required"),
  locationPinCode: z
    .string()
    .regex(/^\d{6}$/, "Pin code must be exactly 6 digits"),
  fullAddress: z.string().min(10, "Address must be at least 10 characters"),
  nearbyLandmarks: z.string().max(200).optional().nullable(),
  latitude: z.number().optional().nullable(),
  longitude: z.number().optional().nullable(),

  amenities: z.array(z.string()).optional(),
  preferredTenantType: z.array(z.string()).optional(),
  petsAllowed: z.boolean().optional().default(false),
  smokingAllowed: z.boolean().optional().default(false),
  maximumOccupants: z.coerce.number().int().positive().optional().nullable(),
  landType: z.string().optional().nullable(),
  isCornerPlot: z.boolean().optional().nullable(),
  roadWidthFeet: z.coerce.number().nonnegative().optional().nullable(),
  shopType: z.string().optional().nullable(),
  hasParking: z.boolean().optional().nullable(),

  monthlyRent: z.coerce.number().positive("Rent must be a positive number"),
  depositAmount: z.coerce
    .number()
    .positive("Deposit must be a positive number"),
  maintenanceCharges: z.coerce.number().nonnegative().optional().default(0),
  maintenanceIncluded: z.boolean().optional().default(false),
  areaSqft: z.coerce
    .number()
    .positive("Area must be positive")
    .optional()
    .nullable(),
});

export const serviceProviderSchema = z
  .object({
    providerName: z
      .string()
      .min(3, "Name must be at least 3 characters")
      .max(100, "Name is too long"),
    providerType: z.string().min(1, "Service category is required"),
    phone: z
      .string()
      .regex(/^\+?[\d\s-]{10,}$/, "Invalid phone number (minimum 10 digits)"),
    typicalChargesMin: z.coerce
      .number()
      .nonnegative("Charges cannot be negative")
      .optional(),
    typicalChargesMax: z.coerce
      .number()
      .nonnegative("Charges cannot be negative")
      .optional(),
  })
  .refine(
    (data) => {
      if (
        data.typicalChargesMin !== undefined &&
        data.typicalChargesMax !== undefined
      ) {
        return data.typicalChargesMax >= data.typicalChargesMin;
      }
      return true;
    },
    {
      message: "Max charge must be greater than or equal to min charge",
      path: ["typicalChargesMax"],
    },
  );

export const propertyFilterSchema = z.object({
  query: z.string().optional(),
  city: z.string().optional(),
  district: z.string().optional(),
  propertyType: z.string().optional(),
  minRent: z.coerce.number().nonnegative().optional(),
  maxRent: z.coerce.number().nonnegative().optional(),
  minArea: z.coerce.number().nonnegative().optional(),
  maxArea: z.coerce.number().nonnegative().optional(),
  bhk: z.coerce.number().int().positive().optional(),
  amenities: z.array(z.string()).optional(),
});
