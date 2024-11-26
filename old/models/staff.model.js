import mongoose, { Schema } from "mongoose";
//
export default mongoose.model(
  "staff",
  Schema({
    fullName: {
      type: String,
      min: 4,
      max: 100,
      required: true,
    },
    email: {
      type: String,
      min: 25,
      max: 200,
      required: true,
    },
    phone: {
      type: String,
      min: 25,
      max: 200,
      required: true,
    },
    designation: {
      type: String,
      min: 25,
      max: 200,
      enum: ["admin", "manager", "pharmacist", "salesman"],
      default: "salesman",
      required: true,
    },
    isUser: {
      type: Boolean,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "users",
      default: null,
    },
  })
);
