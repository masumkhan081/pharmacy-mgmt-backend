import { z } from 'zod';
import { Types } from 'mongoose';

// Custom validator for ObjectId
const objectIdValidator = (value: string) => {
  return Types.ObjectId.isValid(value) || 'Invalid ObjectId format';
};

// Create schema - for creating new payments
export const createPaymentSchema = z.object({
  invoice: z.string().refine(objectIdValidator, { message: 'Invalid invoice ID format' }),
  amount: z.number().min(0.01, 'Payment amount must be at least 0.01'),
  paymentDate: z.coerce.date().default(() => new Date()),
  paymentMethod: z.enum(['CASH', 'CARD', 'MOBILE_BANKING'], {
    errorMap: () => ({ message: 'Payment method must be CASH, CARD, or MOBILE_BANKING' }),
  }),
  processedBy: z.string().refine(objectIdValidator, { message: 'Invalid staff ID format' }).optional(),
  notes: z.string().optional(),
});

export type CreatePaymentInput = z.infer<typeof createPaymentSchema>;
