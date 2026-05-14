import { z } from "zod";

// Aligned to Prisma `Formulation` model:
// { name(unique) }
export const formulationSchema = z.object({
  name: z
    .string()
    .min(1, "Formulation name is required")
    .max(50, "Formulation name must be at most 50 characters long"),
});

export const updateFormulationSchema = formulationSchema.partial();
