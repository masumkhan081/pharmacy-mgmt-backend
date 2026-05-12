import { z } from "zod";
import { Types } from "mongoose";

const objectIdValidator = (value: string) =>
  Types.ObjectId.isValid(value) || "Invalid ObjectId format";

const purchaseItemSchema = z.object({
  drug: z
    .string()
    .refine(objectIdValidator, { message: "Invalid drug ID format" }),
  quantity: z.number().int().min(1, "Quantity must be at least 1"),
  purchasePrice: z.number().min(0.01, "Purchase price must be at least 0.01"),
  mrp: z.number().min(0.01, "MRP must be at least 0.01"),
  batchNumber: z.string().min(1, "Batch number is required"),
  expirationDate: z.coerce.date().refine((date) => date > new Date(), {
    message: "Expiration date must be in the future",
  }),
});

export const purchaseSchema = z.object({
  purchaseAt: z.coerce.date(),
  supplier: z
    .string()
    .refine(objectIdValidator, { message: "Invalid supplier ID format" })
    .optional(),
  drugs: z.array(purchaseItemSchema).min(1, "At least one item is required"),
  bill: z.number().min(0.01, "Bill amount must be at least 0.01"),
});

export const updatePurchaseSchema = purchaseSchema.partial();
