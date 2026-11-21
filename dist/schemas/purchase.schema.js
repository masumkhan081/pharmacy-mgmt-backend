"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updatePurchaseSchema = exports.purchaseSchema = void 0;
const zod_1 = require("zod");
// Aligned to `purchase.service.createPurchase` which reads:
//   data.drugs[], data.bill, data.purchaseAt, data.supplier?(uuid), data.actor (injected)
// Each drug item: { drug(uuid), quantity, purchasePrice, mrp, batchNumber, expirationDate }
const purchaseItemSchema = zod_1.z.object({
    drug: zod_1.z.string().uuid("Invalid drug ID"),
    quantity: zod_1.z.number().min(0.01, "Quantity must be greater than 0"),
    purchasePrice: zod_1.z.number().min(0, "Purchase price cannot be negative"),
    mrp: zod_1.z.number().min(0, "MRP cannot be negative"),
    batchNumber: zod_1.z.string().min(1, "Batch number is required"),
    expirationDate: zod_1.z.coerce.date().refine((date) => date > new Date(), {
        message: "Expiration date must be in the future",
    }),
});
exports.purchaseSchema = zod_1.z.object({
    purchaseAt: zod_1.z.coerce.date(),
    supplier: zod_1.z.string().uuid("Invalid supplier ID").optional(),
    drugs: zod_1.z.array(purchaseItemSchema).min(1, "At least one item is required"),
    bill: zod_1.z.number().min(0, "Bill amount cannot be negative"),
});
exports.updatePurchaseSchema = exports.purchaseSchema.partial();
