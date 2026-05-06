"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updatePurchaseSchema = exports.purchaseSchema = void 0;
const zod_1 = require("zod");
const mongoose_1 = require("mongoose");
const objectIdValidator = (value) => mongoose_1.Types.ObjectId.isValid(value) || "Invalid ObjectId format";
const purchaseItemSchema = zod_1.z.object({
    drug: zod_1.z
        .string()
        .refine(objectIdValidator, { message: "Invalid drug ID format" }),
    quantity: zod_1.z.number().int().min(1, "Quantity must be at least 1"),
    unitPrice: zod_1.z.number().min(0.01, "Unit price must be at least 0.01"),
});
exports.purchaseSchema = zod_1.z.object({
    purchaseAt: zod_1.z.coerce.date(),
    drugs: zod_1.z.array(purchaseItemSchema).min(1, "At least one item is required"),
    bill: zod_1.z.number().min(0.01, "Bill amount must be at least 0.01"),
});
exports.updatePurchaseSchema = exports.purchaseSchema.partial();
