const { z } from "zod");

// Define a Zod schema for address validation
const addressSchema = z.object({
  district: z.string().min(1).max(50), //
  sub_district: z.string().min(1).max(50), //
  village: z.string().min(1).max(50).optional(), //
  street: z.string().min(1).max(100).optional(), //
  building: z.string().min(1).max(100).optional(), //
});

export default addressSchema;
