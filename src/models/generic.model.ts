import mongoose from "mongoose";
import Group from "./group.model";
//
const genericSchema = new mongoose.Schema({
  group: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "groups",
    required: [true, "Group reference is required"],
  },
  name: {
    type: String,
    required: [true, "Generic name is required"],
    minlength: [3, "Generic name must be at least 3 character long"],
    maxlength: [55, "Generic name cannot exceed 55 characters"],
    unique: true,
    index: true, // Create an index for faster querying
  },
});

// Pre-save middleware to validate group reference
// genericSchema.pre("save", async function (next) {
//   console.log("this.group " + JSON.stringify(this.group));
//   const group = await Group.findById(this.group);
//   if (!group) {
//     return next(new Error("Invalid group reference"));
//   }
//   next();
// });

export default mongoose.model("generics", genericSchema);
