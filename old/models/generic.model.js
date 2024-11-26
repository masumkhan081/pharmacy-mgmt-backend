import mongoose, {Schema}  from "mongoose";
//
export default mongoose.model(
  "generics",
  new Schema({
    group: {
      type: Schema.Types.ObjectId,
      ref: "groups",
      required: true,
    },
    name: {
      type: String,
      unique: true,
      required: true,
    },
  })
);
