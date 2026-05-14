import { z } from "zod";

// Aligned to Prisma `Unit` model:
// { name(unique) }
export const createUnitSchema = z.object({
  name: z
    .string()
    .min(1, "Unit name is required")
    .max(50, "Unit name must be at most 50 characters long"),
});

export const updateUnitSchema = createUnitSchema.partial();
