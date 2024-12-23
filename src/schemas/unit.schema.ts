import { z } from "zod";

// Create Schema
export const createUnitSchema = z.object({
  shortName: z
    .string()
    .min(1, "Short name must be at least 1 character long")
    .max(10, "Short name cannot exceed 10 characters")
    .regex(/^\S+$/, "Short name cannot contain spaces")
    .refine(value => value.length <= 10, "Short name cannot exceed 10 characters"),
  longName: z
    .string()
    .min(3, "Long name must be at least 3 characters long")
    .max(50, "Long name cannot exceed 50 characters")
    .refine(value => value.length <= 50, "Long name cannot exceed 50 characters"),
});

// Update Schema (using partial to make all fields optional)
export const updateUnitSchema = createUnitSchema.partial();