"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUnitSchema = exports.createUnitSchema = void 0;
const zod_1 = require("zod");
// Aligned to Prisma `Unit` model:
// { name(unique) }
exports.createUnitSchema = zod_1.z.object({
    name: zod_1.z
        .string()
        .min(1, "Unit name is required")
        .max(50, "Unit name must be at most 50 characters long"),
});
exports.updateUnitSchema = exports.createUnitSchema.partial();
