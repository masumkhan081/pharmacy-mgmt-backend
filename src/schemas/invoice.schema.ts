import { z } from "zod";

// Invoices are DERIVED from completed sales. Direct standalone creation is discouraged.
// This schema is kept as a minimal contract for any internal/administrative case where
// an invoice must be created against an existing sale.
// Aligned to `invoice.service.createInvoice` which reads:
//   { sale(uuid), totalAmount (or grandTotal), invoiceNumber? }
export const createInvoiceSchema = z.object({
  sale: z.string().uuid("Invalid sale ID"),
  totalAmount: z.number().min(0, "Total amount cannot be negative"),
  invoiceNumber: z
    .string()
    .max(50, "Invoice number must be at most 50 characters long")
    .optional(),
});

export type CreateInvoiceInput = z.infer<typeof createInvoiceSchema>;
