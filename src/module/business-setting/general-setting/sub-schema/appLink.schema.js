const { Schema, model } = require("mongoose");
//

const appLinkSchema = new Schema(
  {
    is_app_link_visible: {
      type: Boolean,
      required: false,
    },
    playstore_link: {
      type: String,
      required: false,
    },
    appstore_link: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
    versionKey: false,
    toJSON: { virtuals: true },
  }
);

module.exports = appLinkSchema;
