import mongoose from "mongoose";

const formulationSchema = new mongoose.Schema({
  shortName: {
    type: String,
    required: [true, "Short name is required"],
    minlength: [1, "Short name must be at least 1 character long"],
    maxlength: [10, "Short name cannot exceed 10 characters"],
    unique: true,
  },
  longName: {
    type: String,
    required: [true, "Long name is required"],
    minlength: [3, "Long name must be at least 3 characters long"],
    maxlength: [50, "Long name cannot exceed 50 characters"],
    unique: true,
  },
});

export default mongoose.model("formulations", formulationSchema);
