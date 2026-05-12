import { z } from "zod";
import { AdjustmentType } from "@prisma/client";

export const createInventoryAdjustmentSchema = z.object({
  body: z.object({
    drug: z.string({
      required_error: "Drug ID is required",
    }).uuid("Invalid Drug ID"),
    batch: z.string({
      required_error: "Batch ID is required",
    }).uuid("Invalid Batch ID"),
    adjustmentType: z.nativeEnum(AdjustmentType, {
      errorMap: () => ({ message: "Invalid adjustment type" }),
    }),
    quantity: z.number({
      required_error: "Quantity is required",
    }), // Can be positive or negative
    reason: z.string({
      required_error: "Reason is required",
    }).min(5, "Reason must be at least 5 characters long"),
    notes: z.string().optional(),
  }),
});
