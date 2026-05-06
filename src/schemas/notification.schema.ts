import { z } from 'zod';
import { Types } from 'mongoose';

// Custom validator for ObjectId
const objectIdValidator = (value: string) => {
  return Types.ObjectId.isValid(value) || 'Invalid ObjectId format';
};

// Schema for notification recipients
const recipientSchema = z.object({
  recipientType: z.enum([
    'STAFF', 'CUSTOMER', 'SUPPLIER', 'DOCTOR', 'ADMIN', 'SYSTEM'
  ], {
    errorMap: () => ({ message: 'Recipient type must be one of the predefined values' }),
  }),
  recipientId: z.string().refine(objectIdValidator, { message: 'Invalid recipient ID format' }),
  channel: z.enum([
    'EMAIL', 'SMS', 'PUSH', 'IN_APP', 'WHATSAPP'
  ], {
    errorMap: () => ({ message: 'Channel must be one of the predefined values' }),
  }),
  deliveryStatus: z.enum([
    'PENDING', 'SENT', 'DELIVERED', 'READ', 'FAILED'
  ], {
    errorMap: () => ({ message: 'Delivery status must be one of the predefined values' }),
  }).default('PENDING'),
  sentAt: z.coerce.date().optional(),
  readAt: z.coerce.date().optional(),
});

// Schema for notification action
const actionSchema = z.object({
  type: z.enum([
    'LINK', 'BUTTON', 'FORM', 'NONE'
  ], {
    errorMap: () => ({ message: 'Action type must be one of the predefined values' }),
  }).default('NONE'),
  label: z.string().optional(),
  url: z.string().url('Must be a valid URL').optional(),
}).optional();

// Schema for recurring pattern
const recurringPatternSchema = z.object({
  frequency: z.enum([
    'DAILY', 'WEEKLY', 'MONTHLY', 'QUARTERLY', 'ANNUALLY'
  ], {
    errorMap: () => ({ message: 'Frequency must be one of the predefined values' }),
  }),
  interval: z.number().int().min(1, 'Interval must be at least 1'),
  endAfter: z.number().int().optional(), // Number of occurrences, null for indefinite
  endDate: z.coerce.date().optional(),
}).optional();

// Create schema - for creating new notifications
export const createNotificationSchema = z.object({
  type: z.enum([
    'INVENTORY_ALERT', 'EXPIRY_ALERT', 'REFILL_REMINDER', 
    'PRESCRIPTION_EXPIRY', 'PAYMENT_DUE', 'SYSTEM_ALERT',
    'CUSTOMER_BIRTHDAY', 'ORDER_STATUS', 'NEW_CUSTOMER',
    'REGULATORY_REMINDER', 'STAFF_REMINDER', 'CUSTOM'
  ], {
    errorMap: () => ({ message: 'Type must be one of the predefined values' }),
  }),
  title: z.string().min(1, 'Title is required'),
  message: z.string().min(1, 'Message is required'),
  priority: z.enum([
    'LOW', 'MEDIUM', 'HIGH', 'URGENT'
  ], {
    errorMap: () => ({ message: 'Priority must be one of the predefined values' }),
  }).default('MEDIUM'),
  status: z.enum([
    'PENDING', 'SENT', 'DELIVERED', 'READ', 'FAILED', 'CANCELLED'
  ], {
    errorMap: () => ({ message: 'Status must be one of the predefined values' }),
  }).default('PENDING'),
  recipients: z.array(recipientSchema).min(1, 'At least one recipient is required'),
  relatedEntityType: z.enum([
    'DRUG', 'PRESCRIPTION', 'CUSTOMER', 'INVENTORY', 'SALE', 
    'INVOICE', 'PAYMENT', 'STAFF', 'SYSTEM', 'OTHER'
  ], {
    errorMap: () => ({ message: 'Related entity type must be one of the predefined values' }),
  }).optional(),
  relatedEntityId: z.string().refine(objectIdValidator, { message: 'Invalid entity ID format' }).optional(),
  action: actionSchema,
  scheduledFor: z.coerce.date().default(() => new Date()),
  expiresAt: z.coerce.date().optional(),
  isRecurring: z.boolean().default(false),
  recurringPattern: recurringPatternSchema,
  createdBy: z.string().refine(objectIdValidator, { message: 'Invalid user ID format' }).optional(),
  metadata: z.record(z.any()).optional(),
});

// Update schema - for updating existing notifications
export const updateNotificationSchema = z.object({
  // Fields that can be updated
  title: z.string().min(1, 'Title is required').optional(),
  message: z.string().min(1, 'Message is required').optional(),
  priority: z.enum([
    'LOW', 'MEDIUM', 'HIGH', 'URGENT'
  ], {
    errorMap: () => ({ message: 'Priority must be one of the predefined values' }),
  }).optional(),
  status: z.enum([
    'PENDING', 'SENT', 'DELIVERED', 'READ', 'FAILED', 'CANCELLED'
  ], {
    errorMap: () => ({ message: 'Status must be one of the predefined values' }),
  }).optional(),
  recipients: z.array(recipientSchema).min(1, 'At least one recipient is required').optional(),
  action: actionSchema,
  scheduledFor: z.coerce.date().optional(),
  expiresAt: z.coerce.date().optional(),
  isRecurring: z.boolean().optional(),
  recurringPattern: recurringPatternSchema,
  metadata: z.record(z.any()).optional(),
});

// Create schema for refill reminders
export const createRefillReminderSchema = z.object({
  customer: z.string().refine(objectIdValidator, { message: 'Invalid customer ID format' }),
  prescription: z.string().refine(objectIdValidator, { message: 'Invalid prescription ID format' }).optional(),
  drug: z.string().refine(objectIdValidator, { message: 'Invalid drug ID format' }),
  dueDate: z.coerce.date(),
  daysSupply: z.number().int().min(1, 'Days supply must be at least 1'),
  reminderDays: z.number().int().min(1, 'Reminder days must be at least 1').default(3),
  status: z.enum([
    'SCHEDULED', 'REMINDED', 'COMPLETED', 'CANCELLED'
  ], {
    errorMap: () => ({ message: 'Status must be one of the predefined values' }),
  }).default('SCHEDULED'),
  notes: z.string().optional(),
});

// Update schema for refill reminders
export const updateRefillReminderSchema = createRefillReminderSchema.partial();

// Export types generated from schemas
export type CreateNotificationInput = z.infer<typeof createNotificationSchema>;
export type UpdateNotificationInput = z.infer<typeof updateNotificationSchema>;
export type CreateRefillReminderInput = z.infer<typeof createRefillReminderSchema>;
export type UpdateRefillReminderInput = z.infer<typeof updateRefillReminderSchema>;
