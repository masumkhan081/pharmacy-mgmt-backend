"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateManufacturerSchema = exports.manufacturerSchema = void 0;
const zod_1 = require("zod");
// Aligned to Prisma `Manufacturer` model:
// { name(unique), address?, email?, phone? }
exports.manufacturerSchema = zod_1.z.object({
    name: zod_1.z
        .string()
        .min(1, "Name is required")
        .max(100, "Name must be at most 100 characters long"),
    address: zod_1.z
        .string()
        .max(255, "Address must be at most 255 characters long")
        .optional(),
    email: zod_1.z
        .string()
        .email("Please enter a valid email address")
        .optional()
        .or(zod_1.z.literal("")),
    phone: zod_1.z
        .string()
        .max(20, "Phone number must be at most 20 characters long")
        .optional(),
});
exports.updateManufacturerSchema = exports.manufacturerSchema.partial();
