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
const mongoose_1 = __importStar(require("mongoose"));
const drugSchema = new mongoose_1.Schema({
    brand: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "brands",
        required: [true, "Brand reference is required"],
    },
    formulation: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "formulations",
        required: [true, "Formulation reference is required"],
    },
    strength: {
        type: Number,
        required: [true, "Strength is required"],
        min: [1, "Strength must be at least 1"],
        max: [10000, "Strength cannot exceed 10000"],
    },
    unit: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "units",
        required: [true, "Unit reference is required"],
    },
    available: {
        type: Number,
        required: [true, "Available quantity is required"],
        min: [0, "Available quantity cannot be less than 0"],
    },
    mrp: {
        type: Number,
        required: [true, "MRP is required"],
        min: [0.01, "MRP must be at least 0.01"],
    },
}, { timestamps: true });
drugSchema.pre("save", async function (next) {
    const brandExists = await mongoose_1.default.models.brands.findById(this.brand);
    if (!brandExists) {
        return next(new Error("Invalid brand reference"));
    }
    const formulationExists = await mongoose_1.default.models.formulations.findById(this.formulation);
    if (!formulationExists) {
        return next(new Error("Invalid formulation reference"));
    }
    const unitExists = await mongoose_1.default.models.units.findById(this.unit);
    if (!unitExists) {
        return next(new Error("Invalid unit reference"));
    }
    next();
});
exports.default = mongoose_1.default.model("drugs", drugSchema);
