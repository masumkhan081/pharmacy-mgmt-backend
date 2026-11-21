"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateStaffSchema = exports.staffSchema = void 0;
const zod_1 = require("zod");
// Aligned to Prisma `Staff` model:
// { name, phone?(unique), email?(unique), role?, salary? }
exports.staffSchema = zod_1.z.object({
    name: zod_1.z
        .string()
        .min(1, "Name is required")
        .max(100, "Name cannot exceed 100 characters"),
    phone: zod_1.z
        .string()
        .max(20, "Phone number must be at most 20 characters long")
        .optional(),
    email: zod_1.z
        .string()
        .email("Please enter a valid email address")
        .optional()
        .or(zod_1.z.literal("")),
    role: zod_1.z
        .string()
        .max(50, "Role must be at most 50 characters long")
        .optional(),
    salary: zod_1.z
        .number()
        .min(0, "Salary cannot be negative")
        .optional(),
});
exports.updateStaffSchema = exports.staffSchema.partial();
