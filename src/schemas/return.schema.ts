import { z } from 'zod';

// Schema for return item
const returnItemSchema = z.object({
  drug: z.string().uuid(),
  batch: z.string().uuid().optional(),
  quantity: z.number().int().min(1, 'Quantity must be at least 1'),
  unitPrice: z.number().min(0.01, 'Unit price must be at least 0.01'),
  reason: z.enum([
    'DAMAGED', 'EXPIRED', 'WRONG_ITEM', 'WRONG_QUANTITY', 
    'PATIENT_DECEASED', 'ADVERSE_REACTION', 'NOT_NEEDED',
    'RECALL', 'QUALITY_ISSUE', 'OTHER'
  ], { 
    errorMap: () => ({ message: 'Reason must be one of the predefined values' }),
  }),
  condition: z.enum(['NEW', 'OPENED', 'DAMAGED', 'EXPIRED'], { 
    errorMap: () => ({ message: 'Condition must be one of the predefined values' }),
  }),
  notes: z.string().optional(),
});

const returnBase = z.object({
  returnType: z.enum([
    'CUSTOMER_RETURN', 'SUPPLIER_RETURN', 'DAMAGED_GOODS', 'EXPIRED_DRUGS'
  ], {
    errorMap: () => ({ message: 'Return type must be one of the predefined values' }),
  }),
  returnDate: z.coerce.date().default(() => new Date()),
  customer: z.string().uuid().optional(),
  supplier: z.string().uuid().optional(),
  originalInvoice: z.string().uuid().optional(),
  originalPurchase: z.string().uuid().optional(),
  items: z.array(returnItemSchema).min(1, 'At least one item is required'),
  totalAmount: z.number().min(0, 'Total amount cannot be negative'),
  refundAmount: z.number().min(0, 'Refund amount cannot be negative').optional(),
  refundMethod: z.enum([
    'CASH', 'CREDIT_CARD_REVERSAL', 'STORE_CREDIT', 'REPLACEMENT', 'NONE'
  ], {
    errorMap: () => ({ message: 'Refund method must be one of the predefined values' }),
  }).optional(),
  refundDate: z.coerce.date().optional(),
  status: z.enum([
    'PENDING', 'APPROVED', 'REJECTED', 'COMPLETED', 'CANCELLED'
  ], {
    errorMap: () => ({ message: 'Status must be one of the predefined values' }),
  }).default('PENDING'),
  processedBy: z.string().uuid(),
  approvedBy: z.string().uuid().optional(),
  notes: z.string().optional(),
});

// Create schema - for creating new returns
export const createReturnSchema = returnBase.refine(
  data => {
    if (data.returnType === 'CUSTOMER_RETURN' && !data.customer) return false;
    if (data.returnType === 'SUPPLIER_RETURN' && !data.supplier) return false;
    return true;
  },
  {
    message: "Customer ID is required for customer returns, Supplier ID is required for supplier returns",
    path: ['returnType'],
  }
);

// Update schema - for updating existing returns
export const updateReturnSchema = returnBase
  .partial()
  .extend({
    returnNumber: z.string().optional(),
  });

// Export types generated from schemas
export type CreateReturnInput = z.infer<typeof createReturnSchema>;
export type UpdateReturnInput = z.infer<typeof updateReturnSchema>;
