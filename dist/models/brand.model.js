"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const brandSchema = new mongoose_1.default.Schema({
    generic: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "generics",
        required: [true, "Generic reference is required"],
    },
    manufacturer: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "manufacturers",
        required: [true, "Manufacturer reference is required"],
    },
    name: {
        type: String,
        required: [true, "Brand name is required"],
        minlength: [2, "Brand name must be at least 2 characters long"],
        maxlength: [55, "Brand name cannot exceed 55 characters"],
        unique: true,
        index: true,
    },
}, {
    timestamps: true,
});
// brandSchema.pre("save", async function (next) {
//   try {
//     const genericExists = await Generic.findById(this.generic);
//     if (!genericExists) {
//       return next(new Error("Invalid generic reference"));
//     }
//     const manufacturerExists = await Manufacturer.findById(this.manufacturer);
//     if (!manufacturerExists) {
//       return next(new Error("Invalid manufacturer reference"));
//     }
//     next();
//   } catch (error) {
//     if (error instanceof Error)
//       return next(new Error("Error validating references: " + error.message));
//   }
// });
exports.default = mongoose_1.default.model("brands", brandSchema);
