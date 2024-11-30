import mongoose from "mongoose";

export default mongoose.model(
  "manufacturers",
  new mongoose.Schema({
    name: {
      type: String,
      required: [true, "Manufacturer name is required"],
      minlength: [3, "Manufacturer name must be at least 3 character long"],
      maxlength: [35, "Manufacturer name cannot exceed 35 characters"],
      unique: true,
    },
  })
);
