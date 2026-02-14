import mongoose, { Schema } from "mongoose";

const controlledSubstanceSchema = new Schema(
  {
    drug: {
      type: Schema.Types.ObjectId,
      ref: "drugs",
      required: [true, "Drug reference is required"],
    },
    scheduledClass: {
      type: String,
      required: [true, "Scheduled class is required"],
      enum: {
        values: ["I", "II", "III", "IV", "V", "Unscheduled"],
        message: "Scheduled class must be a valid controlled substance category",
      },
    },
    regulatoryBody: {
      type: String,
      required: [true, "Regulatory body is required"],
    },
    regulationNumber: {
      type: String,
      required: [true, "Regulation number is required"],
    },
    specialRequirements: [{
      type: String,
      trim: true,
    }],
    storageRequirements: {
      type: String,
      required: [true, "Storage requirements are required"],
    },
    dispensingRestrictions: {
      type: String,
      required: [true, "Dispensing restrictions are required"],
    },
    recordKeepingPeriod: {
      type: Number,
      required: [true, "Record keeping period (in months) is required"],
      min: [0, "Record keeping period cannot be negative"],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    notes: String,
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Ensure each drug can only have one controlled substance record
controlledSubstanceSchema.index({ drug: 1 }, { unique: true });

// Automatically set isActive to false if the related drug is inactive
controlledSubstanceSchema.pre("save", async function(next) {
  const drug = await mongoose.model("drugs").findById(this.drug);
  if (!drug) {
    return next(new Error("Drug not found"));
  }
  
  // If there's an available field on the drug that indicates activity status
  // Here we're assuming if available quantity is 0, the drug is inactive
  if (drug.available === 0) {
    this.isActive = false;
  }
  
  next();
});

export default mongoose.model("controlledSubstances", controlledSubstanceSchema);
