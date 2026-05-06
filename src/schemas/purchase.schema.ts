import { z } from "zod";
import { Types } from "mongoose";

const objectIdValidator = (value: string) =>
  Types.ObjectId.isValid(value) || "Invalid ObjectId format";

const purchaseItemSchema = z.object({
  drug: z
    .string()
    .refine(objectIdValidator, { message: "Invalid drug ID format" }),
  quantity: z.number().int().min(1, "Quantity must be at least 1"),
  unitPrice: z.number().min(0.01, "Unit price must be at least 0.01"),
});

export const purchaseSchema = z.object({
  purchaseAt: z.coerce.date(),
  drugs: z.array(purchaseItemSchema).min(1, "At least one item is required"),
  bill: z.number().min(0.01, "Bill amount must be at least 0.01"),
});

export const updatePurchaseSchema = purchaseSchema.partial();
