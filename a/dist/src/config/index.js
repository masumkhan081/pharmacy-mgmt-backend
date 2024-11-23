"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable no-undef */
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const config = {
    baseUrl: process.env.BASE_URL || "http://localhost:3000/",
    appName: "pharmacy-mgmt",
    port: process.env.PORT || 3000,
    dbUrl: process.env.DB_URL ||
        "mongodb+srv://masumkhan:pddrgj3q@cluster0.48jxv.mongodb.net/",
    tokenSecret: process.env.JWT_ACCESS_TOKEN_SECRET || "i-act-as-token-secret",
    refreshTokenSecret: process.env.JWT_REFRESH_TOKEN_SECRET || "i-act-as-refresh-token-secret",
    tokenHeaderKey: process.env.tkn_header_key || "authorization",
    mailHost: process.env.MAIL_HOST || "smtp.gmail.com",
    saltRounds: 12,
    jwtOptions: {
        expiresIn: "730h", // Token will expire after 30 days
    },
    // Removed duplicate mailHost property
    senderMail: process.env.SENDER_MAIL || "masumkhan081.3s@gmail.com",
    senderMailPassword: process.env.SENDER_MAIL_PASSWORD || "uigctmtbjzdyfxoa",
};
exports.default = config;
//# sourceMappingURL=index.js.map