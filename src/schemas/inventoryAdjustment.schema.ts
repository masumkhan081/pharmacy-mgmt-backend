import { z } from "zod";
import { AdjustmentType } from "@prisma/client";

// Aligned to `inventoryAdjustment.service.createAdjustment` which reads (flat, no body wrapper):
//   { drug(uuid), batch(uuid), adjustmentType, quantity, reason, notes?, actor (injected) }
export const createInventoryAdjustmentSchema = z.object({
  drug: z.string().uuid("Invalid drug ID"),
  batch: z.string().uuid("Invalid batch ID"),
  adjustmentType: z.nativeEnum(AdjustmentType, {
    errorMap: () => ({ message: "Invalid adjustment type" }),
  }),
  quantity: z.number(),
  reason: z
    .string()
    .min(5, "Reason must be at least 5 characters long")
    .max(255, "Reason must be at most 255 characters long"),
  notes: z
    .string()
    .max(500, "Notes must be at most 500 characters long")
    .optional(),
});

export type CreateInventoryAdjustmentInput = z.infer<
  typeof createInventoryAdjustmentSchema
>;
