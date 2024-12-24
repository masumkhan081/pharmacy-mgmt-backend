import mongoose from "mongoose";
import config from "../config/index";

const mongodbConnection = async (retries = 5, delay = 2000) => {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      await mongoose.connect(config.dbUrl, {
        dbName: config.dbName || "pharmacy-management",
      });
      console.log("Mongodb connected!");
      return;
    } catch (error) {
      console.error(`Attempt ${attempt} failed:`, error);
      if (attempt < retries) {
        console.log(`Retrying in ${delay}ms...`);
        await new Promise((resolve) => setTimeout(resolve, delay));
      } else {
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
    await mongoose.connection.close();
    console.log("Mongodb connection closed.");
    process.exit(0);
  } catch (error) {
    console.error("Error closing Mongodb connection:", error);
    process.exit(1);
  }
});

export default mongodbConnection;
