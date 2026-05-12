import { z } from "zod";

export const drugSchema = z.object({
  brand: z.string().min(1, "Brand ID is required"),
  formulation: z.string().min(1, "Formulation ID is required"),
  strength: z.number().min(0, "Strength must be positive"),
  unit: z.string().min(1, "Unit ID is required"),
  mrp: z.number().min(0, "MRP must be positive"),
  purchasePrice: z.number().optional(),
  status: z.enum(["ACTIVE", "INACTIVE"]).optional(),
});

export const drugUpdateSchema = drugSchema.partial();
