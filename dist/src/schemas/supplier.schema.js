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
exports.supplierSchema = void 0;
const z = __importStar(require("zod"));
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
    gender: z.enum(["MALE", "FEMALE", "OTHER"]),
    email: z.string().email("Please enter a valid email address."),
    designation: z.enum(["admin", "manager", "pharmacist", "salesman"]),
    address: z.string().max(55, "Address must be at most 55 characters long."),
    shift: z.enum(["Morning", "Afternoon", "Night"]),
    salaryType: z.enum(["Hourly", "Weekly", "Monthly"]),
    hourlySalary: z.number().min(0, "Hourly salary cannot be negative."),
    weeklySalary: z.number().min(0, "Weekly salary cannot be negative."),
    monthlySalary: z.number().min(0, "Monthly salary cannot be negative."),
    hoursPerDay: z
        .number()
        .min(1, "Hours per day must be at least 1 hour.")
        .max(24, "Hours per day cannot exceed 24 hours."),
    daysPerWeek: z
        .number()
        .min(1, "Days per week must be at least 1 day.")
        .max(7, "Days per week cannot exceed 7 days."),
    isActive: z.boolean().default(false),
});
