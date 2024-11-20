/* eslint-disable no-unused-vars */
const { Schema, model } = require("mongoose");
const mongoose = require("mongoose");

const sizeSchema = new Schema(
  {
    short_name: {
      type: String,
      required: [true, "Short name is required"],
      unique: true,
      minlength: [1, "Short name must be at least 2 characters long"],
      maxlength: [10, "Short name cannot exceed 10 characters"],
      validate: {
        validator: function (v) {
          return /^[a-zA-Z]+$/.test(v); // Allows only letters (no numbers or special characters)
        },
        message: "Short name should contain only letters",
      },
    },
    full_name: {
      type: String,
      required: [true, "Full name is required"],
      unique: true,
      minlength: [3, "Full name must be at least 3 characters long"],
      maxlength: [50, "Full name cannot exceed 50 characters"],
      validate: {
        validator: function (v) {
          return /^[a-zA-Z\s]+$/.test(v); // Allows only letters and spaces (no numbers or special characters)
        },
        message: "Full name should contain only letters and spaces",
      },
    },
    is_active: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    versionKey: false,
    toJSON: { virtuals: true },
  }
);

const Size = model("sizes", sizeSchema);

module.exports = Size;
