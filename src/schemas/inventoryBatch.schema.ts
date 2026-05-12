import { z } from 'zod';

// Create schema - for creating new inventory batches
export const createInventoryBatchSchema = z.object({
  drug: z.string().uuid(),
  batchNumber: z.string().min(1, 'Batch number is required'),
  lotNumber: z.string().min(1, 'Lot number is required'),
  manufacturer: z.string().uuid(),
  manufactureDate: z.coerce.date(),
  expirationDate: z.coerce.date(),
  initialQuantity: z.number().int().min(1, 'Initial quantity must be at least 1'),
  currentQuantity: z.number().int().min(0, 'Current quantity cannot be negative'),
  costPrice: z.number().min(0.01, 'Cost price must be at least 0.01'),
  sellingPrice: z.number().min(0.01, 'Selling price must be at least 0.01'),
  purchaseDate: z.coerce.date(),
  purchase: z.string().uuid().optional(),
  supplier: z.string().uuid().optional(),
  location: z.string().min(1, 'Storage location is required'),
  isActive: z.boolean().default(true),
  status: z.enum([
    'AVAILABLE', 'LOW_STOCK', 'OUT_OF_STOCK', 'EXPIRED', 'RECALLED'
  ], {
    errorMap: () => ({ message: 'Status must be one of the predefined values' }),
  }).default('AVAILABLE'),
  notes: z.string().optional(),
}).refine(
  data => data.expirationDate > data.manufactureDate,
  {
    message: 'Expiration date must be after manufacture date',
    path: ['expirationDate'],
  }
);

// Update schema - for updating existing inventory batches
export const updateInventoryBatchSchema = z.object({
  // Immutable fields cannot be updated
  drug: z.string().uuid().optional(),
  batchNumber: z.string().min(1, 'Batch number is required').optional(),
  lotNumber: z.string().min(1, 'Lot number is required').optional(),
  manufacturer: z.string().uuid().optional(),
  manufactureDate: z.coerce.date().optional(),
  
  // Updatable fields
  expirationDate: z.coerce.date().optional(),
  currentQuantity: z.number().int().min(0, 'Current quantity cannot be negative').optional(),
  costPrice: z.number().min(0.01, 'Cost price must be at least 0.01').optional(),
  sellingPrice: z.number().min(0.01, 'Selling price must be at least 0.01').optional(),
  location: z.string().min(1, 'Storage location is required').optional(),
  isActive: z.boolean().optional(),
  status: z.enum([
    'AVAILABLE', 'LOW_STOCK', 'OUT_OF_STOCK', 'EXPIRED', 'RECALLED'
  ], {
    errorMap: () => ({ message: 'Status must be one of the predefined values' }),
  }).optional(),
  notes: z.string().optional(),
}).refine(
  data => {
    if (data.expirationDate && data.manufactureDate) {
      return data.expirationDate > data.manufactureDate;
    }
    return true; // Skip validation if both dates are not provided
  },
  {
    message: 'Expiration date must be after manufacture date',
    path: ['expirationDate'],
  }
);

// Export types generated from schemas
export type CreateInventoryBatchInput = z.infer<typeof createInventoryBatchSchema>;
export type UpdateInventoryBatchInput = z.infer<typeof updateInventoryBatchSchema>;
