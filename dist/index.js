"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable @typescript-eslint/no-explicit-any */
// Polyfill for SlowBuffer in Node 22+ / future Node versions for legacy jsonwebtoken / jwa / buffer-equal-constant-time
// eslint-disable-next-line @typescript-eslint/no-require-imports
const buffer = require("buffer");
if (!buffer.SlowBuffer) {
    buffer.SlowBuffer = buffer.Buffer;
}
const app_1 = __importDefault(require("./app"));
const config_1 = __importDefault(require("./config"));
async function bootstrap() {
    let server;
    try {
        server = app_1.default.listen(config_1.default.port, async () => {
            console.log(`Server running on port ${config_1.default.port}`);
        });
        const exitHandler = () => {
            if (server) {
                server.close(() => {
                    console.log("Server closed.");
                });
            }
            process.exit(1);
        };
        const unexpectedErrorHandler = (error) => {
            console.log(error);
            exitHandler();
        };
        process.on("uncaughtException", unexpectedErrorHandler);
        process.on("unhandledRejection", unexpectedErrorHandler);
    }
    catch (error) {
        if (error.code === "EADDRINUSE") {
            console.error(`Port ${config_1.default.port} is already in use.`);
            process.exit(1);
        }
        else {
            console.error("Unexpected error while starting the server:", error);
            process.exit(1);
        }
    }
}
bootstrap();
