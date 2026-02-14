import { z } from 'zod';
import { Types } from 'mongoose';

// Custom validator for ObjectId
const objectIdValidator = (value: string) => {
  return Types.ObjectId.isValid(value) || 'Invalid ObjectId format';
};

// Schema for invoice items
const invoiceItemSchema = z.object({
  name: z.string().min(1, 'Item name is required'),
  description: z.string().optional(),
  quantity: z.number().int().min(1, 'Quantity must be at least 1'),
  unitPrice: z.number().min(0, 'Unit price cannot be negative'),
  discount: z.number().min(0, 'Discount cannot be negative').default(0),
  tax: z.number().min(0, 'Tax cannot be negative').default(0),
  totalPrice: z.number().min(0, 'Total price cannot be negative'),
});

// Create schema - for creating new invoices
export const createInvoiceSchema = z.object({
  invoiceNumber: z.string().optional(), // Generated server-side
  customer: z.string().refine(objectIdValidator, { message: 'Invalid customer ID format' }),
  sale: z.string().refine(objectIdValidator, { message: 'Invalid sale ID format' }).optional(),
  prescription: z.string().refine(objectIdValidator, { message: 'Invalid prescription ID format' }).optional(),
  issueDate: z.date().default(() => new Date()),
  dueDate: z.date(),
  items: z.array(invoiceItemSchema).min(1, 'At least one item is required'),
  subtotal: z.number().min(0, 'Subtotal cannot be negative'),
  taxTotal: z.number().min(0, 'Tax total cannot be negative'),
  discountTotal: z.number().min(0, 'Discount total cannot be negative'),
  grandTotal: z.number().min(0, 'Grand total cannot be negative'),
  amountPaid: z.number().min(0, 'Amount paid cannot be negative').default(0),
  status: z.enum([
    'DRAFT', 'ISSUED', 'PARTIALLY_PAID', 'PAID', 'OVERDUE', 'CANCELLED', 'REFUNDED'
  ], {
    errorMap: () => ({ message: 'Status must be one of the predefined values' }),
  }).default('DRAFT'),
  notes: z.string().optional(),
  paymentTerms: z.string().optional(),
}).refine(
  data => data.dueDate >= data.issueDate,
  {
    message: 'Due date must be on or after issue date',
    path: ['dueDate'],
  }
);

// Update schema - for updating existing invoices
export const updateInvoiceSchema = z.object({
  // These fields should not be updated directly
  invoiceNumber: z.string().optional(),
  customer: z.string().refine(objectIdValidator, { message: 'Invalid customer ID format' }).optional(),
  sale: z.string().refine(objectIdValidator, { message: 'Invalid sale ID format' }).optional(),
  prescription: z.string().refine(objectIdValidator, { message: 'Invalid prescription ID format' }).optional(),
  
  // Updatable fields
  issueDate: z.date().optional(),
  dueDate: z.date().optional(),
  items: z.array(invoiceItemSchema).min(1, 'At least one item is required').optional(),
  subtotal: z.number().min(0, 'Subtotal cannot be negative').optional(),
  taxTotal: z.number().min(0, 'Tax total cannot be negative').optional(),
  discountTotal: z.number().min(0, 'Discount total cannot be negative').optional(),
  grandTotal: z.number().min(0, 'Grand total cannot be negative').optional(),
  amountPaid: z.number().min(0, 'Amount paid cannot be negative').optional(),
  status: z.enum([
    'DRAFT', 'ISSUED', 'PARTIALLY_PAID', 'PAID', 'OVERDUE', 'CANCELLED', 'REFUNDED'
  ], {
    errorMap: () => ({ message: 'Status must be one of the predefined values' }),
  }).optional(),
  notes: z.string().optional(),
  paymentTerms: z.string().optional(),
}).refine(
  data => {
    if (data.dueDate && data.issueDate) {
      return data.dueDate >= data.issueDate;
    }
    return true; // Skip validation if both dates are not provided
  },
  {
    message: 'Due date must be on or after issue date',
    path: ['dueDate'],
  }
);

// Export types generated from schemas
export type CreateInvoiceInput = z.infer<typeof createInvoiceSchema>;
export type UpdateInvoiceInput = z.infer<typeof updateInvoiceSchema>;
