"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateSupplierSchema = exports.supplierSchema = void 0;
const zod_1 = require("zod");
// Aligned to Prisma `Supplier` model:
// { name(unique), contactPerson?, phone?, email?, address? }
exports.supplierSchema = zod_1.z.object({
    name: zod_1.z
        .string()
        .min(1, "Name is required")
        .max(100, "Name must be at most 100 characters long"),
    contactPerson: zod_1.z
        .string()
        .max(100, "Contact person must be at most 100 characters long")
        .optional(),
    phone: zod_1.z
        .string()
        .max(20, "Phone number must be at most 20 characters long")
        .optional(),
    email: zod_1.z
        .string()
        .email("Please enter a valid email address")
        .optional()
        .or(zod_1.z.literal("")),
    address: zod_1.z
        .string()
        .max(255, "Address must be at most 255 characters long")
        .optional(),
});
exports.updateSupplierSchema = exports.supplierSchema.partial();
