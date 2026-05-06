"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateSupplierSchema = exports.supplierSchema = void 0;
const z = __importStar(require("zod"));
const mongoose_1 = require("mongoose");
const objectIdValidator = (value) => mongoose_1.Types.ObjectId.isValid(value) || "Invalid ObjectId format";
exports.supplierSchema = z.object({
    fullName: z
        .string()
        .min(1, "Full name must be at least 1 character long.")
        .max(100, "Full name must be at most 100 characters long."),
    phone: z
        .string()
        .min(10, "Phone number must be at least 10 characters long.")
        .max(15, "Phone number must be at most 15 characters long."),
    altPhone: z
        .string()
        .min(10, "Phone number must be at least 10 characters long.")
        .max(15, "Phone number must be at most 15 characters long."),
    gender: z.enum(["MALE", "FEMALE", "OTHER"]).optional(),
    email: z.string().email("Please enter a valid email address."),
    manufacturer: z
        .string()
        .refine(objectIdValidator, { message: "Invalid manufacturer ID format" }),
    address: z
        .string()
        .max(55, "Address must be at most 55 characters long.")
        .optional(),
    deliveryFrequency: z
        .enum(["Daily", "Weekly", "Monthly", "On-demand"])
        .default("On-demand"),
    isActive: z.boolean().default(false),
    notes: z
        .string()
        .max(500, "Notes must be at most 500 characters long.")
        .optional(),
});
exports.updateSupplierSchema = exports.supplierSchema.partial();
