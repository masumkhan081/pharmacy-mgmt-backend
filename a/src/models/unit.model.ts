import mongoose, { Schema } from "mongoose";
//
export default mongoose.model(
  "units",
  new Schema({
    name: {
      type: String,
      unique: true,
      required: true,
    },
  }),
);
