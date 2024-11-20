const { Schema, model } = require("mongoose");
//
const socialLinkSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      enum: ["Facebook", "Instagram", "Youtube", "Linkedin"],
    },
    icon: {
      type: String,
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

const SocialkLink = model("social_links", socialLinkSchema);

module.exports = SocialkLink;
