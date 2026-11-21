"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateFormulationSchema = exports.formulationSchema = void 0;
const zod_1 = require("zod");
// Aligned to Prisma `Formulation` model:
// { name(unique) }
exports.formulationSchema = zod_1.z.object({
    name: zod_1.z
        .string()
        .min(1, "Formulation name is required")
        .max(50, "Formulation name must be at most 50 characters long"),
});
exports.updateFormulationSchema = exports.formulationSchema.partial();
