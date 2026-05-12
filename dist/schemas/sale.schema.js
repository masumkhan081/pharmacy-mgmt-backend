"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateSaleSchema = exports.saleSchema = void 0;
const zod_1 = require("zod");
const saleItemSchema = zod_1.z.object({
    drugId: zod_1.z.string().uuid("Invalid drug ID format"),
    quantity: zod_1.z.number().min(1, "Quantity must be at least 1"),
    price: zod_1.z.number().min(0.01, "Price must be at least 0.01"),
});
exports.saleSchema = zod_1.z.object({
    saleAt: zod_1.z.coerce.date().optional(),
    items: zod_1.z.array(saleItemSchema).min(1, "At least one item is required"),
    totalBill: zod_1.z.number().min(0.01, "Bill amount must be at least 0.01"),
    customerId: zod_1.z.string().uuid("Invalid customer ID format").optional(),
});
exports.updateSaleSchema = exports.saleSchema.partial();
