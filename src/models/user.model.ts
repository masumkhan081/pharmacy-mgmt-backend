import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { userRoles } from "../config/constants";

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Please fill a valid email address",
      ],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters long"],
    },
    fullName: {
      type: String,
      required: [true, "Full name is required"],
      minlength: [3, "Full name must be at least 3 characters long"],
    },
    phone: {
      type: String,
      required: [true, "Phone is required"],
      minlength: [3, "Phone must be at least 3 characters long"],
    },
    role: {
      type: String,
      required: [true, "Role is required"],
      enum: {
        values: Object.values(userRoles),
        message: "Role must be either ADMIN, SELLER, or BIDDER",
      },
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true, // Used to "soft-delete" the user
    },
  },
  {
    timestamps: true,
    versionKey: false,
    toJSON: { virtuals: true },
  }
);

// Pre-save middleware to hash the password
userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
  next();
});

export default mongoose.model("User", userSchema);
