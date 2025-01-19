"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_status_1 = __importDefault(require("http-status"));
// import config from "../config/index";
const tokenisation_1 = require("../utils/tokenisation");
const user_model_1 = __importDefault(require("../models/user.model"));
function accessControl(accessRoles) {
    return async (req, res, next) => {
        try {
            const token = req.headers.authorization;
            if (!token) {
                res.status(http_status_1.default.FORBIDDEN).json({
                    success: false,
                    message: "Access Forbidden!",
                });
                return; // Explicitly return to avoid further execution
            }
            const { success, payload } = (0, tokenisation_1.verifyToken)(token);
            if (!success) {
                res.status(http_status_1.default.FORBIDDEN).json({
                    success: false,
                    message: "Invalid token !",
                });
                return;
            }
            const email = payload?.email;
            if (!email) {
                res.status(http_status_1.default.FORBIDDEN).json({
                    success: false,
                    message: "Invalid token !",
                });
                return;
            }
            // Retrieve user by email
            const user = await user_model_1.default.findOne({ email });
            if (!user) {
                res.status(http_status_1.default.FORBIDDEN).json({
                    success: false,
                    message: "Access Forbidden! User not found.",
                });
                return;
            }
            req.userId = user.id;
            req.role = payload?.role;
            if (accessRoles.includes(req.role)) {
                // console.log("success: \n")
                next();
            }
            else {
                res.status(http_status_1.default.FORBIDDEN).json({
                    success: false,
                    message: "Access Forbidden!",
                });
            }
        }
        catch (error) {
            console.error("Error at accessControl:", error instanceof Error ? error.message : "Unknown error");
            res.status(http_status_1.default.FORBIDDEN).json({
                success: false,
                message: "Access Forbidden!",
            });
        }
    };
}
exports.default = accessControl;
