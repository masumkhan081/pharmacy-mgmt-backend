import mongoose, { Schema } from "mongoose";
//

const brandSchema = new Schema({
  name: {
    type: String,
    unique: true,
    required: true,
  },
  generic: {
    type: Schema.Types.ObjectId,
    ref: "generics",
    required: true,
  },
  mfr: {
    type: Schema.Types.ObjectId,
    ref: "manufacturers",
    required: true,
  },
});
brandSchema.index({ name: "text", name: "text" });

const Brand = mongoose.model("brands", brandSchema);

module.export = Brand;
