"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateObjectId = void 0;
const mongoose_1 = require("mongoose");
const responseHandler_1 = require("../utils/responseHandler");
const validateObjectId = (req, res, next) => {
    const { id } = req.params;
    if (!mongoose_1.Types.ObjectId.isValid(id)) {
        (0, responseHandler_1.sendBadRequest)({
            res,
            message: "Invalid ID format. Please provide a valid ObjectId.",
            errors: [{ field: "id", message: String(id) }],
        });
        return;
    }
    next();
};
exports.validateObjectId = validateObjectId;
