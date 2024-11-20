/* eslint-disable no-unused-vars */
const { Schema, model } = require("mongoose");
const mongoose = require("mongoose");

const couponVoucherSchema = new Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
    },
    discount_type: {
      type: String,
      required: true,
      enum: ["AMOUNT", "PERCENTAGE"],
    },
    discount_amount: {
      type: Number,
      required: true,
    },
    max_discount_amount: {
      type: Number,
    },
    min_order_amount: {
      type: Number,
      required: true,
    },
    order_limit: {
      type: Number,
    },
    start_time: {
      type: String,
      required: true,
    },
    expire_time: {
      type: String,
      required: true,
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

const CouponVoucher = model("coupon_vouchers", couponVoucherSchema);

module.exports = CouponVoucher;
