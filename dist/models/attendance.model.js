"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
//
exports.default = mongoose_1.default.model("attendances", new mongoose_1.default.Schema({
    staff: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "staff",
        required: true,
    },
    date: {
        type: Date,
        required: true,
    },
    shift: {
        type: String,
        enum: ["day", "evening", "night", ""],
        default: "day",
        required: true,
    },
    slots: [
        {
            start: { type: Date, required: true },
            end: { type: Date, required: true },
        },
    ],
}));
