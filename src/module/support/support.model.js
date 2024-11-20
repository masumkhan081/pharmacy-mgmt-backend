/* eslint-disable no-unused-vars */
const { Schema, model } = require("mongoose");
const mongoose = require("mongoose");

const support_schema = new Schema(
  {
    subject: {
      type: String,
      required: true,
    },
    issue:{
      type:String,
      enum:["ORDER",""]
    },
    message: {
      type: String,
      required: true,
    },
    send_to: {
      type: String,
      required: true,
    },
    sent_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "addresses",
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
    toJSON: { virtuals: true },
  }
);

const Support = model("supports", support_schema);

module.exports = Support;
