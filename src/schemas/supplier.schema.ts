import * as z from "zod";

export const supplierSchema = z.object({
  fullName: z
    .string()
    .min(1, "Full name must be at least 1 character long.")
    .max(100, "Full name must be at most 100 characters long."),
  phone: z
    .string()
    .min(10, "Phone number must be at least 10 characters long.")
    .max(15, "Phone number must be at most 15 characters long."),
  altPhone: z
    .string()
    .min(10, "Phone number must be at least 10 characters long.")
    .max(15, "Phone number must be at most 15 characters long."),
  gender: z.enum(["MALE", "FEMALE", "OTHER"]),
  email: z.string().email("Please enter a valid email address."),
  designation: z.enum(["admin", "manager", "pharmacist", "salesman"]),
  address: z.string().max(55, "Address must be at most 55 characters long."),
  shift: z.enum(["Morning", "Afternoon", "Night"]),
  salaryType: z.enum(["Hourly", "Weekly", "Monthly"]),
  hourlySalary: z.number().min(0, "Hourly salary cannot be negative."),
  weeklySalary: z.number().min(0, "Weekly salary cannot be negative."),
  monthlySalary: z.number().min(0, "Monthly salary cannot be negative."),
  hoursPerDay: z
    .number()
    .min(1, "Hours per day must be at least 1 hour.")
    .max(24, "Hours per day cannot exceed 24 hours."),
  daysPerWeek: z
    .number()
    .min(1, "Days per week must be at least 1 day.")
    .max(7, "Days per week cannot exceed 7 days."),
  isActive: z.boolean().default(false),
});
