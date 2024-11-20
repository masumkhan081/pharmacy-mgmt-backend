/* eslint-disable no-unused-vars */
const { Schema, model } = require("mongoose");
const mongoose = require("mongoose");
const footerSectionSchema = require("./sub-schema/footerSection.schema.js");
const appLinkSchema = require("./sub-schema/appLink.schema.js");

const generalSettingSchema = new Schema(
  {
    website_name: {
      type: String,
      required: true,
    },
    website_title: {
      type: String,
      required: true,
    },
    website_logo: {
      type: String,
      required: true,
    },
    textual_logo: {
      type: String,
      required: true,
    },
    footer_section: footerSectionSchema,
    app_links: appLinkSchema,
  },
  {
    timestamps: true,
    versionKey: false,
    toJSON: { virtuals: true },
  }
);

const GeneralSetting = model("general_settings", generalSettingSchema);

module.exports = GeneralSetting;
