/* eslint-disable no-unused-vars */
const { Schema, model } = require("mongoose");
const mongoose = require("mongoose");

const paymentGatewaySchema = new Schema({
  mobile: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  footer_logo: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
});

const PaymentGateway = model("payment_gateway", paymentGatewaySchema);

module.exports = PaymentGateway;
