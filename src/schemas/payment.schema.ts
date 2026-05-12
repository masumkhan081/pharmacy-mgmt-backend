import { z } from 'zod';

// Create schema - for creating new payments
export const createPaymentSchema = z.object({
  invoice: z.string().uuid(),
  amount: z.number().min(0.01, 'Payment amount must be at least 0.01'),
  paymentDate: z.coerce.date().default(() => new Date()),
  paymentMethod: z.enum(['CASH', 'CARD', 'MOBILE_BANKING'], {
    errorMap: () => ({ message: 'Payment method must be CASH, CARD, or MOBILE_BANKING' }),
  }),
  processedBy: z.string().uuid().optional(),
  notes: z.string().optional(),
});

export type CreatePaymentInput = z.infer<typeof createPaymentSchema>;
