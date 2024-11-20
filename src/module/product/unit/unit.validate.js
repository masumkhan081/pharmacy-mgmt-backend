const { z } = require("zod");

const unitSchema = z.object({
  short_name: z
    .string()
    .min(1, { message: "Short name must be at least 1 characters long" })
    .max(10, { message: "Short name cannot exceed 10 characters" })
    .regex(/^[a-zA-Z]+$/, {
      message: "Short name should contain only letters",
    }),

  full_name: z
    .string()
    .min(3, { message: "Full name must be at least 3 characters long" })
    .max(50, { message: "Full name cannot exceed 50 characters" })
    .regex(/^[a-zA-Z\s]+$/, {
      message: "Full name should contain only letters and spaces",
    }),

  is_active: z.boolean().default(false),
});

const unitStatusSchema = z.object({
  is_active: z.boolean({
    required_error: "is_active is required",
    invalid_type_error: "is_active must be a boolean value",
  }),
});

module.exports = { unitSchema, unitStatusSchema };
