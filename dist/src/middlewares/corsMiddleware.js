"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cors_1 = __importDefault(require("cors"));
// List of allowed origins
const allowedOrigins = [
    "http://localhost:3001",
    "http://localhost:5173",
    "http://localhost:5000",
];
// Define CORS options type
const corsOptions = {
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true); // Allow the request
        }
        else {
            callback(new Error("Not allowed by CORS"), false); // Deny the request
        }
    },
    methods: ["GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"],
    credentials: true, // Allow credentials such as cookies
};
// Export the CORS middleware
exports.default = (0, cors_1.default)(corsOptions);
