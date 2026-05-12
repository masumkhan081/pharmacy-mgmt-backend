"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const env_1 = require("./env");
const config = {
    baseUrl: process.env.BASE_URL || `http://localhost:${env_1.env.PORT}/`,
    appName: "pharmacy-mgmt",
    port: env_1.env.PORT,
    dbName: "pharmacy-management",
    dbUrl: env_1.env.DB_URL,
    tokenSecret: env_1.env.JWT_ACCESS_TOKEN_SECRET,
    refreshTokenSecret: env_1.env.JWT_REFRESH_TOKEN_SECRET,
    tokenHeaderKey: env_1.env.tkn_header_key,
    mailHost: env_1.env.MAIL_HOST,
    saltRounds: 12,
    jwtOptions: {
        expiresIn: "730h", // 30 days
    },
    senderMail: env_1.env.SENDER_MAIL || "",
    senderMailPassword: env_1.env.SENDER_MAIL_PASSWORD || "",
    brevoApiKey: env_1.env.BREVO_API_KEY,
};
exports.default = config;
