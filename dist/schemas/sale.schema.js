"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateSaleSchema = exports.saleSchema = void 0;
const zod_1 = require("zod");
// Aligned to `sale.service.createSale` which reads:
//   data.drugs[], data.bill, data.actor (injected by controller), data.customerId(optional)
// Each drug item: { drug(uuid), quantity, mrp }
const saleItemSchema = zod_1.z.object({
    drug: zod_1.z.string().uuid("Invalid drug ID"),
    quantity: zod_1.z.number().min(0.01, "Quantity must be greater than 0"),
    mrp: zod_1.z.number().min(0, "Price cannot be negative"),
});
exports.saleSchema = zod_1.z.object({
    saleAt: zod_1.z.coerce.date().optional(),
    drugs: zod_1.z.array(saleItemSchema).min(1, "At least one item is required"),
    bill: zod_1.z.number().min(0, "Bill amount cannot be negative"),
    customerId: zod_1.z.string().uuid("Invalid customer ID").optional(),
});
exports.updateSaleSchema = exports.saleSchema.partial();
