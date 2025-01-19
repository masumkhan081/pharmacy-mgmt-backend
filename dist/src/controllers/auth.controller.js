"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const auth_service_1 = __importDefault(require("../services/auth.service"));
// import config from "../../config/index";
// import {
//   sendCreateResponse,
//   sendDeletionResponse,
//   sendErrorResponse,
//   sendFetchResponse,
//   sendUpdateResponse,
//   responseMap,
// } from "../../utils/responseHandler";
// import { entities, userRoles } from "../../config/constants";
const tokenisation_1 = require("../utils/tokenisation");
const mail_1 = require("../utils/mail");
const user_model_1 = __importDefault(require("../models/user.model"));
// Register User Function
const registerUser = (role) => async (req, res) => {
    try {
        const isExist = await user_model_1.default.findOne({ email: req.body.email });
        if (isExist) {
            res.status(409).json({
                success: false,
                message: "Email already registered.",
            });
        }
        else {
            req.body.password = await (0, tokenisation_1.getHashedPassword)(req.body.password);
            req.body.role = role;
            await auth_service_1.default.register({
                res,
                data: req.body,
            });
        }
    }
    catch (error) {
        console.log("controller: registerUser: " + error);
        res
            .status(500)
            .json({ success: false, message: "Error processing request" });
    }
};
// Resend OTP Function
const requestEmailVerification = async (req, res) => {
    try {
        const user = await user_model_1.default.findOne({ email: req.body.email });
        if (!user) {
            res.status(404).json({
                success: false,
                message: "No user associated with that email",
            });
            return;
        }
        if (user.isVerified) {
            res.status(200).json({ message: "Account already verified" });
            return;
        }
        const { success, token } = await (0, mail_1.sendOTPMail)(req.body.email);
        res.status(success ? 200 : 400).json({
            success,
            message: success
                ? "An OTP has been sent to your email for verification"
                : "Failed to send OTP",
            token,
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};
// Verify Email Function
const verifyEmail = async (req, res) => {
    try {
        await auth_service_1.default.verifyEmail({
            res,
            data: req.body,
        });
    }
    catch (error) {
        console.log(error);
        if (error instanceof Error)
            console.log("err in controller: " + error.message);
        res.status(500).json({ message: "Internal server error" });
    }
};
// Login Function
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        await auth_service_1.default.login({ res, email, password });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};
// Request Account Recovery Function
const requestAccountRecovery = async (req, res) => {
    try {
        const user = await user_model_1.default.findOne({ email: req.body.email });
        if (!user) {
            res
                .status(400)
                .json({ message: "No account associated with that email." });
            return;
        }
        if (!user.isVerified) {
            res.status(400).json({ message: "Your account is not verified yet." });
            return;
        }
        const { success } = await (0, mail_1.sendResetMail)("user.email");
        res.status(success ? 200 : 400).json({
            success,
            message: success
                ? "A password reset link has been sent to your mail"
                : "Failed to send reset link. Please try again.",
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};
// Verify Account Recovery Function
const verifyAccountRecovery = async (req, res) => {
    try {
        const { token } = req.params;
        const { success, payload } = (0, tokenisation_1.verifyToken)(token);
        if (!success || !payload) {
            res.status(401).json({
                success: false,
                message: "The provided token is invalid or has changed.",
            });
            return;
        }
        const { expireAt, email } = payload;
        if (expireAt && new Date().getTime() >= expireAt) {
            res.status(400).json({
                success: false,
                message: "Password reset link expired.",
            });
            return;
        }
        const user = await user_model_1.default.findOne({ email });
        if (!user) {
            res.status(404).json({
                success: false,
                message: "User not found.",
            });
            return;
        }
        res.status(200).json({
            success: true,
            message: "You can update your password now.",
            token,
        });
    }
    catch (error) {
        console.log("err: verifyRecoveryToken: " + error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};
// Update Password Function
const updatePassword = async (req, res) => {
    try {
        const { token, email, password, confirmPassword } = req.body;
        const user = await user_model_1.default.findOne({ email });
        if (!user) {
            res.status(404).json({
                success: false,
                message: "No user associated with that email",
            });
            return;
        }
        if (password !== confirmPassword) {
            res.status(400).json({
                success: false,
                message: "Password & confirm password don't match",
            });
            return;
        }
        const { success, payload } = (0, tokenisation_1.verifyToken)(token);
        if (!success || !payload) {
            res.status(401).json({
                success: false,
                message: "The provided token is invalid or has changed.",
            });
            return;
        }
        const { expireAt, email: emailFromToken } = payload;
        if (email !== emailFromToken) {
            res.status(401).json({
                success: false,
                message: "The provided token is invalid or has changed.",
            });
            return;
        }
        if (expireAt && new Date().getTime() >= expireAt) {
            res.status(400).json({
                success: false,
                message: "Password reset link expired.",
            });
            return;
        }
        const hashedPassword = await (0, tokenisation_1.getHashedPassword)(password);
        const result = await auth_service_1.default.updatePassword({
            email,
            password: hashedPassword,
        });
        if (result instanceof Error) {
            res.status(400).json({
                success: false,
                message: "Failed to update password",
            });
            return;
        }
        res.status(200).json({
            success: true,
            message: "Password updated successfully. You may log in.",
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Internal server error" });
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
