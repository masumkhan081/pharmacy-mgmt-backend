import { z } from "zod";

const saleItemSchema = z.object({
  drugId: z.string().uuid("Invalid drug ID format"),
  quantity: z.number().min(1, "Quantity must be at least 1"),
  price: z.number().min(0.01, "Price must be at least 0.01"),
});

export const saleSchema = z.object({
  saleAt: z.coerce.date().optional(),
  items: z.array(saleItemSchema).min(1, "At least one item is required"),
  totalBill: z.number().min(0.01, "Bill amount must be at least 0.01"),
  customerId: z.string().uuid("Invalid customer ID format").optional(),
});

export const updateSaleSchema = saleSchema.partial();
