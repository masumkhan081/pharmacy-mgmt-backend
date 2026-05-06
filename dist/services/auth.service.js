"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_model_1 = __importDefault(require("../models/user.model"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const mail_1 = require("../utils/mail");
const config_1 = __importDefault(require("../config"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const crypto_js_1 = __importDefault(require("crypto-js"));
const user_model_2 = __importDefault(require("../models/user.model"));
const responseHandler_1 = require("../utils/responseHandler");
// Register Function
async function register({ res, data }) {
    let user;
    let profile;
    try {
        const { fullName, phone, gender, address, email, password, role } = data;
        profile = await new user_model_2.default({ fullName, phone, address, gender }).save();
        user = await new user_model_1.default({
            email,
            password,
            role,
            profile: profile.id,
        }).save();
        const { success, token } = await (0, mail_1.sendOTPMail)("user.email");
        if (success) {
            res.status(200).json({
                statusCode: 200,
                success: true,
                message: "An OTP has been sent to your email for verification",
                data: { token },
            });
        }
        else {
            if (profile)
                await user_model_2.default.findByIdAndDelete(profile.id);
            if (user)
                await user_model_1.default.findByIdAndDelete(user.id);
            (0, responseHandler_1.sendBadRequest)({ res, message: "Failed to send verification OTP" });
        }
    }
    catch (error) {
        if (profile)
            await user_model_2.default.findByIdAndDelete(profile.id);
        if (user)
            await user_model_1.default.findByIdAndDelete(user.id);
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
        const user = await user_model_1.default.findOneAndUpdate({ email }, { isVerified: true });
        if (!user) {
            return (0, responseHandler_1.sendNotFound)({
                res,
                message: "No user associated with that email",
            });
        }
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
        const user = await user_model_1.default.findOne({ email });
        let token;
        if (!user) {
            return (0, responseHandler_1.sendBadRequest)({ res, message: "Wrong Credentials" });
        }
        const isPasswordValid = await bcryptjs_1.default.compare(password, user.password);
        if (!isPasswordValid) {
            return (0, responseHandler_1.sendBadRequest)({ res, message: "Wrong Credentials" });
        }
        if (!user.isVerified) {
            const { success, token: otpToken } = await (0, mail_1.sendOTPMail)("user.email");
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
            userId: user.id,
            role: user.role,
            email: "user.email",
            expire: 2628000000 + Date.now(),
        }, config_1.default.tokenSecret, config_1.default.jwtOptions);
        user.isActive = true;
        await user.save();
        res.status(200).json({
            statusCode: 200,
            success: true,
            message: "You are successfully logged in",
            data: { token, user: { id: user.id, role: user.role } },
        });
    }
    catch (error) {
        (0, responseHandler_1.sendErrorResponse)({ res, error, entity: "user" });
    }
}
// Update Password Function
async function updatePassword({ email, password }) {
    try {
        const result = await user_model_1.default.findOneAndUpdate({ email }, { password }, { new: true } // Return the updated document
        );
        return result;
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
