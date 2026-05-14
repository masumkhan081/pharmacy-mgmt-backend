import { z } from "zod";

// Aligned to Prisma `Staff` model:
// { name, phone?(unique), email?(unique), role?, salary? }
export const staffSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(100, "Name cannot exceed 100 characters"),
  phone: z
    .string()
    .max(20, "Phone number must be at most 20 characters long")
    .optional(),
  email: z
    .string()
    .email("Please enter a valid email address")
    .optional()
    .or(z.literal("")),
  role: z
    .string()
    .max(50, "Role must be at most 50 characters long")
    .optional(),
  salary: z
    .number()
    .min(0, "Salary cannot be negative")
    .optional(),
});

export const updateStaffSchema = staffSchema.partial();
