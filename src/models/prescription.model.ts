import mongoose, { Schema } from "mongoose";

const prescriptionSchema = new Schema(
  {
    customer: {
      type: Schema.Types.ObjectId,
      ref: "customers",
      required: [true, "Customer reference is required"],
    },
    prescriptionNumber: {
      type: String,
      required: [true, "Prescription number is required"],
      unique: true,
    },
    doctor: {
      type: Schema.Types.ObjectId,
      ref: "doctors",
      required: [true, "Doctor reference is required"],
    },
    issueDate: {
      type: Date,
      required: [true, "Issue date is required"],
      default: Date.now,
    },
    expiryDate: {
      type: Date,
      required: [true, "Expiry date is required"],
      validate: {
        validator: function(this: any, value: Date) {
          return value > this.issueDate;
        },
        message: "Expiry date must be after issue date",
      },
    },
    medications: [
      {
        drug: {
          type: Schema.Types.ObjectId,
          ref: "drugs",
          required: [true, "Drug reference is required"],
        },
        dosage: {
          type: String,
          required: [true, "Dosage is required"],
        },
        frequency: {
          type: String,
          required: [true, "Frequency is required"],
        },
        duration: {
          value: {
            type: Number,
            required: [true, "Duration value is required"],
          },
          unit: {
            type: String,
            enum: ["days", "weeks", "months", "ongoing"],
            required: [true, "Duration unit is required"],
          },
        },
        instructions: String,
        quantity: {
          type: Number,
          required: [true, "Quantity is required"],
          min: [1, "Quantity must be at least 1"],
        },
        refills: {
          type: Number,
          default: 0,
          min: [0, "Refills cannot be negative"],
        },
        refillsUsed: {
          type: Number,
          default: 0,
          min: [0, "Refills used cannot be negative"],
        },
      },
    ],
    status: {
      type: String,
      enum: {
        values: ["ACTIVE", "COMPLETED", "EXPIRED", "CANCELLED"],
        message: "Status must be ACTIVE, COMPLETED, EXPIRED, or CANCELLED",
      },
      default: "ACTIVE",
    },
    notes: {
      type: String,
      maxlength: [500, "Notes must be at most 500 characters long"],
    },
    diagnosis: [String],
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Virtual for refills remaining
prescriptionSchema.virtual('refillsRemaining').get(function() {
  if (!this.medications || this.medications.length === 0) return 0;
  
  // Calculate the minimum refills remaining across all medications
  return Math.min(
    ...this.medications.map(med => Math.max(0, med.refills - med.refillsUsed))
  );
});

// Check if the prescription is valid (not expired and has status ACTIVE)
prescriptionSchema.methods.isValid = function() {
  const now = new Date();
  return this.expiryDate > now && this.status === "ACTIVE";
};

export default mongoose.model("prescriptions", prescriptionSchema);
