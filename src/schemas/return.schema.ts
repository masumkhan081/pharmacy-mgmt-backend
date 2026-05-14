import { z } from "zod";

// Aligned to `return.service.createReturn` which reads:
//   data.returnType, data.processedBy(uuid), data.items[]
// Each return item: { drug(uuid), batch(uuid), quantity, unitPrice, reason }
// Status is server-managed (defaults to PENDING; transitions through approve/reject endpoints).
const returnItemSchema = z.object({
  drug: z.string().uuid("Invalid drug ID"),
  batch: z.string().uuid("Invalid batch ID"),
  quantity: z.number().min(0.01, "Quantity must be greater than 0"),
  unitPrice: z.number().min(0, "Unit price cannot be negative"),
  reason: z
    .string()
    .min(1, "Reason is required")
    .max(255, "Reason must be at most 255 characters long"),
});

export const createReturnSchema = z.object({
  returnType: z
    .enum(["CUSTOMER_RETURN", "SUPPLIER_RETURN"], {
      errorMap: () => ({
        message: "Return type must be CUSTOMER_RETURN or SUPPLIER_RETURN",
      }),
    })
    .default("CUSTOMER_RETURN"),
  processedBy: z.string().uuid("Invalid processedBy user ID"),
  items: z.array(returnItemSchema).min(1, "At least one item is required"),
});

export const approveReturnSchema = z.object({
  approvedBy: z.string().uuid("Invalid approvedBy user ID"),
});

export const rejectReturnSchema = z.object({
  rejectedBy: z.string().uuid("Invalid rejectedBy user ID"),
});

export type CreateReturnInput = z.infer<typeof createReturnSchema>;
