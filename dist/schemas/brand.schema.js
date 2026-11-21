"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.brandUpdateSchema = exports.brandSchema = void 0;
const zod_1 = require("zod");
// Aligned to Prisma `Brand` model:
// { name(unique), origin? }
exports.brandSchema = zod_1.z.object({
    name: zod_1.z
        .string()
        .min(1, "Brand name is required")
        .max(50, "Brand name must be at most 50 characters long"),
    origin: zod_1.z
        .string()
        .max(100, "Origin must be at most 100 characters long")
        .optional(),
});
exports.brandUpdateSchema = exports.brandSchema.partial();
