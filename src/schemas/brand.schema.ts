import * as z from "zod";

export const brandSchema = z.object({
  generic: z.string().uuid(),
  manufacturer: z.string().uuid(),
  name: z
    .string()
    .min(3, "Brand name must be at least 3 characters long")
    .max(35, "Brand name cannot exceed 35 characters"),
});

export const brandUpdateSchema = brandSchema.partial();
