"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable @typescript-eslint/no-explicit-any */
const app_1 = __importDefault(require("./app"));
const mongodb_1 = __importDefault(require("./config/mongodb"));
const config_1 = __importDefault(require("./config"));
//
async function bootstrap() {
    let server;
    try {
        server = app_1.default.listen(config_1.default.port, async () => {
            console.log(`Server running on port ${config_1.default.port}`);
            // Initialize the database
            await (0, mongodb_1.default)();
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
        // process.on("SIGINT", exitHandler); // Handle Ctrl+C
        // process.on("SIGTERM", exitHandler); // Handle termination
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
