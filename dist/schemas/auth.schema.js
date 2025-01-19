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
exports.resetPassSchema = exports.emailSchema = exports.otpVerSchema = exports.loginSchema = exports.registerSchema = void 0;
const z = __importStar(require("zod"));
exports.registerSchema = z.object({
    email: z
        .string()
        .email({ message: "Invalid email format" })
        .nonempty({ message: "Email is required" }),
    password: z
        .string()
        .min(6, { message: "Password must be at least 6 characters long" })
        .max(20, { message: "Password must be at most 20 characters long" })
        .nonempty({ message: "Password is required" }),
    fullName: z
        .string()
        .min(1, { message: "Full name is required" })
        .max(50, { message: "Full name must be at most 50 characters long" }),
    phone: z.string().nonempty({ message: "Phone number is required" }),
    gender: z.enum(["MALE", "FEMALE", "OTHER"]).optional(),
    address: z.string().optional(),
});
//
exports.loginSchema = z.object({
    email: z.string().email({ message: "Invalid email address" }),
    password: z
        .string()
        .min(6, { message: "Password must be at least 6 characters long" })
        .max(20, { message: "Password must be no more than 20 characters" }),
});
//
exports.otpVerSchema = z.object({
    email: z.string().email({ message: "Invalid email address" }),
    token: z.string().min(15).max(500),
    otp: z.string().min(4).max(6),
});
exports.emailSchema = z.object({
    email: z.string().email({ message: "Invalid email address" }),
});
exports.resetPassSchema = z.object({
    token: z.string().min(15).max(500),
    email: z.string().email({ message: "Invalid email address" }),
    password: z
        .string()
        .min(6, { message: "Password must be at least 6 characters long" })
        .max(20, { message: "Password must be no more than 20 characters" }),
    confirmPassword: z
        .string()
        .min(6, { message: "Password must be at least 6 characters long" })
        .max(20, { message: "Password must be no more than 20 characters" }),
});
