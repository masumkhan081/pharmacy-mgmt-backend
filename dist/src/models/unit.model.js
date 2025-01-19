"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const unitSchema = new mongoose_1.default.Schema({
    shortName: {
        type: String,
        required: [true, "Short name is required"],
        minlength: [1, "Short name must be at least 1 character long"],
        maxlength: [10, "Short name cannot exceed 10 characters"],
        unique: true,
    },
    longName: {
        type: String,
        required: [true, "Long name is required"],
        minlength: [3, "Long name must be at least 3 characters long"],
        maxlength: [50, "Long name cannot exceed 50 characters"],
        unique: true,
    },
});
exports.default = mongoose_1.default.model("units", unitSchema);
