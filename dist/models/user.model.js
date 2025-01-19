"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const constants_1 = require("../config/constants");
const userSchema = new mongoose_1.default.Schema({
    username: {
        type: String,
        required: [true, "Username is required"],
        unique: true,
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        minlength: [6, "Password must be at least 6 characters long"],
    },
    role: {
        type: String,
        required: [true, "Role is required"],
        enum: {
            values: Object.values(constants_1.userRoles),
            message: "Role must be either ADMIN, SELLER, or BIDDER",
        },
    },
    staff: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "staff",
        required: [true, "Staff reference is missing"],
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    isActive: {
        type: Boolean,
        default: true, // Used to "soft-delete" the user
    },
}, {
    timestamps: true,
    versionKey: false,
    toJSON: { virtuals: true },
});
// Pre-save middleware to hash the password
userSchema.pre("save", async function (next) {
    if (this.isModified("password")) {
        const salt = await bcrypt_1.default.genSalt(10);
        this.password = await bcrypt_1.default.hash(this.password, salt);
    }
    next();
});
exports.default = mongoose_1.default.model("User", userSchema);
