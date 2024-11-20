/* eslint-disable no-unused-vars */
const { Schema, model } = require("mongoose");
const mongoose = require("mongoose");
//

const shopSettingSchema = {
  commission: {
    type: Number,
  },
  commission_type: {
    type: String,
    enum: ["Percentage", "Fixed Amount"],
    required: true,
  },
  commission_charge: {
    type: String,
    enum: ["Per Order", "Monthly"],
    required: true,
  },
  is_pos_panel_enabled: {
    type: Boolean,
    default: false,
  },
  is_shop_reg_required: {
    type: Boolean,
    default: false,
  },
  is_product_add_approval_required: {
    type: Boolean,
    default: false,
  },
  is_product_update_approval_required: {
    type: Boolean,
    default: false,
  },
};

const ShopSetting = model("shop_settings", shopSettingSchema);

module.exports = ShopSetting;
