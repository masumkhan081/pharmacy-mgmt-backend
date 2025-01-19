"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
//
exports.default = mongoose_1.default.model("salaries", new mongoose_1.default.Schema({
    staff: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "staff",
        required: true,
    },
    month: {
        type: Number,
        required: true,
    },
    year: {
        type: Number,
        required: true,
    },
    dueAmount: {
        type: Number,
        required: true,
    },
    paidAmount: {
        type: Number,
        required: true,
    },
}));
