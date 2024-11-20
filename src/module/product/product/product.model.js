/* eslint-disable no-unused-vars */
const { Schema, model } = require("mongoose");
const mongoose = require("mongoose");

const product_schema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    short_description: {
      type: String,
      required: true,
    },
    shop: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "shops",
      required: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "categories",
      required: true,
    },
    sub_category: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "sub_categories",
      required: true,
    },
    brand: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "brands",
      required: true,
    },
    unit: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "units",
      required: true,
    },
    color: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "colors",
      required: true,
    },
    size: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "sizes",
      required: true,
    },

    sku: {
      type: String,
      required: false,
    },
    buying_price: {
      type: Number,
      required: true,
    },
    selling_price: {
      type: Number,
      required: true,
    },
    discount_type: {
      type: String,
      enum: ["AMOUNT", "PERCENT"],
      required: true,
    },
    discount_amount: {
      type: Number,
      required: function () {
        return this.discount_type === "AMOUNT";
      },
      min: [0, "Discount amount must be at least 0"],
    },
    discount_percentage: {
      type: Number,
      required: function () {
        return this.discount_type === "PERCENT";
      },
      min: [0, "Discount percentage must be at least 0"],
    },
    discount_price: {
      type: Number,
      required: true,
      // Optional: You can calculate this dynamically if needed
    },
    current_stock_quantity: {
      type: Number,
      required: true,
    },
    minimum_order_quantity: {
      type: Number,
      required: true,
    },
    product_thumbnail: {
      type: String,
      required: false,
    },
    additional_product_thumbnail: {
      type: [String],
      required: false,
    },
    product_approval: {
      type: String,
      enum: ["PENDING", "DISAPPROVED", "APPROVED", "CANCELLED", "UNDER_REVIEW"],
      required: true,
      default: "PENDING",
    },
    is_active: {
      type: Boolean,
      required: true,
      default: false,
    },
    review_note: {
      type: String,
    },
  },
  {
    timestamps: true,
    versionKey: false,
    toJSON: { virtuals: true },
  }
);

const Product = model("products", product_schema);

module.exports = Product;
