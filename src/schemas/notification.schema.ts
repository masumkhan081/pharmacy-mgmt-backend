import { z } from "zod";

// Aligned to Prisma `Notification` model — intentionally minimal:
// { title, message, userId?, isRead }
export const createNotificationSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(150, "Title must be at most 150 characters long"),
  message: z
    .string()
    .min(1, "Message is required")
    .max(1000, "Message must be at most 1000 characters long"),
  userId: z.string().uuid("Invalid user ID").optional(),
  isRead: z.boolean().optional(),
});

export const updateNotificationSchema = createNotificationSchema.partial();
