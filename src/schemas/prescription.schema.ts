import { z } from "zod";

// Aligned to Prisma `Prescription` model — intentionally minimal (scanned-doc oriented):
// { patientName, doctorName?, details?, image? }
export const createPrescriptionSchema = z.object({
  patientName: z
    .string()
    .min(1, "Patient name is required")
    .max(100, "Patient name must be at most 100 characters long"),
  doctorName: z
    .string()
    .max(100, "Doctor name must be at most 100 characters long")
    .optional(),
  details: z
    .string()
    .max(2000, "Details must be at most 2000 characters long")
    .optional(),
  image: z
    .string()
    .max(500, "Image path/URL must be at most 500 characters long")
    .optional(),
});

export const updatePrescriptionSchema = createPrescriptionSchema.partial();
