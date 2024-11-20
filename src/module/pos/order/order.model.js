/* eslint-disable no-unused-vars */
const { Schema, model } = require("mongoose");
const mongoose = require("mongoose");
const { product_schema, shop_reference } = require("../cart/product.schema");
//

const address_schema = {};

const order_schema = new Schema(
  {
    products: [product_schema],
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "customers",
      required: true,
    },
    voucher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "coupon_vouchers",
      default: null,
    },
    shop: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "shops",
      required: [true, "Shop reference is required"], // Required validation with custom message
    },
    shipping_address: {
      type: String,
    },
    checkout_time: {
      type: String,
    },
    payment_method: {
      type: String,
      required: true,
      enum: ["CASH_ON_DELIVERY"],
    },
    shipping_charge: {
      type: Number,
      default: 0.0,
    },
    sub_total: {
      type: Number,
      required: true,
    },
    voucher_discount: {
      type: Number,
      default: 0.0,
    },
    total_payable: {
      type: Number,
    },
    status: {
      type: String,
      required: true,
      enum: [
        "PENDING",
        "CONFIRMED",
        "PROCESSING",
        "OUT FOR DELIVERY",
        "DELIVERED",
        "CANCELLED",
        "FAILED",
      ],
      default: "PENDING",
    },
    customer_note: {
      type: String,
    },
  },
  {
    timestamps: true,
    versionKey: false,
    toJSON: { virtuals: true },
  }
);

const Order = model("orders", order_schema);

module.exports = Order;
