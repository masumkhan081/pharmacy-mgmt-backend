import { z } from "zod";

export const genericSchema = z.object({
  group: z.string().uuid(),
  name: z
    .string()
    .min(3, "Generic name must be at least 3 characters long")
    .max(35, "Generic name cannot exceed 35 characters"),
});

export const genericUpdateSchema = genericSchema.partial();
