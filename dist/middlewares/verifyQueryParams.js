"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("../config/constants");
const responseHandler_1 = require("../utils/responseHandler");
const validateQueryParams = (entity) => (req, res, next) => {
    const validParams = [...constants_1.mapSearchable[entity], "searchBy", "search"];
    const invalidParams = Object.keys(req.query).filter((key) => !validParams.includes(key));
    if (typeof req.query.searchBy === "string" &&
        !validParams.includes(req.query.searchBy)) {
        invalidParams.push(req.query.searchBy);
    }
    if (invalidParams.length > 0) {
        (0, responseHandler_1.sendBadRequest)({
            res,
            message: `Invalid query parameters: ${invalidParams.join(", ")}`,
            errors: invalidParams.map((p) => ({ field: p, message: "Invalid parameter" })),
        });
        return;
    }
    next();
};
exports.default = validateQueryParams;
