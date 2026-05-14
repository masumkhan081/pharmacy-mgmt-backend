import { z } from "zod";

// Aligned to Prisma `Salary` model via `salary.service.createSalary` mapping:
// service maps `data.staff -> staffId`. Fields: staff(uuid), amount, month, year, paidAt?
export const salarySchema = z.object({
  staff: z.string().uuid("Invalid staff ID"),
  amount: z.number().min(0, "Amount cannot be negative"),
  month: z
    .string()
    .min(1, "Month is required")
    .max(20, "Month must be at most 20 characters long"),
  year: z
    .number()
    .int("Year must be an integer")
    .min(2000, "Year must be 2000 or later")
    .max(2100, "Year must be 2100 or earlier"),
  paidAt: z.coerce.date().optional(),
});

export const updateSalarySchema = salarySchema.partial();
