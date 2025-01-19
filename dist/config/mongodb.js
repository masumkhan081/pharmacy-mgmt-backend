"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const index_1 = __importDefault(require("../config/index"));
const mongodbConnection = async (retries = 5, delay = 2000) => {
    for (let attempt = 1; attempt <= retries; attempt++) {
        try {
            await mongoose_1.default.connect(index_1.default.dbUrl, {
                dbName: index_1.default.dbName || "pharmacy-management",
            });
            console.log("Mongodb connected!");
            return;
        }
        catch (error) {
            console.error(`Attempt ${attempt} failed:`, error);
            if (attempt < retries) {
                console.log(`Retrying in ${delay}ms...`);
                await new Promise((resolve) => setTimeout(resolve, delay));
            }
            else {
                console.error("Mongodb not connected after maximum retries.");
                throw error;
            }
        }
    }
};
// Graceful Shutdown
// 1. closing database connections
// 2. cleaning up resources
// 3. logging out users before the program exits
process.on("SIGINT", async () => {
    try {
        await mongoose_1.default.connection.close();
        console.log("Mongodb connection closed.");
        process.exit(0);
    }
    catch (error) {
        console.error("Error closing Mongodb connection:", error);
        process.exit(1);
    }
});
exports.default = mongodbConnection;
