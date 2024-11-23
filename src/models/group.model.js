import mongoose, { Schema } from "mongoose";
//
export default mongoose.model(
  "groups",
  new Schema({
    name: {
      type: String,
      unique: true,
      required: true,
    },
  })
);
