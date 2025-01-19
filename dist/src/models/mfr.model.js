"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
exports.default = mongoose_1.default.model("manufacturers", new mongoose_1.default.Schema({
    name: {
        type: String,
        required: [true, "Manufacturer name is required"],
        minlength: [3, "Manufacturer name must be at least 3 character long"],
        maxlength: [35, "Manufacturer name cannot exceed 35 characters"],
        unique: true,
    },
}));
