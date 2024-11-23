import mongoose, { Schema } from "mongoose";

//
export default mongoose.model(
  "users",
  Schema({
    staff: {
      type: Schema.Types.ObjectId,
      ref: "staff",
      required: true,
    },
    userName: {
      type: String,
      min: 4,
      max: 25,
      required: true,
    },
    password: {
      type: String,
      min: 6,
      max: 1024,
      required: true,
    },
    role: {
      type: String,
      min: 25,
      max: 200,
      enum: ["admin", "manager", "pharmacist", "salesman"],
      default: "salesman",
      required: true,
    },
    isValidated: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: false,
    },
  })
);
