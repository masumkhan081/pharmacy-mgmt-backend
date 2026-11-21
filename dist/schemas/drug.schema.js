"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.drugUpdateSchema = exports.drugSchema = void 0;
const zod_1 = require("zod");
// Aligned to `drug.service`:
//  - createDrug reads: brand(uuid), formulation(uuid), strength, unit(uuid), purchasePrice?, mrp, status?
//    (service maps brand->brandId, formulation->formulationId, unit->unitId; denormalizes `name`).
//  - updateDrug accepts partial fields by Prisma names (brandId/formulationId/unitId/etc.) OR
//    by the same short keys, since updateDrug rebuilds `name` from brandId/strength/unitId.
exports.drugSchema = zod_1.z.object({
    brand: zod_1.z.string().uuid("Invalid brand ID"),
    formulation: zod_1.z.string().uuid("Invalid formulation ID"),
    strength: zod_1.z.number().min(0, "Strength cannot be negative"),
    unit: zod_1.z.string().uuid("Invalid unit ID"),
    mrp: zod_1.z.number().min(0, "MRP cannot be negative"),
    purchasePrice: zod_1.z.number().min(0, "Purchase price cannot be negative").optional(),
    status: zod_1.z.enum(["ACTIVE", "INACTIVE"]).optional(),
});
exports.drugUpdateSchema = zod_1.z.object({
    brandId: zod_1.z.string().uuid("Invalid brand ID").optional(),
    formulationId: zod_1.z.string().uuid("Invalid formulation ID").optional(),
    unitId: zod_1.z.string().uuid("Invalid unit ID").optional(),
    genericId: zod_1.z.string().uuid("Invalid generic ID").optional(),
    mfrId: zod_1.z.string().uuid("Invalid manufacturer ID").optional(),
    groupId: zod_1.z.string().uuid("Invalid group ID").optional(),
    strength: zod_1.z.number().min(0, "Strength cannot be negative").optional(),
    mrp: zod_1.z.number().min(0, "MRP cannot be negative").optional(),
    purchasePrice: zod_1.z.number().min(0, "Purchase price cannot be negative").optional(),
    status: zod_1.z.enum(["ACTIVE", "INACTIVE"]).optional(),
});
