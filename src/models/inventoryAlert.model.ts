import mongoose, { Schema } from "mongoose";

const inventoryAlertSchema = new Schema(
  {
    drug: {
      type: Schema.Types.ObjectId,
      ref: "drugs",
      required: [true, "Drug reference is required"],
    },
    minThreshold: {
      type: Number,
      required: [true, "Minimum threshold is required"],
      min: [1, "Minimum threshold must be at least 1"],
    },
    maxThreshold: {
      type: Number,
      required: [true, "Maximum threshold is required"],
      validate: {
        validator: function(this: any, value: number) {
          return value > this.minThreshold;
        },
        message: "Maximum threshold must be greater than minimum threshold",
      },
    },
    reorderPoint: {
      type: Number,
      required: [true, "Reorder point is required"],
      min: [1, "Reorder point must be at least 1"],
      validate: {
        validator: function(this: any, value: number) {
          return value >= this.minThreshold && value <= this.maxThreshold;
        },
        message: "Reorder point must be between minimum and maximum thresholds",
      },
    },
    reorderQuantity: {
      type: Number,
      required: [true, "Reorder quantity is required"],
      min: [1, "Reorder quantity must be at least 1"],
    },
    preferredSupplier: {
      type: Schema.Types.ObjectId,
      ref: "suppliers",
    },
    autoReorder: {
      type: Boolean,
      default: false,
    },
    alertTriggered: {
      type: Boolean,
      default: false,
    },
    lastAlertDate: Date,
    lastReorderDate: Date,
    isActive: {
      type: Boolean,
      default: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "staff",
      required: [true, "Staff reference who created the alert is required"],
    },
    updatedBy: {
      type: Schema.Types.ObjectId,
      ref: "staff",
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Ensure that each drug can only have one inventory alert record
inventoryAlertSchema.index({ drug: 1 }, { unique: true });

export default mongoose.model("inventoryAlerts", inventoryAlertSchema);
