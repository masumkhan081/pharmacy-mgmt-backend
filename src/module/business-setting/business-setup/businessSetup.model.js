/* eslint-disable no-unused-vars */
const { Schema, model } = require("mongoose");
const mongoose = require("mongoose");
//
const businessSetupSchema = new Schema({
  company_name: {
    type: String,
    required: true,
  },
  company_email: {
    type: String,
    required: true,
  },
  company_phone: {
    type: String,
    required: true,
  },
  business_model: {
    type: String,
    default: "Multiple Shop",
    enum: ["Single Shop", "Multiple Shop"],
  },
  currency_symbol: {
    type: String,
    required: false,
    default: "৳",
  },
  currency_position: {
    type: String,
    enum: ["Prefix", "Suffix"],
    required: false,
    default: "Prefix",
  },
  time_zone: {
    type: String,
  },
});

const BusinessSetup = model("business_setup", businessSetupSchema);

module.exports = BusinessSetup;
