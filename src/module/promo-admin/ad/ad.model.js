/* eslint-disable no-unused-vars */
const { Schema, model } = require("mongoose");
const mongoose = require("mongoose");

const ads_schema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    is_active: {
      type: Boolean,
      default: false,
    },
    thumbnail: {
      type: String,
      required: true,
    },
    display_page: {
      type: String,
      enum: ["Home page", "Contact us", "Product detail"],
      default: "Home page",
      required: false,
    },
  },
  {
    timestamps: true,
    versionKey: false,
    toJSON: { virtuals: true },
  }
);

const Ad = model("ads", ads_schema);

module.exports = Ad;
