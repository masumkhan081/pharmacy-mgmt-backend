"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateGroupSchema = exports.groupSchema = void 0;
const zod_1 = require("zod");
// Aligned to Prisma `Group` model:
// { name(unique), description? }
exports.groupSchema = zod_1.z.object({
    name: zod_1.z
        .string()
        .min(1, "Group name is required")
        .max(50, "Group name must be at most 50 characters long"),
    description: zod_1.z
        .string()
        .max(500, "Description must be at most 500 characters long")
        .optional(),
});
exports.updateGroupSchema = exports.groupSchema.partial();
