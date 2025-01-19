"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = exports.createToken = void 0;
exports.getHashedPassword = getHashedPassword;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const config_1 = __importDefault(require("../config"));
const createToken = ({ payload, expireTime, }) => {
    try {
        return jsonwebtoken_1.default.sign(payload, config_1.default.tokenSecret, {
            expiresIn: expireTime,
        });
    }
    catch (error) {
        if (error instanceof Error) {
            console.error("Error creating token:", error.message);
        }
        else {
            throw new Error("Token creation failed.");
        }
    }
};
exports.createToken = createToken;
const verifyToken = (token) => {
    try {
        const payload = jsonwebtoken_1.default.verify(token, config_1.default.tokenSecret);
        return { success: true, payload };
    }
    catch (error) {
        if (error instanceof Error) {
            console.error("Error verifying token:", error.message);
        }
        return { success: false, payload: null };
    }
};
exports.verifyToken = verifyToken;
//
async function getHashedPassword(password) {
    try {
        const salt = await bcrypt_1.default.genSalt(10);
        return bcrypt_1.default.hash(password, salt);
    }
    catch (error) {
        console.error("Error generating hash from password:", error);
        throw new Error("Failed to hash password");
    }
}
