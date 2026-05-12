"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const responseHandler_1 = require("../utils/responseHandler");
const validateRequest = (requestBodySchema) => (req, res, next) => {
    const valid = requestBodySchema.safeParse({
        body: req.body,
        query: req.query,
        params: req.params,
    });
    if (valid.success) {
        // Only overwrite if the schema actually defines these keys
        if (valid.data.body)
            req.body = valid.data.body;
        if (valid.data.query)
            req.query = valid.data.query;
        if (valid.data.params)
            req.params = valid.data.params;
        return next();
    }
    // Fallback for schemas that are NOT wrapped in { body: ... }
    const directValid = requestBodySchema.safeParse(req.body);
    if (directValid.success) {
        req.body = directValid.data;
        return next();
    }
    const issues = valid.success ? [] : valid.error.issues;
    const directIssues = directValid.success ? [] : directValid.error.issues;
    // Use the issues from whichever one was intended (usually the wrapped one)
    const errorSource = issues.length > 0 ? issues : directIssues;
    const errors = errorSource.map((issue) => ({
        field: String(issue.path[issue.path.length - 1] ?? ""),
        message: issue.message,
    }));
    (0, responseHandler_1.sendBadRequest)({ res, message: "Validation failed", errors });
};
exports.default = validateRequest;
