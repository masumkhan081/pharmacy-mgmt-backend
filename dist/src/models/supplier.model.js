"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
exports.default = mongoose_1.default.model("suppliers", new mongoose_1.default.Schema({
    fullName: {
        type: String,
        required: [true, "Full name is required."],
        minlength: [1, "Full name must be at least 1 character long."],
        maxlength: [100, "Full name must be at most 100 characters long."],
    },
    phone: {
        type: String,
        required: [true, "Phone number is required."],
        unique: true,
        minlength: [10, "Phone number must be at least 10 characters long."],
        maxlength: [15, "Phone number must be at most 15 characters long."],
    },
    altPhone: {
        type: String,
        required: [true, "Phone number is required."],
        unique: true,
        minlength: [10, "Phone number must be at least 10 characters long."],
        maxlength: [15, "Phone number must be at most 15 characters long."],
    },
    gender: {
        type: String,
        enum: {
            values: ["MALE", "FEMALE", "OTHER"],
            message: "Gender must be either MALE, FEMALE, or OTHER.",
        },
    },
    email: {
        type: String,
        required: [true, "Email is required."],
        unique: true,
        validate: {
            validator: function (value) {
                return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
            },
            message: "Please enter a valid email address.",
        },
    },
    manufacturer: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "manufacturers",
        required: [true, "Manufacturer is required."],
    },
    address: {
        type: String,
        maxlength: [55, "Phone number must be at most 55 characters long."],
    },
    deliveryFrequency: {
        type: String,
        enum: ["Daily", "Weekly", "Monthly", "On-demand"],
        default: "On-demand",
    },
    isActive: {
        type: Boolean,
        default: false,
    },
    notes: {
        type: String,
        maxlength: [500, "Notes must be at most 500 characters long."],
    },
}, {
    timestamps: true,
    versionKey: false,
    toJSON: { virtuals: true },
}));
