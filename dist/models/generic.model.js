"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
//
const genericSchema = new mongoose_1.default.Schema({
    group: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "groups",
        required: [true, "Group reference is required"],
    },
    name: {
        type: String,
        required: [true, "Generic name is required"],
        minlength: [3, "Generic name must be at least 3 character long"],
        maxlength: [55, "Generic name cannot exceed 55 characters"],
        unique: true,
        index: true, // Create an index for faster querying
    },
});
// Pre-save middleware to validate group reference
// genericSchema.pre("save", async function (next) {
//   console.log("this.group " + JSON.stringify(this.group));
//   const group = await Group.findById(this.group);
//   if (!group) {
//     return next(new Error("Invalid group reference"));
//   }
//   next();
// });
exports.default = mongoose_1.default.model("generics", genericSchema);
