import { z } from "zod";

// Aligned to Prisma `InventoryAlert` model via `inventoryAlert.service.createInventoryAlert`:
// service maps `data.drug -> drugId`. Fields: drug(uuid), title, message, severity, isResolved?
export const createInventoryAlertSchema = z.object({
  drug: z.string().uuid("Invalid drug ID"),
  title: z
    .string()
    .min(1, "Title is required")
    .max(150, "Title must be at most 150 characters long"),
  message: z
    .string()
    .min(1, "Message is required")
    .max(1000, "Message must be at most 1000 characters long"),
  severity: z.enum(["LOW", "MEDIUM", "HIGH"], {
    errorMap: () => ({ message: "Severity must be LOW, MEDIUM, or HIGH" }),
  }).default("MEDIUM"),
  isResolved: z.boolean().optional(),
});

export const updateInventoryAlertSchema = createInventoryAlertSchema.partial();
