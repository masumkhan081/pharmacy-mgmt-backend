import mongoose, { Schema } from "mongoose";

const auditTrailSchema = new Schema(
  {
    action: {
      type: String,
      required: [true, "Action is required"],
      enum: {
        values: ["CREATE", "READ", "UPDATE", "DELETE", "LOGIN", "LOGOUT", "ACCESS", "DISPENSE", "APPROVE", "REJECT", "OTHER"],
        message: "Action must be one of the predefined values",
      },
    },
    entityType: {
      type: String,
      required: [true, "Entity type is required"],
      enum: {
        values: [
          "USER", "CUSTOMER", "DRUG", "PRESCRIPTION", "SALE", "PURCHASE",
          "INVENTORY", "CONTROLLED_SUBSTANCE", "INVOICE", "PAYMENT",
          "STAFF", "RETURN", "INSURANCE", "SYSTEM", "OTHER"
        ],
        message: "Entity type must be one of the predefined values",
      },
    },
    entityId: {
      type: Schema.Types.ObjectId,
      required: [true, "Entity ID is required"],
    },
    description: {
      type: String,
      required: [true, "Description is required"],
    },
    oldValue: Schema.Types.Mixed,
    newValue: Schema.Types.Mixed,
    performedBy: {
      type: Schema.Types.ObjectId,
      ref: "users",
      required: [true, "User reference who performed the action is required"],
    },
    performedAt: {
      type: Date,
      required: [true, "Timestamp is required"],
      default: Date.now,
    },
    ipAddress: String,
    userAgent: String,
    status: {
      type: String,
      enum: {
        values: ["SUCCESS", "FAILURE", "WARNING", "INFO"],
        message: "Status must be one of the predefined values",
      },
      default: "SUCCESS",
    },
    metadata: Schema.Types.Mixed, // Additional data about the action
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Indexes for better query performance
auditTrailSchema.index({ entityType: 1, entityId: 1 });
auditTrailSchema.index({ performedBy: 1 });
auditTrailSchema.index({ performedAt: 1 });
auditTrailSchema.index({ action: 1 });

export default mongoose.model("auditTrails", auditTrailSchema);
