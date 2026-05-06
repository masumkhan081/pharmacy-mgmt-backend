import { z } from 'zod';
import { Types } from 'mongoose';

// Custom validator for ObjectId
const objectIdValidator = (value: string) => {
  return Types.ObjectId.isValid(value) || 'Invalid ObjectId format';
};

// Payment card details schema
const cardDetailsSchema = z.object({
  cardType: z.string().optional(),
  lastFourDigits: z.string().length(4, 'Must be exactly 4 digits').optional(),
  cardHolderName: z.string().optional(),
  transactionId: z.string().optional(),
}).optional();

// Mobile payment details schema
const mobilePaymentDetailsSchema = z.object({
  provider: z.string().optional(),
  phoneNumber: z.string().optional(),
  transactionId: z.string().optional(),
}).optional();

// Bank transfer details schema
const bankTransferDetailsSchema = z.object({
  bankName: z.string().optional(),
  accountNumber: z.string().optional(),
  transactionId: z.string().optional(),
}).optional();

// Create schema - for creating new payments
export const createPaymentSchema = z.object({
  invoice: z.string().refine(objectIdValidator, { message: 'Invalid invoice ID format' }).optional(),
  amount: z.number().min(0.01, 'Payment amount must be at least 0.01'),
  paymentDate: z.coerce.date().default(() => new Date()),
  paymentMethod: z.enum([
    'CASH', 'CREDIT_CARD', 'DEBIT_CARD', 'MOBILE_BANKING', 'BANK_TRANSFER', 'INSURANCE', 'OTHER'
  ], {
    errorMap: () => ({ message: 'Payment method must be one of the predefined values' }),
  }),
  cardDetails: cardDetailsSchema,
  mobilePaymentDetails: mobilePaymentDetailsSchema,
  bankTransferDetails: bankTransferDetailsSchema,
  receiptNumber: z.string().optional(), // Generated server-side
  status: z.enum([
    'COMPLETED', 'PENDING', 'FAILED', 'REFUNDED'
  ], {
    errorMap: () => ({ message: 'Status must be one of the predefined values' }),
  }).default('COMPLETED'),
  processedBy: z.string().refine(objectIdValidator, { message: 'Invalid staff ID format' }),
  notes: z.string().optional(),
}).refine(
  data => {
    // Validate that appropriate details are provided based on payment method
    if (data.paymentMethod === 'CREDIT_CARD' || data.paymentMethod === 'DEBIT_CARD') {
      return data.cardDetails !== undefined;
    } else if (data.paymentMethod === 'MOBILE_BANKING') {
      return data.mobilePaymentDetails !== undefined;
    } else if (data.paymentMethod === 'BANK_TRANSFER') {
      return data.bankTransferDetails !== undefined;
    }
    return true; // Other payment methods don't require additional details
  },
  {
    message: 'Payment details required for the selected payment method',
    path: ['paymentMethod'],
  }
);

// Update schema - for updating existing payments
export const updatePaymentSchema = z.object({
  // Fields that should not be directly updated
  invoice: z.string().refine(objectIdValidator, { message: 'Invalid invoice ID format' }).optional(),
  receiptNumber: z.string().optional(),
  
  // Updatable fields
  amount: z.number().min(0.01, 'Payment amount must be at least 0.01').optional(),
  paymentDate: z.coerce.date().optional(),
  paymentMethod: z.enum([
    'CASH', 'CREDIT_CARD', 'DEBIT_CARD', 'MOBILE_BANKING', 'BANK_TRANSFER', 'INSURANCE', 'OTHER'
  ], {
    errorMap: () => ({ message: 'Payment method must be one of the predefined values' }),
  }).optional(),
  cardDetails: cardDetailsSchema,
  mobilePaymentDetails: mobilePaymentDetailsSchema,
  bankTransferDetails: bankTransferDetailsSchema,
  status: z.enum([
    'COMPLETED', 'PENDING', 'FAILED', 'REFUNDED'
  ], {
    errorMap: () => ({ message: 'Status must be one of the predefined values' }),
  }).optional(),
  processedBy: z.string().refine(objectIdValidator, { message: 'Invalid staff ID format' }).optional(),
  notes: z.string().optional(),
}).refine(
  data => {
    // Skip validation if payment method is not being updated
    if (!data.paymentMethod) return true;
    
    // Validate that appropriate details are provided based on payment method
    if (data.paymentMethod === 'CREDIT_CARD' || data.paymentMethod === 'DEBIT_CARD') {
      return data.cardDetails !== undefined;
    } else if (data.paymentMethod === 'MOBILE_BANKING') {
      return data.mobilePaymentDetails !== undefined;
    } else if (data.paymentMethod === 'BANK_TRANSFER') {
      return data.bankTransferDetails !== undefined;
    }
    return true; // Other payment methods don't require additional details
  },
  {
    message: 'Payment details required for the selected payment method',
    path: ['paymentMethod'],
  }
);

// Export types generated from schemas
export type CreatePaymentInput = z.infer<typeof createPaymentSchema>;
export type UpdatePaymentInput = z.infer<typeof updatePaymentSchema>;
