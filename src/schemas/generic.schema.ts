import { z } from "zod";

// Aligned to Prisma `Generic` model:
// { name(unique), description? }
export const genericSchema = z.object({
  name: z
    .string()
    .min(1, "Generic name is required")
    .max(50, "Generic name must be at most 50 characters long"),
  description: z
    .string()
    .max(500, "Description must be at most 500 characters long")
    .optional(),
});

export const genericUpdateSchema = genericSchema.partial();
