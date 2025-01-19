"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.staffSchema = void 0;
const zod_1 = require("zod");
exports.staffSchema = zod_1.z.object({
    name: zod_1.z
        .string()
        .min(1, { message: "Name is required" })
        .max(50, { message: "Name cannot exceed 50 characters" }),
});
