"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateObjectId = void 0;
const mongoose_1 = require("mongoose");
const responseHandler_1 = require("../utils/responseHandler");
const validateObjectId = (req, res, next) => {
    const { id } = req.params;
    // During migration, we allow both Mongoose ObjectIds and Prisma UUIDs
    const isMongoId = mongoose_1.Types.ObjectId.isValid(id);
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
    if (!isMongoId && !isUuid) {
        (0, responseHandler_1.sendBadRequest)({
            res,
            message: "Invalid ID format. Please provide a valid ObjectId or UUID.",
            errors: [{ field: "id", message: String(id) }],
        });
        return;
    }
    next();
};
exports.validateObjectId = validateObjectId;
