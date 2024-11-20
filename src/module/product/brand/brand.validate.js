const { z } = require("zod");

const brandSchema = z.object({
  name: z
    .string()
    .min(3, "Brand name must be at least 3 characters long")
    .max(50, "Brand name cannot exceed 50 characters")
    .regex(
      /^[a-zA-Z0-9 ]+$/,
      "Brand name should not contain special characters"
    )
    .nonempty("Brand name is required"),
});

const brandStatusSchema = z.object({
  is_active: z.boolean({
    required_error: "is_active is required",
    invalid_type_error: "is_active must be a boolean value",
  }),
});

module.exports = { brandSchema, brandStatusSchema };
