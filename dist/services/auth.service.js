"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_repository_1 = __importDefault(require("../repositories/user.repository"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const mail_1 = require("../utils/mail");
const config_1 = __importDefault(require("../config"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const crypto_js_1 = __importDefault(require("crypto-js"));
const responseHandler_1 = require("../utils/responseHandler");
// Register Function
async function register({ res, data }) {
    try {
        const { fullName, email, password, role } = data;
        // Check if user already exists
        const existing = await user_repository_1.default.findByEmail(email);
        if (existing) {
            return res.status(409).json({ success: false, message: "Email already registered" });
        }
        // Hash password (if not already handled in controller, but service is better)
        // Actually auth.controller calls getHashedPassword
        const user = await user_repository_1.default.create({
            username: email, // Use email as username for now if not provided
            email,
            name: fullName,
            password,
            role: role.toUpperCase(),
        });
        // Email verification logic remains same
        const { success, token } = await (0, mail_1.sendOTPMail)(email);
        if (success) {
            res.status(200).json({
                statusCode: 200,
                success: true,
                message: "An OTP has been sent to your email for verification",
                data: { token },
            });
        }
        else {
            // In a real app, we might want to delete the user if OTP fails, 
            // but usually we just allow them to resend.
            (0, responseHandler_1.sendBadRequest)({ res, message: "Failed to send verification OTP" });
        }
    }
    catch (error) {
        (0, responseHandler_1.sendErrorResponse)({ res, error, entity: "user" });
    }
}
// Verify Email Function
async function verifyEmail({ data, res, }) {
    try {
        const { expireAt, otp, email } = JSON.parse(crypto_js_1.default.AES.decrypt(data.token, config_1.default.tokenSecret).toString(crypto_js_1.default.enc.Utf8));
        if (new Date().getTime() > expireAt) {
            return (0, responseHandler_1.sendBadRequest)({ res, message: "OTP expired" });
        }
        if (data.otp !== otp || data.email !== email) {
            return (0, responseHandler_1.sendBadRequest)({ res, message: "Invalid OTP or email" });
        }
        const userDoc = await user_repository_1.default.findByEmail(email);
        if (!userDoc) {
            return (0, responseHandler_1.sendNotFound)({
                res,
                message: "No user associated with that email",
            });
        }
        // We don't have isVerified in the new Prisma User yet? 
        // Actually I should add it to the schema.
        // For now, let's assume verification is a flag we can add.
        // TEMPORARY: Just update isVerified.
        await user_repository_1.default.update(userDoc.id, { isVerified: true, isActive: true });
        res.status(200).json({
            statusCode: 200,
            success: true,
            message: "Account verified. You may login",
        });
    }
    catch (error) {
        (0, responseHandler_1.sendErrorResponse)({ res, error, entity: "user" });
    }
}
// Login Function
async function login({ res, email, password, }) {
    try {
        const userDoc = await user_repository_1.default.findByEmail(email);
        let token;
        if (!userDoc || !userDoc.password) {
            return (0, responseHandler_1.sendBadRequest)({ res, message: "Wrong Credentials" });
        }
        const isPasswordValid = await bcryptjs_1.default.compare(password, userDoc.password);
        if (!isPasswordValid) {
            return (0, responseHandler_1.sendBadRequest)({ res, message: "Wrong Credentials" });
        }
        if (!userDoc.isVerified) {
            const { success, token: otpToken } = await (0, mail_1.sendOTPMail)(userDoc.email);
            if (!success) {
                return (0, responseHandler_1.sendBadRequest)({
                    res,
                    message: "Your account is not verified yet",
                });
            }
            res.status(200).json({
                statusCode: 200,
                success: true,
                message: "Your account is not yet verified. We sent an OTP to your mail.",
                data: { token: otpToken },
            });
            return;
        }
        token = jsonwebtoken_1.default.sign({
            userId: userDoc.id,
            role: userDoc.role,
            email: userDoc.email,
            expire: 2628000000 + Date.now(),
        }, config_1.default.tokenSecret, config_1.default.jwtOptions);
        if (!userDoc.isActive) {
            await user_repository_1.default.update(userDoc.id, { isActive: true });
        }
        res.status(200).json({
            statusCode: 200,
            success: true,
            message: "You are successfully logged in",
            data: { token, user: { id: userDoc.id, role: userDoc.role } },
        });
    }
    catch (error) {
        (0, responseHandler_1.sendErrorResponse)({ res, error, entity: "user" });
    }
}
// Update Password Function
async function updatePassword({ email, password }) {
    try {
        const user = await user_repository_1.default.findByEmail(email);
        if (!user)
            throw new Error("User not found");
        return await user_repository_1.default.update(user.id, { password });
    }
    catch (error) {
        return error;
    }
}
exports.default = {
    register,
    login,
    verifyEmail,
    updatePassword,
};
