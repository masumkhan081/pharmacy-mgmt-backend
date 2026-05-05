"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const auth_service_1 = __importDefault(require("../services/auth.service"));
const tokenisation_1 = require("../utils/tokenisation");
const mail_1 = require("../utils/mail");
const user_model_1 = __importDefault(require("../models/user.model"));
const responseHandler_1 = require("../utils/responseHandler");
const registerUser = (role) => async (req, res) => {
    try {
        const isExist = await user_model_1.default.findOne({ email: req.body.email });
        if (isExist) {
            return (0, responseHandler_1.sendConflict)({ res, message: "Email already registered." });
        }
        req.body.password = await (0, tokenisation_1.getHashedPassword)(req.body.password);
        req.body.role = role;
        await auth_service_1.default.register({ res, data: req.body });
    }
    catch (error) {
        (0, responseHandler_1.sendErrorResponse)({ res, error, entity: "user" });
    }
};
const requestEmailVerification = async (req, res) => {
    try {
        const user = await user_model_1.default.findOne({ email: req.body.email });
        if (!user) {
            return (0, responseHandler_1.sendNotFound)({
                res,
                message: "No user associated with that email",
            });
        }
        if (user.isVerified) {
            res.status(200).json({
                statusCode: 200,
                success: true,
                message: "Account already verified",
            });
            return;
        }
        const { success, token } = await (0, mail_1.sendOTPMail)(req.body.email);
        if (!success) {
            return (0, responseHandler_1.sendBadRequest)({ res, message: "Failed to send OTP" });
        }
        res.status(200).json({
            statusCode: 200,
            success: true,
            message: "An OTP has been sent to your email for verification",
            data: { token },
        });
    }
    catch (error) {
        (0, responseHandler_1.sendErrorResponse)({ res, error, entity: "user" });
    }
};
const verifyEmail = async (req, res) => {
    try {
        await auth_service_1.default.verifyEmail({ res, data: req.body });
    }
    catch (error) {
        (0, responseHandler_1.sendErrorResponse)({ res, error, entity: "user" });
    }
};
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        await auth_service_1.default.login({ res, email, password });
    }
    catch (error) {
        (0, responseHandler_1.sendErrorResponse)({ res, error, entity: "user" });
    }
};
const requestAccountRecovery = async (req, res) => {
    try {
        const user = await user_model_1.default.findOne({ email: req.body.email });
        if (!user) {
            return (0, responseHandler_1.sendBadRequest)({
                res,
                message: "No account associated with that email.",
            });
        }
        if (!user.isVerified) {
            return (0, responseHandler_1.sendBadRequest)({
                res,
                message: "Your account is not verified yet.",
            });
        }
        const { success } = await (0, mail_1.sendResetMail)("user.email");
        if (!success) {
            return (0, responseHandler_1.sendBadRequest)({
                res,
                message: "Failed to send reset link. Please try again.",
            });
        }
        res.status(200).json({
            statusCode: 200,
            success: true,
            message: "A password reset link has been sent to your mail",
        });
    }
    catch (error) {
        (0, responseHandler_1.sendErrorResponse)({ res, error, entity: "user" });
    }
};
const verifyAccountRecovery = async (req, res) => {
    try {
        const { token } = req.params;
        const { success, payload } = (0, tokenisation_1.verifyToken)(token);
        if (!success || !payload) {
            return (0, responseHandler_1.sendUnauthorized)({
                res,
                message: "The provided token is invalid or has changed.",
            });
        }
        const { expireAt, email } = payload;
        if (expireAt && new Date().getTime() >= expireAt) {
            return (0, responseHandler_1.sendBadRequest)({ res, message: "Password reset link expired." });
        }
        const user = await user_model_1.default.findOne({ email });
        if (!user) {
            return (0, responseHandler_1.sendNotFound)({ res, message: "User not found." });
        }
        res.status(200).json({
            statusCode: 200,
            success: true,
            message: "You can update your password now.",
            data: { token },
        });
    }
    catch (error) {
        (0, responseHandler_1.sendErrorResponse)({ res, error, entity: "user" });
    }
};
const updatePassword = async (req, res) => {
    try {
        const { token, email, password, confirmPassword } = req.body;
        const user = await user_model_1.default.findOne({ email });
        if (!user) {
            return (0, responseHandler_1.sendNotFound)({
                res,
                message: "No user associated with that email",
            });
        }
        if (password !== confirmPassword) {
            return (0, responseHandler_1.sendBadRequest)({
                res,
                message: "Password & confirm password don't match",
            });
        }
        const { success, payload } = (0, tokenisation_1.verifyToken)(token);
        if (!success || !payload) {
            return (0, responseHandler_1.sendUnauthorized)({
                res,
                message: "The provided token is invalid or has changed.",
            });
        }
        const { expireAt, email: emailFromToken } = payload;
        if (email !== emailFromToken) {
            return (0, responseHandler_1.sendUnauthorized)({
                res,
                message: "The provided token is invalid or has changed.",
            });
        }
        if (expireAt && new Date().getTime() >= expireAt) {
            return (0, responseHandler_1.sendBadRequest)({ res, message: "Password reset link expired." });
        }
        const hashedPassword = await (0, tokenisation_1.getHashedPassword)(password);
        const result = await auth_service_1.default.updatePassword({
            email,
            password: hashedPassword,
        });
        if (result instanceof Error) {
            return (0, responseHandler_1.sendBadRequest)({ res, message: "Failed to update password" });
        }
        res.status(200).json({
            statusCode: 200,
            success: true,
            message: "Password updated successfully. You may log in.",
        });
    }
    catch (error) {
        (0, responseHandler_1.sendErrorResponse)({ res, error, entity: "user" });
    }
};
exports.default = {
    registerUser,
    requestEmailVerification,
    verifyEmail,
    login,
    requestAccountRecovery,
    verifyAccountRecovery,
    updatePassword,
};
