/* eslint-disable no-unused-vars */
const { Schema, model } = require("mongoose");
const mongoose = require("mongoose");

const delivery_schema = new Schema(
  {
    rider: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "riders",
      required: true,
    },
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "orders",
      required: true,
    },
    status: {
      type: String,
      enum: ["PENDING", "COMPLETE", "FAILED"],
      required: true,
      default: "PENDING",
    },
  },
  {
    timestamps: true,
    versionKey: false,
    toJSON: { virtuals: true },
  }
);

const Delivery = model("deliveries", delivery_schema);

module.exports = Delivery;
