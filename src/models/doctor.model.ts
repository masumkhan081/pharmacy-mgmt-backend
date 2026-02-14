import mongoose from "mongoose";

const doctorSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, "Full name is required"],
      minlength: [2, "Full name must be at least 2 characters long"],
      maxlength: [100, "Full name must be at most 100 characters long"],
    },
    specialty: {
      type: String,
      required: [true, "Specialty is required"],
    },
    licenseNumber: {
      type: String,
      required: [true, "License number is required"],
      unique: true,
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      minlength: [10, "Phone number must be at least 10 characters long"],
      maxlength: [15, "Phone number must be at most 15 characters long"],
    },
    email: {
      type: String,
      validate: {
        validator: function (value: string) {
          return !value || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
        },
        message: "Please enter a valid email address",
      },
    },
    practiceLocation: {
      name: String,
      address: {
        street: String,
        city: String,
        state: String,
        zipCode: String,
        country: String,
      },
    },
    referrals: {
      type: Number,
      default: 0,
      min: [0, "Referrals cannot be negative"],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    notes: {
      type: String,
      maxlength: [500, "Notes must be at most 500 characters long"],
    },
  },
  {
    timestamps: true,
    versionKey: false,
    toJSON: { virtuals: true },
  }
);

export default mongoose.model("doctors", doctorSchema);
