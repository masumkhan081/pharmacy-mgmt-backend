/* eslint-disable no-unused-vars */
const { Schema, model } = require("mongoose");

const color_schema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Color name is required"],
      minlength: [3, "Color name must be at least 3 characters long"],
      maxlength: [30, "Color name cannot exceed 30 characters"],
      validate: {
        validator: function (v) {
          return /^[a-zA-Z\s]+$/.test(v); // Allows only letters and spaces
        },
        message: "Color name should contain only letters and spaces",
      },
    },
    hex: {
      type: String,
      required: [true, "Hex color code is required"],
      validate: {
        validator: function (v) {
          return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(v); // Validates hex color code
        },
        message: "Invalid hex color code",
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

const Color = model("colors", color_schema);

module.exports = Color;
