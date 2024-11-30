import mongoose, { Schema } from "mongoose";

const drugSchema = new Schema(
  {
    brand: {
      type: Schema.Types.ObjectId,
      ref: "brands",
      required: [true, "Brand reference is required"],
    },
    formulation: {
      type: Schema.Types.ObjectId,
      ref: "formulations",
      required: [true, "Formulation reference is required"],
    },
    strength: {
      type: Number,
      required: [true, "Strength is required"],
      min: [1, "Strength must be at least 1"],
      max: [10000, "Strength cannot exceed 10000"],
    },
    unit: {
      type: Schema.Types.ObjectId,
      ref: "units",
      required: [true, "Unit reference is required"],
    },
    available: {
      type: Number,
      required: [true, "Available quantity is required"],
      min: [0, "Available quantity cannot be less than 0"],
    },
    mrp: {
      type: Number,
      required: [true, "MRP is required"],
      min: [0.01, "MRP must be at least 0.01"],
    },
  },
  { timestamps: true }
);

drugSchema.pre("save", async function (next) {
  const brandExists = await mongoose.models.brands.findById(this.brand);
  if (!brandExists) {
    return next(new Error("Invalid brand reference"));
  }
  const formulationExists = await mongoose.models.formulations.findById(
    this.formulation
  );
  if (!formulationExists) {
    return next(new Error("Invalid formulation reference"));
  }
  const unitExists = await mongoose.models.units.findById(this.unit);
  if (!unitExists) {
    return next(new Error("Invalid unit reference"));
  }
  next();
});

export default mongoose.model("drugs", drugSchema);
