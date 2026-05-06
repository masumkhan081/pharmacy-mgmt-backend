import { z } from "zod";
import { Types } from "mongoose";

const objectIdValidator = (value: string) =>
  Types.ObjectId.isValid(value) || "Invalid ObjectId format";

const medicationSchema = z.object({
  drug: z
    .string()
    .refine(objectIdValidator, { message: "Invalid drug ID format" }),
  dosage: z.string().min(1, "Dosage is required"),
  frequency: z.string().min(1, "Frequency is required"),
  duration: z.object({
    value: z.number().int().min(1, "Duration value must be at least 1"),
    unit: z.enum(["days", "weeks", "months", "ongoing"]),
  }),
  instructions: z.string().optional(),
  quantity: z.number().int().min(1, "Quantity must be at least 1"),
  refills: z.number().int().min(0).default(0),
  refillsUsed: z.number().int().min(0).default(0),
});

export const createPrescriptionSchema = z.object({
  customer: z
    .string()
    .refine(objectIdValidator, { message: "Invalid customer ID format" }),
  prescriptionNumber: z.string().min(1, "Prescription number is required"),
  doctor: z
    .string()
    .refine(objectIdValidator, { message: "Invalid doctor ID format" }),
  issueDate: z.coerce.date().default(() => new Date()),
  expiryDate: z.coerce.date(),
  medications: z
    .array(medicationSchema)
    .min(1, "At least one medication is required"),
  status: z
    .enum(["ACTIVE", "COMPLETED", "EXPIRED", "CANCELLED"])
    .default("ACTIVE"),
  notes: z
    .string()
    .max(500, "Notes must be at most 500 characters long")
    .optional(),
  diagnosis: z.array(z.string()).optional(),
});

export const updatePrescriptionSchema = createPrescriptionSchema.partial();
