import mongoose, { Schema } from "mongoose";

const returnSchema = new Schema(
  {
    returnNumber: {
      type: String,
      required: [true, "Return number is required"],
      unique: true,
    },
    returnType: {
      type: String,
      required: [true, "Return type is required"],
      enum: {
        values: ["CUSTOMER_RETURN", "SUPPLIER_RETURN", "DAMAGED_GOODS", "EXPIRED_DRUGS"],
        message: "Return type must be one of the predefined values",
      },
    },
    returnDate: {
      type: Date,
      required: [true, "Return date is required"],
      default: Date.now,
    },
    customer: {
      type: Schema.Types.ObjectId,
      ref: "customers",
    },
    supplier: {
      type: Schema.Types.ObjectId,
      ref: "suppliers",
    },
    originalInvoice: {
      type: Schema.Types.ObjectId,
      ref: "invoices",
    },
    originalPurchase: {
      type: Schema.Types.ObjectId,
      ref: "purchases",
    },
    items: [
      {
        drug: {
          type: Schema.Types.ObjectId,
          ref: "drugs",
          required: [true, "Drug reference is required"],
        },
        batch: {
          type: Schema.Types.ObjectId,
          ref: "inventoryBatches",
        },
        quantity: {
          type: Number,
          required: [true, "Quantity is required"],
          min: [1, "Quantity must be at least 1"],
        },
        unitPrice: {
          type: Number,
          required: [true, "Unit price is required"],
          min: [0.01, "Unit price must be at least 0.01"],
        },
        reason: {
          type: String,
          required: [true, "Return reason is required"],
          enum: {
            values: [
              "DAMAGED", "EXPIRED", "WRONG_ITEM", "WRONG_QUANTITY", 
              "PATIENT_DECEASED", "ADVERSE_REACTION", "NOT_NEEDED",
              "RECALL", "QUALITY_ISSUE", "OTHER"
            ],
            message: "Reason must be one of the predefined values",
          },
        },
        condition: {
          type: String,
          enum: {
            values: ["NEW", "OPENED", "DAMAGED", "EXPIRED"],
            message: "Condition must be one of the predefined values",
          },
        },
        notes: String,
      },
    ],
    totalAmount: {
      type: Number,
      required: [true, "Total amount is required"],
      min: [0, "Total amount cannot be negative"],
    },
    refundAmount: {
      type: Number,
      min: [0, "Refund amount cannot be negative"],
    },
    refundMethod: {
      type: String,
      enum: {
        values: ["CASH", "CREDIT_CARD_REVERSAL", "STORE_CREDIT", "REPLACEMENT", "NONE"],
        message: "Refund method must be one of the predefined values",
      },
    },
    refundDate: Date,
    status: {
      type: String,
      required: [true, "Status is required"],
      enum: {
        values: ["PENDING", "APPROVED", "REJECTED", "COMPLETED", "CANCELLED"],
        message: "Status must be one of the predefined values",
      },
      default: "PENDING",
    },
    approvedBy: {
      type: Schema.Types.ObjectId,
      ref: "staff",
    },
    processedBy: {
      type: Schema.Types.ObjectId,
      ref: "staff",
      required: [true, "Staff reference who processed the return is required"],
    },
    notes: String,
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Pre-save middleware to generate return number
returnSchema.pre("save", async function (next) {
  if (!this.returnNumber) {
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    
    // Find the latest return number for today
    const latestReturn = await mongoose.model("returns").findOne(
      { returnNumber: new RegExp(`^RTN-${year}${month}${day}-`) },
      { returnNumber: 1 },
      { sort: { returnNumber: -1 } }
    );

    let counter = 1;
    if (latestReturn && latestReturn.returnNumber) {
      const parts = latestReturn.returnNumber.split("-");
      if (parts.length === 3) {
        counter = parseInt(parts[2]) + 1;
      }
    }

    this.returnNumber = `RTN-${year}${month}${day}-${counter.toString().padStart(4, "0")}`;
  }
  next();
});

// Update inventory quantities when return is approved or completed
returnSchema.pre("save", async function(next) {
  // Only process if status is changing to APPROVED or COMPLETED
  if (!this.isModified('status') || 
     (this.status !== 'APPROVED' && this.status !== 'COMPLETED')) {
    return next();
  }
  
  try {
    // For customer returns, increase drug inventory
    if (this.returnType === 'CUSTOMER_RETURN' && 
       (this.status === 'APPROVED' || this.status === 'COMPLETED')) {
      
      for (const item of this.items) {
        if (item.batch) {
          // If we have batch information, update the specific batch
          const batch = await mongoose.model("inventoryBatches").findById(item.batch);
          if (batch) {
            batch.currentQuantity += item.quantity;
            await batch.save();
          }
        } else {
          // Otherwise update the general drug quantity
          const drug = await mongoose.model("drugs").findById(item.drug);
          if (drug) {
            drug.available += item.quantity;
            await drug.save();
          }
        }
      }
    }
    
    next();
  } catch (error) {
    next(error);
  }
});

export default mongoose.model("returns", returnSchema);
