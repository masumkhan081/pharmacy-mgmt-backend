import { z } from "zod";

const practiceLocationSchema = z
  .object({
    name: z.string().optional(),
    address: z
      .object({
        street: z.string().optional(),
        city: z.string().optional(),
        state: z.string().optional(),
        zipCode: z.string().optional(),
        country: z.string().optional(),
      })
      .optional(),
  })
  .optional();

export const createDoctorSchema = z.object({
  fullName: z
    .string()
    .min(2, "Full name must be at least 2 characters long")
    .max(100, "Full name must be at most 100 characters long"),
  specialty: z.string().min(1, "Specialty is required"),
  licenseNumber: z.string().min(1, "License number is required"),
  phone: z
    .string()
    .min(10, "Phone number must be at least 10 characters long")
    .max(15, "Phone number must be at most 15 characters long"),
  email: z
    .string()
    .email("Please enter a valid email address")
    .optional()
    .or(z.literal("")),
  practiceLocation: practiceLocationSchema,
  isActive: z.boolean().default(true),
  notes: z
    .string()
    .max(500, "Notes must be at most 500 characters long")
    .optional(),
});

export const updateDoctorSchema = createDoctorSchema.partial();
