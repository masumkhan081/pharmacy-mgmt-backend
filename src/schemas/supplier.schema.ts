import * as z from "zod";
import { Types } from "mongoose";

const objectIdValidator = (value: string) =>
  Types.ObjectId.isValid(value) || "Invalid ObjectId format";

export const supplierSchema = z.object({
  fullName: z
    .string()
    .min(1, "Full name must be at least 1 character long.")
    .max(100, "Full name must be at most 100 characters long."),
  phone: z
    .string()
    .min(10, "Phone number must be at least 10 characters long.")
    .max(15, "Phone number must be at most 15 characters long."),
  altPhone: z
    .string()
    .min(10, "Phone number must be at least 10 characters long.")
    .max(15, "Phone number must be at most 15 characters long."),
  gender: z.enum(["MALE", "FEMALE", "OTHER"]).optional(),
  email: z.string().email("Please enter a valid email address."),
  manufacturer: z
    .string()
    .refine(objectIdValidator, { message: "Invalid manufacturer ID format" }),
  address: z
    .string()
    .max(55, "Address must be at most 55 characters long.")
    .optional(),
  deliveryFrequency: z
    .enum(["Daily", "Weekly", "Monthly", "On-demand"])
    .default("On-demand"),
  isActive: z.boolean().default(false),
  notes: z
    .string()
    .max(500, "Notes must be at most 500 characters long.")
    .optional(),
});

export const updateSupplierSchema = supplierSchema.partial();
