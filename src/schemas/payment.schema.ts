import { z } from "zod";

// Aligned to `payment.service.createPayment` which expects:
//   { invoiceId, amount, method, processedBy (injected by controller), notes? }
// Method enum kept open for now; service stores raw string.
export const createPaymentSchema = z.object({
  invoiceId: z.string().uuid("Invalid invoice ID"),
  amount: z.number().min(0.01, "Payment amount must be at least 0.01"),
  method: z.enum(["CASH", "CARD", "MOBILE_BANKING"], {
    errorMap: () => ({
      message: "Method must be CASH, CARD, or MOBILE_BANKING",
    }),
  }),
  notes: z.string().max(500, "Notes must be at most 500 characters long").optional(),
});

export type CreatePaymentInput = z.infer<typeof createPaymentSchema>;
