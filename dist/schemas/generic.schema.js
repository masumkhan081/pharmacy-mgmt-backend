"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.genericUpdateSchema = exports.genericSchema = void 0;
const zod_1 = require("zod");
exports.genericSchema = zod_1.z.object({
    group: zod_1.z.string().uuid(),
    name: zod_1.z
        .string()
        .min(3, "Generic name must be at least 3 characters long")
        .max(35, "Generic name cannot exceed 35 characters"),
});
exports.genericUpdateSchema = exports.genericSchema.partial();
