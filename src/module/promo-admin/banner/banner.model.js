/* eslint-disable no-unused-vars */
const { Schema, model } = require("mongoose");
const mongoose = require("mongoose");

const banner_schema = new Schema(
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
  },
  {
    timestamps: true,
    versionKey: false,
    toJSON: { virtuals: true },
  }
);

const Banner = model("banners", banner_schema);

module.exports = Banner;
