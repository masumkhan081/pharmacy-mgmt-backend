import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const mongodbConnection = async () => {
  try {
    await mongoose.connect(process.env.DB_URL, {
      dbName: "pharmacy-management",
    });
    console.log("Mongodb connected!");
  } catch (error) {
    console.log("Mongodb not connected! " + error.message);
  }
};

export default mongodbConnection;
