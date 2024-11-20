const { z } = require("zod");

const colorSchema = z.object({
  name: z
    .string()
    .min(3, { message: "Color name must be at least 3 characters long" })
    .max(30, { message: "Color name cannot exceed 30 characters" })
    .regex(/^[a-zA-Z\s]+$/, {
      message: "Color name should contain only letters and spaces",
    }),

  hex: z
    .string()
    .regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, {
      message: "Invalid hex color code",
    }),

  is_active: z.boolean().default(false),
});

module.exports = { colorSchema };
