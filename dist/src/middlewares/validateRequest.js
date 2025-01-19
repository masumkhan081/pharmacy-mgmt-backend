"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const validateRequest = (requestBodySchema) => (req, res, next) => {
    const valid = requestBodySchema.safeParse(req.body);
    // console.log(`--log-- ` + JSON.stringify(req.body))
    if (valid.success) {
        // If validation is successful, proceed to the next middleware
        return next();
    }
    else {
        // Build error messages
        const messages = {};
        valid.error.issues.forEach((issue) => {
            const issueKey = issue.path[0]; // Path is an array, take the first element as the key
            if (messages[issueKey]) {
                messages[issueKey].push(issue.message);
            }
            else {
                messages[issueKey] = [issue.message];
            }
        });
        // Send validation error response
        res.status(400).json({
            success: false,
            message: "Invalid data",
            errors: messages,
            type: "ZodError",
        });
    }
};
exports.default = validateRequest;
