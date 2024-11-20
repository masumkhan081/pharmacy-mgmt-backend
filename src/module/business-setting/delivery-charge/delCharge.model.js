/* eslint-disable no-unused-vars */
const { Schema, model } = require("mongoose");
const mongoose = require("mongoose");

const delChargeSchema = new Schema({
  zone: {
    type: String,
    required: true,
  },
  charge: {
    type: Number,
    required: true,
  },
});

const DeliveryCharge = model("delivery_charges", delChargeSchema);

module.exports = DeliveryCharge;
