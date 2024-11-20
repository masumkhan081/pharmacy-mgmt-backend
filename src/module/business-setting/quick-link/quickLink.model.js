const { Schema, model } = require("mongoose");
//
const quickLinkSchema = new Schema(
  {
    label: {
      type: String,
      required: true,
    },
    link: {
      type: String,
      required: true,
    },
    is_active: {
      type: String,
      default: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
    toJSON: { virtuals: true },
  }
);

const QuickLink = model("quick_links", quickLinkSchema);

module.exports = QuickLink;
