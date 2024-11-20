/* eslint-disable no-unused-vars */
const { Schema, model } = require("mongoose");
const mongoose = require("mongoose");
//
const product_schema_in_cart = new Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "products",
    required: [true, "Product reference is required"], // Required validation with custom message
  },
  size: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "sizes",
    required: [true, "Size reference is required"], // Required validation with custom message
  },
  color: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "colors",
    required: [true, "Color reference is required"], // Required validation with custom message
  },
  // shop: {
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: "shops",
  //   required: [true, "Shop reference is required"], // Required validation with custom message
  // },
  // brand: {
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: "brands",
  //   required: [true, "Brand reference is required"], // Required validation with custom message
  // },
  // unit: {
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: "units",
  //   required: [true, "Unit reference is required"], // Required validation with custom message
  // },
  qty: {
    type: Number,
    required: [true, "Quantity is required"], // Required validation with custom message
    min: [1, "Quantity must be at least 1"], // Minimum validation
    validate: {
      validator: Number.isInteger, // Ensure qty is an integer
      message: "Quantity must be an integer", // Custom error message
    },
  },
  buying_price: {
    type: Number,
    required: [true, "Buying price is required"], // Required validation with custom message
    min: [0, "Buying price must be non-negative"], // Minimum validation
  },
  selling_price: {
    type: Number,
    required: [true, "Selling price is required"], // Required validation with custom message
    min: [0, "Selling price must be non-negative"], // Minimum validation
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
    required: [true, "Discount price is required"], // Required validation with custom message
    min: [0, "Discount price must be non-negative"], // Minimum validation
  },
  //   may be optional
  total_price: {
    type: Number,
    required: [true, "Total price is required"], // Required validation with custom message
    min: [0, "Total price must be non-negative"], // Minimum validation
  },
});
//
const cart_schema = new Schema(
  {
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: [true, "Customer reference is required"], // Required validation with custom message
    },
    products: {
      type: [product_schema_in_cart],
      validate: {
        validator: function (v) {
          return v && v.length > 0;
        },
        message: "Cart must contain at least one product",
      },
    },
  },
  {
    timestamps: true,
    versionKey: false,
    toJSON: { virtuals: true },
  }
);

// Create the Cart model
const Cart = model("carts", cart_schema);

module.exports = Cart;
