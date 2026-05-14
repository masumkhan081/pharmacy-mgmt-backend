import { z } from "zod";

// Aligned to Prisma `InventoryBatch` model.
// Repository passes data through to Prisma directly, so Prisma field names are required.
// Direct creation is mostly internal (purchase flow auto-creates batches).
export const createInventoryBatchSchema = z
  .object({
    drugId: z.string().uuid("Invalid drug ID"),
    batchNumber: z.string().min(1, "Batch number is required"),
    lotNumber: z.string().optional(),
    expirationDate: z.coerce.date(),
    initialQuantity: z.number().min(0, "Initial quantity cannot be negative"),
    currentQuantity: z.number().min(0, "Current quantity cannot be negative"),
    purchasePrice: z.number().min(0, "Purchase price cannot be negative"),
    sellingPrice: z.number().min(0, "Selling price cannot be negative"),
    purchaseId: z.string().uuid("Invalid purchase ID").optional(),
    status: z
      .enum([
        "AVAILABLE",
        "LOW_STOCK",
        "OUT_OF_STOCK",
        "EXPIRED",
        "RECALLED",
        "RECALLED_RETURNED",
      ])
      .optional(),
    isActive: z.boolean().optional(),
  })
  .refine((data) => data.expirationDate > new Date(), {
    message: "Expiration date must be in the future",
    path: ["expirationDate"],
  });

export const updateInventoryBatchSchema = z.object({
  expirationDate: z.coerce.date().optional(),
  currentQuantity: z
    .number()
    .min(0, "Current quantity cannot be negative")
    .optional(),
  purchasePrice: z.number().min(0, "Purchase price cannot be negative").optional(),
  sellingPrice: z.number().min(0, "Selling price cannot be negative").optional(),
  status: z
    .enum([
      "AVAILABLE",
      "LOW_STOCK",
      "OUT_OF_STOCK",
      "EXPIRED",
      "RECALLED",
      "RECALLED_RETURNED",
    ])
    .optional(),
  isActive: z.boolean().optional(),
  lotNumber: z.string().optional(),
});

export type CreateInventoryBatchInput = z.infer<typeof createInventoryBatchSchema>;
export type UpdateInventoryBatchInput = z.infer<typeof updateInventoryBatchSchema>;
