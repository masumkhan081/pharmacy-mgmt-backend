import mongoose, {Schema}  from "mongoose";
//
export default mongoose.model(
  "drugs",
  new Schema({
    brand: {
      type: Schema.Types.ObjectId,
      ref: "brands",
      required: true,
    },
    formulation: {
      type: Schema.Types.ObjectId,
      ref: "formulations",
      required: true,
    },
    strength: {
      type: Number,
      required: true,
    },
    unit: {
      type: Schema.Types.ObjectId,
      ref: "units",
      required: true,
    },
    available: {
      type: Number,
      required: true,
    },
    mrp: {
      type: Number,
      required: true,
    },
  })
);
