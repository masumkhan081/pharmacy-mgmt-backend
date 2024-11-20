/* eslint-disable no-unused-vars */
const { Schema, model } = require("mongoose");
const mongoose = require("mongoose");

const tktTypeSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  is_active: {
    type: String,
    required: true,
  },
});

const TktType = model("ticket_types", tktTypeSchema);

module.exports = TktType;
