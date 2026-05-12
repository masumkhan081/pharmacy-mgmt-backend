"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.drugUpdateSchema = exports.drugSchema = void 0;
const zod_1 = require("zod");
exports.drugSchema = zod_1.z.object({
    brand: zod_1.z.string().min(1, "Brand ID is required"),
    formulation: zod_1.z.string().min(1, "Formulation ID is required"),
    strength: zod_1.z.number().min(0, "Strength must be positive"),
    unit: zod_1.z.string().min(1, "Unit ID is required"),
    mrp: zod_1.z.number().min(0, "MRP must be positive"),
    purchasePrice: zod_1.z.number().optional(),
    status: zod_1.z.enum(["ACTIVE", "INACTIVE"]).optional(),
});
exports.drugUpdateSchema = exports.drugSchema.partial();
