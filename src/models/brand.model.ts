import mongoose from "mongoose";
import Manufacturer from "./mfr.model";
import Generic from "./generic.model";

const brandSchema = new mongoose.Schema(
  {
    generic: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "generics",
      required: [true, "Generic reference is required"],
    },
    manufacturer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "manufacturers",
      required: [true, "Manufacturer reference is required"],
    },
    name: {
      type: String,
      required: [true, "Brand name is required"],
      minlength: [3, "Brand name must be at least 3 characters long"],
      maxlength: [35, "Brand name cannot exceed 35 characters"],
      unique: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

brandSchema.pre("save", async function (next) {
  try {
    const genericExists = await Generic.findById(this.generic);
    if (!genericExists) {
      return next(new Error("Invalid generic reference"));
    }

    const manufacturerExists = await Manufacturer.findById(this.manufacturer);
    if (!manufacturerExists) {
      return next(new Error("Invalid manufacturer reference"));
    }

    next();
  } catch (error) {
    if (error instanceof Error)
      return next(new Error("Error validating references: " + error.message));
  }
});

export default mongoose.model("brands", brandSchema);
