import { z } from "zod";

// Aligned to Prisma `Doctor` model:
// { name, phone?(unique), email?(unique), specialty?, address? }
export const createDoctorSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(100, "Name must be at most 100 characters long"),
  phone: z
    .string()
    .max(20, "Phone number must be at most 20 characters long")
    .optional(),
  email: z
    .string()
    .email("Please enter a valid email address")
    .optional()
    .or(z.literal("")),
  specialty: z
    .string()
    .max(100, "Specialty must be at most 100 characters long")
    .optional(),
  address: z
    .string()
    .max(255, "Address must be at most 255 characters long")
    .optional(),
});

export const updateDoctorSchema = createDoctorSchema.partial();
