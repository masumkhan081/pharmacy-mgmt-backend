import   mongoose, {Schema } from "mongoose";
//
export default mongoose.model(
  "formulations",
  new Schema({
    fullName: {
      type: String,
      required: true,
    },
    shortName: {
      type: String,
      unique: true,
      required: true,
    },
  })
);
