"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const responseHandler_1 = require("../utils/responseHandler");
const validateRequest = (requestBodySchema) => (req, res, next) => {
    const valid = requestBodySchema.safeParse(req.body);
    if (valid.success) {
        return next();
    }
    const errors = valid.error.issues.map((issue) => ({
        field: String(issue.path[0] ?? ""),
        message: issue.message,
    }));
    (0, responseHandler_1.sendBadRequest)({ res, message: "Invalid data", errors });
};
exports.default = validateRequest;
