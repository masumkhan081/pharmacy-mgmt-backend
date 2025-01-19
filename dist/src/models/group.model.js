"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const groupSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: [true, "Group name is required"],
        minlength: [3, "Group name must be at least 3 character long"],
        maxlength: [75, "Group name cannot exceed 75 characters"],
        unique: true,
    },
});
exports.default = mongoose_1.default.model("groups", groupSchema);
