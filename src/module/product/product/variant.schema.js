const { Schema, model } = require("mongoose");
const mongoose = require("mongoose");

const variant_schema = new Schema({
  size: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "sizes",
    required: true,
  },
  color: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "colors",
    required: true,
  },
  stock_quantity: {
    type: Number,
    required: true,
    min: [0, "Stock quantity must be non-negative"],
  },
  selling_price: {
    type: Number,
    required: true,
    min: [0, "Selling price must be non-negative"],
  },
  discount_price: {
    type: Number,
    required: true,
    min: [0, "Discount price must be non-negative"],
  },
});

module.exports = variant_schema;
