import { z } from "zod";

// Aligned to Prisma `Supplier` model:
// { name(unique), contactPerson?, phone?, email?, address? }
export const supplierSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(100, "Name must be at most 100 characters long"),
  contactPerson: z
    .string()
    .max(100, "Contact person must be at most 100 characters long")
    .optional(),
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

export const updateSupplierSchema = supplierSchema.partial();
