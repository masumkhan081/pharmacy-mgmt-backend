import mongoose from "mongoose";

const groupSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Group name is required"],
    minlength: [3, "Group name must be at least 3 character long"],
    maxlength: [75, "Group name cannot exceed 75 characters"],
    unique: true,
  },
});

export default mongoose.model("groups", groupSchema);
