"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUnitSchema = exports.createUnitSchema = void 0;
const zod_1 = require("zod");
// Create Schema
exports.createUnitSchema = zod_1.z.object({
    shortName: zod_1.z
        .string()
        .min(1, "Short name must be at least 1 character long")
        .max(10, "Short name cannot exceed 10 characters")
        .refine((value) => value.length === 0 || /^[a-zA-Z0-9]+$/.test(value), "Short name cannot contain special characters"),
    longName: zod_1.z
        .string()
        .min(3, "Long name must be at least 3 characters long")
        .max(50, "Long name cannot exceed 50 characters")
});
// Update Schema (using partial to make all fields optional)
exports.updateUnitSchema = exports.createUnitSchema.partial();
