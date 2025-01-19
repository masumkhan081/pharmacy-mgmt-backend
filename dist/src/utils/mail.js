"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateOTP = exports.sendOTPMail = exports.sendResetMail = void 0;
exports.getOtpToken = getOtpToken;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const nodemailer_1 = __importDefault(require("nodemailer"));
const crypto_js_1 = __importDefault(require("crypto-js"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("../config"));
// Function to send OTP email for verification
const sendOTPMail = async (email) => {
    try {
        const generatedOTP = generateOTP();
        const mailOptions = getMailOptions({
            to: email,
            subject: () => setSubject("verification"),
            html: () => getVerificationMessage(generatedOTP),
        });
        console.log("mailOptions: " + JSON.stringify(mailOptions));
        const transporter = getTransporter();
        const result = await transporter.sendMail(mailOptions);
        const token = getOtpToken({ otp: generatedOTP, email });
        if (result.accepted.includes(email)) {
            return {
                success: true,
                token,
            };
        }
        return {
            success: false,
        };
    }
    catch (error) {
        if (error instanceof Error) {
            console.log("err: sendOTPMail: " + error.message);
            return { success: false, message: error.message };
        }
        else {
            console.log("An unknown error occurred");
            return { success: false, message: "An unknown error occurred" };
        }
    }
};
exports.sendOTPMail = sendOTPMail;
// Function to send password reset link to user email
const sendResetMail = async (email) => {
    try {
        const mailOptions = getMailOptions({
            to: email,
            subject: () => setSubject("recovery"),
            html: () => getResetLink(email),
        });
        const transporter = getTransporter();
        const result = await transporter.sendMail(mailOptions);
        if (result.accepted.includes(email)) {
            return { success: true };
        }
        return { success: false };
    }
    catch (error) {
        if (error instanceof Error) {
            console.log("err: sendResetMail: " + error.message);
            return { success: false, message: error.message };
        }
        else {
            console.log("An unknown error occurred");
            return { success: false, message: "An unknown error occurred" };
        }
    }
};
exports.sendResetMail = sendResetMail;
// Function to generate a 4-digit OTP
const generateOTP = () => {
    const digits = "0123456789";
    let OTP = "";
    for (let i = 0; i < 4; i++) {
        OTP += digits[Math.floor(Math.random() * 10)];
    }
    return OTP;
};
exports.generateOTP = generateOTP;
// Function to get the verification message for OTP
const getVerificationMessage = (otp) => `<h4 style="color:blue;text-align:center;">Please copy or type the OTP provided below: <br><br>${otp}`;
// Function to generate a password reset link
function getResetLink(email) {
    return `<h4 style="color:blue;text-align:center;">Please click the link to reset your password: </h4><br><br>${config_1.default.baseUrl}/api/auth/recovery/${jsonwebtoken_1.default.sign({
        email: email,
        expireAt: new Date().getTime() + 5 * 60000, // Link expiration in 5 minutes
    }, config_1.default.tokenSecret)}`;
}
// Function to return a relatable email subject based on the purpose
const setSubject = (action) => action === "recovery"
    ? "Auction-platform: Recover Your Password"
    : action === "verification"
        ? "Auction-platform: Verify Your Email"
        : "";
// Function to get the mail options for sending the email
const getMailOptions = ({ to, subject, html, }) => {
    return {
        from: config_1.default.senderMail,
        to,
        subject: subject(),
        html: html(),
    };
};
// Function to create and return a transporter object for sending emails
const getTransporter = () => nodemailer_1.default.createTransport({
    host: config_1.default.mailHost,
    port: 587,
    secure: false,
    auth: {
        user: config_1.default.senderMail,
        pass: config_1.default.senderMailPassword,
    },
    tls: {
        rejectUnauthorized: false,
    },
});
// Function to create and return an encrypted OTP token with expiration
function getOtpToken({ otp, email, phone }) {
    // Define the data to be encrypted
    const data = {
        otp,
        expireAt: new Date().getTime() + 5 * 60000, // expires in 5 minutes
    };
    // Optionally add email and phone if provided
    if (email) {
        data.email = email;
    }
    if (phone) {
        data.phone = phone;
    }
    // Encrypt the data using CryptoJS
    return crypto_js_1.default.AES.encrypt(JSON.stringify(data), config_1.default.tokenSecret).toString();
}
