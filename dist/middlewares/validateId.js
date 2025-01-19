"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateObjectId = void 0;
const mongoose_1 = require("mongoose"); // Import mongoose's Types for ObjectId validation
// Middleware to validate ObjectId
const validateObjectId = (req, res, next) => {
    const { id } = req.params;
    // Check if the id is a valid MongoDB ObjectId
    if (!mongoose_1.Types.ObjectId.isValid(id)) {
        // Send a response if the ID is invalid, no need to call next()
        res.status(400).json({
            success: false,
            message: "Invalid ID format. Please provide a valid ObjectId.",
        });
        return;
    }
    // If the ID is valid, continue to the next middleware or route handler
    next();
};
exports.validateObjectId = validateObjectId;
