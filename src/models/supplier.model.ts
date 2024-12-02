import mongoose from "mongoose";

export default mongoose.model(
  "suppliers",
  new mongoose.Schema(
    {
      fullName: {
        type: String,
        required: [true, "Full name is required."],
        minlength: [1, "Full name must be at least 1 character long."],
        maxlength: [100, "Full name must be at most 100 characters long."],
      },
      phone: {
        type: String,
        required: [true, "Phone number is required."],
        unique: true,
        minlength: [10, "Phone number must be at least 10 characters long."],
        maxlength: [15, "Phone number must be at most 15 characters long."],
      },
      altPhone: {
        type: String,
        required: [true, "Phone number is required."],
        unique: true,
        minlength: [10, "Phone number must be at least 10 characters long."],
        maxlength: [15, "Phone number must be at most 15 characters long."],
      },
      gender: {
        type: String,
        enum: {
          values: ["MALE", "FEMALE", "OTHER"],
          message: "Gender must be either MALE, FEMALE, or OTHER.",
        },
      },
      email: {
        type: String,
        required: [true, "Email is required."],
        unique: true,
        validate: {
          validator: function (value: string) {
            return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
          },
          message: "Please enter a valid email address.",
        },
      },
      manufacturer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "manufacturers",
        required: [true, "Manufacturer is required."],
      },
      address: {
        type: String,
        maxlength: [55, "Phone number must be at most 55 characters long."],
      },
      deliveryFrequency: {
        type: String,
        enum: ["Daily", "Weekly", "Monthly", "On-demand"],
        default: "On-demand",
      },
      isActive: {
        type: Boolean,
        default: false,
      },
      notes: {
        type: String,
        maxlength: [500, "Notes must be at most 500 characters long."],
      },
    },
    {
      timestamps: true,
      versionKey: false,
      toJSON: { virtuals: true },
    }
  )
);
