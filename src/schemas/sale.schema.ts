import { z } from "zod";
import { Types } from "mongoose";

const objectIdValidator = (value: string) =>
  Types.ObjectId.isValid(value) || "Invalid ObjectId format";

const saleItemSchema = z.object({
  drug: z
    .string()
    .refine(objectIdValidator, { message: "Invalid drug ID format" }),
  quantity: z.number().int().min(1, "Quantity must be at least 1"),
  mrp: z.number().min(0.01, "MRP must be at least 0.01"),
});

export const saleSchema = z.object({
  saleAt: z.coerce.date(),
  drugs: z.array(saleItemSchema).min(1, "At least one item is required"),
  bill: z.number().min(0.01, "Bill amount must be at least 0.01"),
});

export const updateSaleSchema = saleSchema.partial();
