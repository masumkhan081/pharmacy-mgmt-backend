/* eslint-disable no-unused-vars */
const { Schema, model } = require("mongoose");
const mongoose = require("mongoose");

const coupon_schema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: [true, "Coupon code is required"],
      unique: true,
      minlength: [5, "Coupon code must be at least 5 characters"],
      maxlength: [20, "Coupon code must be at most 20 characters"],
    },
    shop: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "shops",
      required: [true, "Shop reference is required"],
    },
    discount_type: {
      type: String,
      required: [true, "Discount type is required"],
      enum: {
        values: ["AMOUNT", "PERCENTAGE"],
        message: "Discount type must be either 'AMOUNT' or 'PERCENTAGE'",
      },
    },
    discount: {
      type: Number,
      required: [true, "Discount value is required"],
      min: [1, "Discount value must be at least 1"],
      validate: {
        validator: function (value) {
          return this.discount_type === "PERCENTAGE" ? value <= 100 : true;
        },
        message: "Percentage discount cannot exceed 100",
      },
    },
    max_discount_amount: {
      type: Number,
      required: [true, "Maximum discount amount is required"],
      min: [0, "Maximum discount amount must be at least 0"],
    },
    min_order_amount: {
      type: Number,
      required: [true, "Minimum order amount is required"],
      min: [0, "Minimum order amount must be at least 0"],
    },
    order_limit: {
      type: Number,
      required: [true, "Order limit is required"],
      min: [1, "Order limit must be at least 1"],
    },
    start_time: {
      type: String,
      required: [true, "Start time is required"],
      validate: {
        validator: function (value) {
          return Date.parse(value) !== NaN;
        },
        message: "Invalid start time format",
      },
    },
    expire_time: {
      type: String,
      required: [true, "Expire time is required"],
      validate: {
        validator: function (value) {
          return Date.parse(value) !== NaN;
        },
        message: "Invalid expire time format",
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

const Coupon = model("coupons", coupon_schema);

module.exports = Coupon;
