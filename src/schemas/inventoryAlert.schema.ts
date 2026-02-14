import { z } from 'zod';
import { Types } from 'mongoose';

// Custom validator for ObjectId
const objectIdValidator = (value: string) => {
  return Types.ObjectId.isValid(value) || 'Invalid ObjectId format';
};

// Create schema - for creating new inventory alerts
export const createInventoryAlertSchema = z.object({
  drug: z.string().refine(objectIdValidator, { message: 'Invalid drug ID format' }),
  minThreshold: z.number().int().min(1, 'Minimum threshold must be at least 1'),
  maxThreshold: z.number().int(),
  reorderPoint: z.number().int().min(1, 'Reorder point must be at least 1'),
  reorderQuantity: z.number().int().min(1, 'Reorder quantity must be at least 1'),
  preferredSupplier: z.string().refine(objectIdValidator, { message: 'Invalid supplier ID format' }).optional(),
  autoReorder: z.boolean().default(false),
  isActive: z.boolean().default(true),
  createdBy: z.string().refine(objectIdValidator, { message: 'Invalid staff ID format' }),
  updatedBy: z.string().refine(objectIdValidator, { message: 'Invalid staff ID format' }).optional(),
}).refine(
  data => data.maxThreshold > data.minThreshold,
  {
    message: 'Maximum threshold must be greater than minimum threshold',
    path: ['maxThreshold'],
  }
).refine(
  data => data.reorderPoint >= data.minThreshold && data.reorderPoint <= data.maxThreshold,
  {
    message: 'Reorder point must be between minimum and maximum thresholds',
    path: ['reorderPoint'],
  }
);

// Update schema - for updating existing inventory alerts
export const updateInventoryAlertSchema = createInventoryAlertSchema
  .partial()
  .extend({
    updatedBy: z.string().refine(objectIdValidator, { message: 'Invalid staff ID format' }), // Required for updates
  })
  .refine(
    data => {
      // If any of these fields are provided, we need to validate the relationship
      if (data.minThreshold !== undefined || data.maxThreshold !== undefined || data.reorderPoint !== undefined) {
        const min = data.minThreshold;
        const max = data.maxThreshold;
        const reorder = data.reorderPoint;
        
        // If all fields are provided, we can fully validate
        if (min !== undefined && max !== undefined && reorder !== undefined) {
          return max > min && reorder >= min && reorder <= max;
        }
        
        // Otherwise, we skip this validation as we don't have all the data
        // The database pre-save hooks will handle final validation
      }
      return true;
    },
    {
      message: 'Thresholds and reorder point relationships must be maintained',
      path: ['reorderPoint'],
    }
  );

// Export types generated from schemas
export type CreateInventoryAlertInput = z.infer<typeof createInventoryAlertSchema>;
export type UpdateInventoryAlertInput = z.infer<typeof updateInventoryAlertSchema>;
