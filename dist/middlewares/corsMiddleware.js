"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cors_1 = __importDefault(require("cors"));
// List of allowed origins
const allowedOrigins = [
    "http://localhost:3000",
    "http://localhost:3001",
    "http://localhost:5173",
    "https://pharmacy-mgmt.vercel.app",
    "https://pharmacy-mgmt-web.vercel.app",
];
const isVercelDomain = (origin) => {
    try {
        const url = new URL(origin);
        return url.hostname.endsWith(".vercel.app");
    }
    catch {
        return false;
    }
};
// Define CORS options type
const corsOptions = {
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin) || isVercelDomain(origin)) {
            callback(null, true); // Allow the request
        }
        else {
            callback(new Error("Not allowed by CORS"), false); // Deny the request
        }
    },
    methods: ["GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
};
// Export the CORS middleware
exports.default = (0, cors_1.default)(corsOptions);
