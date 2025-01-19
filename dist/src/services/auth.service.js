"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_model_1 = __importDefault(require("../models/user.model"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const mail_1 = require("../utils/mail");
const config_1 = __importDefault(require("../config"));
// import { getSearchAndPagination } from "../utils/queryHandler";
// import { entities } from "../config/constants";
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// import { sendErrorResponse } from "../../utils/responseHandler";
const crypto_js_1 = __importDefault(require("crypto-js"));
// import { verifyToken, getHashedPassword } from "../utils/tokenisation";
const user_model_2 = __importDefault(require("../models/user.model"));
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
                success,
                message: "An OTP has been sent to your email for verification",
                token,
            });
        }
        else {
            if (profile) {
                await user_model_2.default.findByIdAndDelete(profile.id);
            }
            if (user) {
                await user_model_1.default.findByIdAndDelete(user.id);
            }
        }
    }
    catch (error) {
        if (profile) {
            await user_model_2.default.findByIdAndDelete(profile.id);
        }
        if (user) {
            await user_model_1.default.findByIdAndDelete(user.id);
        }
        if (error instanceof Error)
            console.log("err: register: " + error.message);
        res.status(500).json({ message: "Error creating user profile" });
    }
}
// Verify Email Function
async function verifyEmail({ data, res, }) {
    try {
        const { expireAt, otp, email } = JSON.parse(crypto_js_1.default.AES.decrypt(data.token, config_1.default.tokenSecret).toString(crypto_js_1.default.enc.Utf8));
        // Check if OTP has expired
        if (new Date().getTime() > expireAt) {
            return res.status(400).json({ success: false, message: "OTP expired" });
        }
        // Validate OTP and email
        if (data.otp === otp && data.email === email) {
            const user = await user_model_1.default.findOneAndUpdate({ email }, { isVerified: true });
            if (user) {
                return res.status(200).json({
                    success: true,
                    message: "Account verified. You may login",
                });
            }
            else {
                return res.status(404).json({
                    success: false,
                    message: "No user associated with that email",
                });
            }
        }
        else {
            return res
                .status(400)
                .json({ success: false, message: "Invalid OTP or email" });
        }
    }
    catch (error) {
        console.error("Error verifying email:", error);
        return res
            .status(500)
            .json({ success: false, message: "Internal Server Error" });
    }
}
// Login Function
async function login({ res, email, password, }) {
    try {
        const user = await user_model_1.default.findOne({ email });
        let token;
        if (user) {
            const isPasswordValid = await bcrypt_1.default.compare(password, user.password);
            if (isPasswordValid) {
                if (user.isVerified) {
                    token = jsonwebtoken_1.default.sign({
                        userId: user.id,
                        role: user.role,
                        email: "user.email",
                        expire: 2628000000 + Date.now(),
                    }, config_1.default.tokenSecret, config_1.default.jwtOptions);
                    user.isActive = true;
                    await user.save();
                    res.status(200).json({
                        success: true,
                        message: "You are successfully logged in",
                        token,
                    });
                }
                else {
                    const { success, token } = await (0, mail_1.sendOTPMail)("user.email");
                    return res.status(success ? 200 : 400).json({
                        success,
                        message: success
                            ? "Your account is not yet verified. We sent an OTP to your mail."
                            : "Your account is not verified yet",
                        token,
                    });
                }
            }
            else {
                res.status(400).json({ success: false, message: "Wrong Credentials" });
            }
        }
        else {
            res.status(400).json({ success: false, message: "Wrong Credentials" });
        }
    }
    catch (error) {
        console.error("Inside service func:", error);
        res.status(500).json({ message: "Internal server error" });
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
