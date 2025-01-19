"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.manufacturerSchema = void 0;
const zod_1 = require("zod");
exports.manufacturerSchema = zod_1.z.object({
    name: zod_1.z
        .string()
        .min(2, { message: "Name is required. At least 2 chars." })
        .max(55, { message: "Name cannot exceed 55 characters" }),
});
