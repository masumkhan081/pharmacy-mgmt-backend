import { z } from "zod";

// Aligned to `purchase.service.createPurchase` which reads:
//   data.drugs[], data.bill, data.purchaseAt, data.supplier?(uuid), data.actor (injected)
// Each drug item: { drug(uuid), quantity, purchasePrice, mrp, batchNumber, expirationDate }
const purchaseItemSchema = z.object({
  drug: z.string().uuid("Invalid drug ID"),
  quantity: z.number().min(0.01, "Quantity must be greater than 0"),
  purchasePrice: z.number().min(0, "Purchase price cannot be negative"),
  mrp: z.number().min(0, "MRP cannot be negative"),
  batchNumber: z.string().min(1, "Batch number is required"),
  expirationDate: z.coerce.date().refine((date) => date > new Date(), {
    message: "Expiration date must be in the future",
  }),
});

export const purchaseSchema = z.object({
  purchaseAt: z.coerce.date(),
  supplier: z.string().uuid("Invalid supplier ID").optional(),
  drugs: z.array(purchaseItemSchema).min(1, "At least one item is required"),
  bill: z.number().min(0, "Bill amount cannot be negative"),
});

export const updatePurchaseSchema = purchaseSchema.partial();
