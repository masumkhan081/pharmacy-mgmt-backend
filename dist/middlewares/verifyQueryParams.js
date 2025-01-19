"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("../config/constants");
const validateQueryParams = (entity) => (req, res, next) => {
    const validParams = [...constants_1.mapSearchable[entity], "searchBy", "search"];
    const invalidParams = Object.keys(req.query).filter((key) => !validParams.includes(key));
    if (typeof req.query.searchBy === "string" &&
        !validParams.includes(req.query.searchBy)) {
        invalidParams.push(req.query.searchBy);
    }
    if (invalidParams.length > 0) {
        return res.status(400).json({
            error: `Invalid query parameters: ${invalidParams.join(", ")}`,
        });
    }
    next();
};
exports.default = validateQueryParams;
