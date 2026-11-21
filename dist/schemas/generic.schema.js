"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.genericUpdateSchema = exports.genericSchema = void 0;
const zod_1 = require("zod");
// Aligned to Prisma `Generic` model:
// { name(unique), description? }
exports.genericSchema = zod_1.z.object({
    name: zod_1.z
        .string()
        .min(1, "Generic name is required")
        .max(50, "Generic name must be at most 50 characters long"),
    description: zod_1.z
        .string()
        .max(500, "Description must be at most 500 characters long")
        .optional(),
});
exports.genericUpdateSchema = exports.genericSchema.partial();
