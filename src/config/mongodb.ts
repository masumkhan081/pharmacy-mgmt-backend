import mongoose from "mongoose";
import config from "../config/index";

const mongodbConnection = async () => {
  try {
    await mongoose.connect(config.dbUrl, {
      dbName: config.dbName || "pharmacy-management",
    });
    console.log("Mongodb connected!");
  } catch (error) {
    if (error instanceof Error) {
      console.log("Mongodb not connected! " + error.message);
    } else {
      console.log("Mongodb not connected! Unknown error occurred.");
    }
  }
};

export default mongodbConnection;
