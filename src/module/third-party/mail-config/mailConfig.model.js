/* eslint-disable no-unused-vars */
const { Schema, model } = require("mongoose");
const mongoose = require("mongoose");

const mailConfigSchema = new Schema(
  {
    mail_mailer: {
      type: String,
      required: true,
    },
    mail_host: {
      type: String,
      required: true,
    },
    mail_port: {
      type: String,
      required: true,
    },
    mail_username: {
      type: String,
      required: true,
    },
    mail_password: {
      type: String,
      required: true,
    },
    mail_from_address: {
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
//
const MailConfig = model("mail_configs", mailConfigSchema);
//
module.exports = MailConfig;
