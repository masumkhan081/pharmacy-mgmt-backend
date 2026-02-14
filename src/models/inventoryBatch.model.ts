import mongoose, { Schema } from "mongoose";

const inventoryBatchSchema = new Schema(
  {
    drug: {
      type: Schema.Types.ObjectId,
      ref: "drugs",
      required: [true, "Drug reference is required"],
    },
    batchNumber: {
      type: String,
      required: [true, "Batch number is required"],
    },
    lotNumber: {
      type: String,
      required: [true, "Lot number is required"],
    },
    manufacturer: {
      type: Schema.Types.ObjectId,
      ref: "manufacturers",
      required: [true, "Manufacturer reference is required"],
    },
    manufactureDate: {
      type: Date,
      required: [true, "Manufacture date is required"],
    },
    expirationDate: {
      type: Date,
      required: [true, "Expiration date is required"],
      validate: {
        validator: function(this: any, value: Date) {
          return value > this.manufactureDate;
        },
        message: "Expiration date must be after manufacture date",
      },
    },
    initialQuantity: {
      type: Number,
      required: [true, "Initial quantity is required"],
      min: [1, "Initial quantity must be at least 1"],
    },
    currentQuantity: {
      type: Number,
      required: [true, "Current quantity is required"],
      min: [0, "Current quantity cannot be negative"],
    },
    costPrice: {
      type: Number,
      required: [true, "Cost price is required"],
      min: [0.01, "Cost price must be at least 0.01"],
    },
    sellingPrice: {
      type: Number,
      required: [true, "Selling price is required"],
      min: [0.01, "Selling price must be at least 0.01"],
    },
    purchaseDate: {
      type: Date,
      required: [true, "Purchase date is required"],
    },
    purchase: {
      type: Schema.Types.ObjectId,
      ref: "purchases",
    },
    supplier: {
      type: Schema.Types.ObjectId,
      ref: "suppliers",
    },
    location: {
      type: String,
      required: [true, "Storage location is required"],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    status: {
      type: String,
      enum: {
        values: ["AVAILABLE", "LOW_STOCK", "OUT_OF_STOCK", "EXPIRED", "RECALLED"],
        message: "Status must be one of the predefined values",
      },
      default: "AVAILABLE",
    },
    notes: String,
  },
  {
    timestamps: true,
    versionKey: false,
    toJSON: { virtuals: true },
  }
);

// Compound index for unique batch per drug
inventoryBatchSchema.index({ drug: 1, batchNumber: 1, lotNumber: 1 }, { unique: true });

// Virtual for remaining shelf life in days
inventoryBatchSchema.virtual('remainingShelfLife').get(function() {
  const now = new Date();
  if (now > this.expirationDate) return 0;
  
  const diffTime = Math.abs(this.expirationDate.getTime() - now.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
});

// Virtual for stock level indicator
inventoryBatchSchema.virtual('stockLevelIndicator').get(function() {
  if (this.currentQuantity === 0) return "OUT_OF_STOCK";
  
  const percentRemaining = (this.currentQuantity / this.initialQuantity) * 100;
  if (percentRemaining <= 10) return "CRITICAL";
  if (percentRemaining <= 25) return "LOW";
  return "NORMAL";
});

// Pre-save middleware to update status based on quantity and expiration
inventoryBatchSchema.pre("save", function(next) {
  const now = new Date();
  
  // Check expiration
  if (now > this.expirationDate) {
    this.status = "EXPIRED";
    this.isActive = false;
  } 
  // Check quantity
  else if (this.currentQuantity === 0) {
    this.status = "OUT_OF_STOCK";
  } else if (this.currentQuantity < this.initialQuantity * 0.25) {
    this.status = "LOW_STOCK";
  } else {
    this.status = "AVAILABLE";
  }
  
  next();
});

// When a batch is created/updated, update the associated drug's available quantity
inventoryBatchSchema.post("save", async function() {
  // Calculate total quantity available for this drug across all active batches
  const totalAvailable = await mongoose.model("inventoryBatches").aggregate([
    {
      $match: { 
        drug: this.drug,
        status: { $in: ["AVAILABLE", "LOW_STOCK"] },
        isActive: true
      }
    },
    {
      $group: {
        _id: "$drug",
        total: { $sum: "$currentQuantity" }
      }
    }
  ]);
  
  // Update the drug's available quantity
  if (totalAvailable && totalAvailable.length > 0) {
    await mongoose.model("drugs").findByIdAndUpdate(
      this.drug,
      { available: totalAvailable[0].total }
    );
  }
});

export default mongoose.model("inventoryBatches", inventoryBatchSchema);
