"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = require("zod");
function validateData({ schema, data, }) {
    try {
        const valid = schema.safeParse(data);
        if (valid.success) {
            return { success: true };
        }
        const messages = {};
        const issues = valid.error.issues;
        for (const issue of issues) {
            messages[issue.path[0]] = issue.message;
        }
        return {
            success: false,
            message: "Invalid data",
            messages,
        };
    }
    catch (error) {
        if (error instanceof zod_1.ZodError) {
            // Handle ZodError specifically
            return {
                success: false,
                message: "Invalid data",
                messages: error.issues.reduce((acc, issue) => ({ ...acc, [issue.path[0]]: issue.message }), {}),
            };
        }
        else {
            return {
                success: false,
            };
        }
    }
}
exports.default = validateData;
