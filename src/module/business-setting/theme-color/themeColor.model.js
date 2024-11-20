/* eslint-disable no-unused-vars */
const { Schema, model } = require("mongoose");
const mongoose = require("mongoose");

const themeColorSchema = Schema({
  hex: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
    enum: [
      "Primary",
      "Secondary",
      "Accent",
      "Background",
      "Accent",
      "Text",
      "Link",
      "Border",
      "Hover",
    ],
  },
});

const ThemeColor = model("theme_colors", themeColorSchema);

module.exports = ThemeColor;
