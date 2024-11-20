/* eslint-disable no-unused-vars */
const { Schema, model } = require("mongoose");
const mongoose = require("mongoose");

const shop_schema = new Schema(
  {
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "profiles",
      required: true,
      unique: true,
    },
    shop_name: {
      type: String,
      unique: true,
      required: [true, "Shop name is required."],
      minlength: [3, "Shop name must be at least 3 characters long."],
      maxlength: [50, "Shop name must be less than 50 characters."],
    },
    shop_address: {
      type: String,
      required: true,
      minlength: [10, "Shop address must be at least 10 characters long."],
      maxlength: [120, "Shop address must be less than 120 characters."],
    },
    shop_logo: {
      type: String,
    },
    shop_banner: {
      type: String,
    },
    description: {
      type: String,
    },
    status: {
      type: String,
      enum: {
        values: [
          "APPROVED",
          "DISAPPROVED",
          "PENDING",
          "CANCELLED",
          "UNDER_REVIEW",
        ],
        message: "{VALUE} is not a valid status.",
      },
      default: "PENDING",
    },
    review_note: {
      type: String,
      minlength: [5, "Shop address must be at least 10 characters long."],
      maxlength: [150, "Shop address must be less than 150 characters."],
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

const Shop = model("shops", shop_schema);

module.exports = Shop;
