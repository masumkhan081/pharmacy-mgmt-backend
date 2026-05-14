import { z } from "zod";

// Aligned to Prisma `Customer` model:
// { fullName, phone?(unique), email?(unique), address? }
export const createCustomerSchema = z.object({
  fullName: z
    .string()
    .min(1, "Full name is required")
    .max(100, "Full name must be at most 100 characters long"),
  phone: z
    .string()
    .max(20, "Phone number must be at most 20 characters long")
    .optional(),
  email: z
    .string()
    .email("Please enter a valid email address")
    .optional()
    .or(z.literal("")),
  address: z
    .string()
    .max(255, "Address must be at most 255 characters long")
    .optional(),
});

export const updateCustomerSchema = createCustomerSchema.partial();
