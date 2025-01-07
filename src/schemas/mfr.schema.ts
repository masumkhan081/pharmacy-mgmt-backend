import { z } from "zod";

export const manufacturerSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Name is required. At least 2 chars." })
    .max(55, { message: "Name cannot exceed 55 characters" }),
});
