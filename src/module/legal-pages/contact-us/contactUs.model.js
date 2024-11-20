/* eslint-disable no-unused-vars */
const { Schema, model } = require("mongoose");
const mongoose = require("mongoose");

const contactUsSchema = new Schema(
  {
    phone: {
      type: String,
      required: true,
    },
    alt_phone: {
      type: String,
      required: true,
    },
    whatsapp: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    messenger_link: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
    toJSON: { virtuals: true },
  }
);

const ContactUs = model("contact_us", contactUsSchema);

module.exports = ContactUs;
