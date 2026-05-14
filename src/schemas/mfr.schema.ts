import { z } from "zod";

// Aligned to Prisma `Manufacturer` model:
// { name(unique), address?, email?, phone? }
export const manufacturerSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(100, "Name must be at most 100 characters long"),
  address: z
    .string()
    .max(255, "Address must be at most 255 characters long")
    .optional(),
  email: z
    .string()
    .email("Please enter a valid email address")
    .optional()
    .or(z.literal("")),
  phone: z
    .string()
    .max(20, "Phone number must be at most 20 characters long")
    .optional(),
});

export const updateManufacturerSchema = manufacturerSchema.partial();
