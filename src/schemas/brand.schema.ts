import { z } from "zod";

// Aligned to Prisma `Brand` model:
// { name(unique), origin? }
export const brandSchema = z.object({
  name: z
    .string()
    .min(1, "Brand name is required")
    .max(50, "Brand name must be at most 50 characters long"),
  origin: z
    .string()
    .max(100, "Origin must be at most 100 characters long")
    .optional(),
});

export const brandUpdateSchema = brandSchema.partial();
