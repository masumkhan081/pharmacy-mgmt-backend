const { z } = require("zod");
// Define a Zod schema for the product
const productSchemaInCart = z.object({
  product: z.string().nonempty("Product reference is required"),
  size: z.string().nonempty("Size reference is required"),
  color: z.string().nonempty("Color reference is required"),
  qty: z
    .number()
    .min(1, "Quantity must be at least 1")
    .int("Quantity must be an integer")
    .nonnegative("Quantity must be non-negative"),
});

const cartSchema = z.object({
  products: z
    .array(productSchemaInCart)
    .min(1, "At least one product is required"),
});

module.exports = { cartSchema };
