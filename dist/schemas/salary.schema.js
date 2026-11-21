"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateSalarySchema = exports.salarySchema = void 0;
const zod_1 = require("zod");
// Aligned to Prisma `Salary` model via `salary.service.createSalary` mapping:
// service maps `data.staff -> staffId`. Fields: staff(uuid), amount, month, year, paidAt?
exports.salarySchema = zod_1.z.object({
    staff: zod_1.z.string().uuid("Invalid staff ID"),
    amount: zod_1.z.number().min(0, "Amount cannot be negative"),
    month: zod_1.z
        .string()
        .min(1, "Month is required")
        .max(20, "Month must be at most 20 characters long"),
    year: zod_1.z
        .number()
        .int("Year must be an integer")
        .min(2000, "Year must be 2000 or later")
        .max(2100, "Year must be 2100 or earlier"),
    paidAt: zod_1.z.coerce.date().optional(),
});
exports.updateSalarySchema = exports.salarySchema.partial();
