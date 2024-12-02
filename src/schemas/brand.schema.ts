import * as z from "zod";

export const brandSchema = z.object({
  generic: z.string(), // Assuming generic ID is a string
  mfr: z.string(), // Assuming manufacturer ID is a string
  name: z
    .string()
    .min(3, "Brand name must be at least 3 characters long")
    .max(35, "Brand name cannot exceed 35 characters"),
});
