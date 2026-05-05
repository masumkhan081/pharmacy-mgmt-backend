"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const tokenisation_1 = require("../utils/tokenisation");
const user_model_1 = __importDefault(require("../models/user.model"));
const responseHandler_1 = require("../utils/responseHandler");
const extractBearerToken = (header) => {
    if (!header)
        return null;
    const [scheme, token] = header.split(" ");
    if (scheme?.toLowerCase() === "bearer" && token)
        return token;
    return header;
};
function accessControl(accessRoles) {
    return async (req, res, next) => {
        try {
            let role = req.user?.role;
            let userId = req.user?.userId;
            if (!role) {
                const token = extractBearerToken(req.headers.authorization);
                if (!token) {
                    (0, responseHandler_1.sendUnauthorized)({ res, message: "Authentication required" });
                    return;
                }
                const { success, payload } = (0, tokenisation_1.verifyToken)(token);
                if (!success || !payload) {
                    (0, responseHandler_1.sendUnauthorized)({ res, message: "Invalid or expired token" });
                    return;
                }
                role = payload.role;
                userId = payload.userId;
                if (payload.email) {
                    const user = await user_model_1.default.findOne({ email: payload.email });
                    if (!user) {
                        (0, responseHandler_1.sendForbidden)({ res, message: "User not found" });
                        return;
                    }
                    userId = user.id;
                }
                req.user = { userId, role, email: payload.email };
            }
            if (!role || !accessRoles.includes(role)) {
                (0, responseHandler_1.sendForbidden)({
                    res,
                    message: "You do not have permission to perform this action",
                });
                return;
            }
            next();
        }
        catch (error) {
            console.error("accessControl error:", error instanceof Error ? error.message : error);
            (0, responseHandler_1.sendForbidden)({ res, message: "Access check failed" });
        }
    };
}
exports.default = accessControl;
