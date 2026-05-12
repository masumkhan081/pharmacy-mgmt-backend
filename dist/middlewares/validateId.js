"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateObjectId = void 0;
const responseHandler_1 = require("../utils/responseHandler");
const validateObjectId = (req, res, next) => {
    const { id } = req.params;
    // Standard UUID validation
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
    if (!isUuid) {
        (0, responseHandler_1.sendBadRequest)({
            res,
            message: "Invalid ID format. Please provide a valid UUID.",
            errors: [{ field: "id", message: String(id) }],
        });
        return;
    }
    next();
};
exports.validateObjectId = validateObjectId;
