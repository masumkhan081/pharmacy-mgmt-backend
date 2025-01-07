import * as z from "zod";

export const brandSchema = z.object({
  generic: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid ObjectId"),
  manufacturer: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid ObjectId"),
  name: z
    .string()
    .min(3, "Brand name must be at least 3 characters long")
    .max(35, "Brand name cannot exceed 35 characters"),
});

export const brandUpdateSchema = brandSchema.partial();
