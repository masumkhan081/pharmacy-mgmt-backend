import { z } from "zod";

// Aligned to Prisma `Group` model:
// { name(unique), description? }
export const groupSchema = z.object({
  name: z
    .string()
    .min(1, "Group name is required")
    .max(50, "Group name must be at most 50 characters long"),
  description: z
    .string()
    .max(500, "Description must be at most 500 characters long")
    .optional(),
});

export const updateGroupSchema = groupSchema.partial();
