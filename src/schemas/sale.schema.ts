import { z } from "zod";

// Aligned to `sale.service.createSale` which reads:
//   data.drugs[], data.bill, data.actor (injected by controller), data.customerId(optional)
// Each drug item: { drug(uuid), quantity, mrp }
const saleItemSchema = z.object({
  drug: z.string().uuid("Invalid drug ID"),
  quantity: z.number().min(0.01, "Quantity must be greater than 0"),
  mrp: z.number().min(0, "Price cannot be negative"),
});

export const saleSchema = z.object({
  saleAt: z.coerce.date().optional(),
  drugs: z.array(saleItemSchema).min(1, "At least one item is required"),
  bill: z.number().min(0, "Bill amount cannot be negative"),
  customerId: z.string().uuid("Invalid customer ID").optional(),
});

export const updateSaleSchema = saleSchema.partial();
