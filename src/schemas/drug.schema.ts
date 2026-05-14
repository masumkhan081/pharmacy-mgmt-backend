import { z } from "zod";

// Aligned to `drug.service`:
//  - createDrug reads: brand(uuid), formulation(uuid), strength, unit(uuid), purchasePrice?, mrp, status?
//    (service maps brand->brandId, formulation->formulationId, unit->unitId; denormalizes `name`).
//  - updateDrug accepts partial fields by Prisma names (brandId/formulationId/unitId/etc.) OR
//    by the same short keys, since updateDrug rebuilds `name` from brandId/strength/unitId.
export const drugSchema = z.object({
  brand: z.string().uuid("Invalid brand ID"),
  formulation: z.string().uuid("Invalid formulation ID"),
  strength: z.number().min(0, "Strength cannot be negative"),
  unit: z.string().uuid("Invalid unit ID"),
  mrp: z.number().min(0, "MRP cannot be negative"),
  purchasePrice: z.number().min(0, "Purchase price cannot be negative").optional(),
  status: z.enum(["ACTIVE", "INACTIVE"]).optional(),
});

export const drugUpdateSchema = z.object({
  brandId: z.string().uuid("Invalid brand ID").optional(),
  formulationId: z.string().uuid("Invalid formulation ID").optional(),
  unitId: z.string().uuid("Invalid unit ID").optional(),
  genericId: z.string().uuid("Invalid generic ID").optional(),
  mfrId: z.string().uuid("Invalid manufacturer ID").optional(),
  groupId: z.string().uuid("Invalid group ID").optional(),
  strength: z.number().min(0, "Strength cannot be negative").optional(),
  mrp: z.number().min(0, "MRP cannot be negative").optional(),
  purchasePrice: z.number().min(0, "Purchase price cannot be negative").optional(),
  status: z.enum(["ACTIVE", "INACTIVE"]).optional(),
});
