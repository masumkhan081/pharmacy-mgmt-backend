/* eslint-disable no-unused-vars */
const { Schema, model } = require("mongoose");
const mongoose = require("mongoose");

const privacyPolicySchema = new Schema(
  {
    title: {
      type: String,
      unique: true,
      required: true,
    },
    content: {
      type: String,
      unique: true,
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
    toJSON: { virtuals: true },
  }
);

const PrivacyPolicy = model("privacy_policy", privacyPolicySchema);

module.exports = PrivacyPolicy;
