const { z } = require("zod");
// Zod schema for coupon
const couponSchema = z.object({
  code: z
    .string()
    .min(5, { message: "Coupon code must be at least 5 characters" })
    .max(20, { message: "Coupon code must be at most 20 characters" }),

  shop: z
    .array(
      z
        .string()
        .regex(/^[0-9a-fA-F]{24}$/, { message: "Invalid shop ObjectId" })
    )
    .min(1, { message: "There must be at least one shop reference" }),

  discount_type: z.enum(["AMOUNT", "PERCENTAGE"], {
    errorMap: () => ({
      message: "Discount type must be either 'AMOUNT' or 'PERCENTAGE'",
    }),
  }),

  discount: z.number().min(1, { message: "Discount value must be at least 1" }),

  max_discount_amount: z
    .number()
    .min(0, { message: "Maximum discount amount must be at least 0" }),

  min_order_amount: z
    .number()
    .min(0, { message: "Minimum order amount must be at least 0" }),

  order_limit: z.number().min(1, { message: "Order limit must be at least 1" }),

  start_time: z.string(),

  expire_time: z.string(),

  is_active: z.boolean().optional().default(false),
});

module.exports = { couponSchema };
