import { z } from "zod";

const addressSchema = z
  .object({
    street: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    zipCode: z.string().optional(),
    country: z.string().optional(),
  })
  .optional();

export const createCustomerSchema = z.object({
  fullName: z
    .string()
    .min(2, "Full name must be at least 2 characters long")
    .max(100, "Full name must be at most 100 characters long"),
  phone: z
    .string()
    .min(10, "Phone number must be at least 10 characters long")
    .max(15, "Phone number must be at most 15 characters long"),
  altPhone: z
    .string()
    .min(10, "Alternate phone number must be at least 10 characters long")
    .max(15, "Alternate phone number must be at most 15 characters long")
    .optional(),
  email: z
    .string()
    .email("Please enter a valid email address")
    .optional()
    .or(z.literal("")),
  dateOfBirth: z.coerce.date().optional(),
  gender: z.enum(["MALE", "FEMALE", "OTHER"]).optional(),
  address: addressSchema,
  allergies: z.array(z.string()).optional(),
  medicalConditions: z.array(z.string()).optional(),
  isActive: z.boolean().default(true),
  loyaltyPoints: z
    .number()
    .min(0, "Loyalty points cannot be negative")
    .default(0),
  notes: z
    .string()
    .max(500, "Notes must be at most 500 characters long")
    .optional(),
});

export const updateCustomerSchema = createCustomerSchema.partial();
