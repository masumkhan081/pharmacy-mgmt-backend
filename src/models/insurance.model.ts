import mongoose, { Schema } from "mongoose";

const insuranceProviderSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Insurance provider name is required"],
      unique: true,
    },
    contactPerson: {
      name: String,
      phone: String,
      email: String,
      position: String,
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      validate: {
        validator: function (value: string) {
          return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
        },
        message: "Please enter a valid email address",
      },
    },
    website: String,
    address: {
      street: String,
      city: String,
      state: String,
      zipCode: String,
      country: String,
    },
    supportHours: String,
    claimSubmissionMethod: {
      type: String,
      enum: ["ONLINE", "EMAIL", "FAX", "MAIL", "IN_PERSON"],
      default: "ONLINE",
    },
    averageProcessingTime: {
      days: Number,
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

// Insurance plan schema
const insurancePlanSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Plan name is required"],
    },
    provider: {
      type: Schema.Types.ObjectId,
      ref: "insuranceProviders",
      required: [true, "Insurance provider reference is required"],
    },
    planNumber: {
      type: String,
      required: [true, "Plan number is required"],
    },
    coverageTypes: [{
      type: String,
      enum: ["PRESCRIPTION", "OTC", "MEDICAL_SUPPLIES", "EQUIPMENT"],
    }],
    coPayAmount: {
      type: Number,
      default: 0,
      min: [0, "Co-pay amount cannot be negative"],
    },
    coveragePercentage: {
      type: Number,
      required: [true, "Coverage percentage is required"],
      min: [0, "Coverage percentage cannot be negative"],
      max: [100, "Coverage percentage cannot exceed 100"],
    },
    maxCoverageAmount: {
      type: Number,
      min: [0, "Maximum coverage amount cannot be negative"],
    },
    formularyList: [{
      type: Schema.Types.ObjectId,
      ref: "drugs",
    }],
    exclusions: [{
      type: String,
    }],
    preAuthorizationRequired: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Customer insurance schema
const customerInsuranceSchema = new Schema(
  {
    customer: {
      type: Schema.Types.ObjectId,
      ref: "customers",
      required: [true, "Customer reference is required"],
    },
    plan: {
      type: Schema.Types.ObjectId,
      ref: "insurancePlans",
      required: [true, "Insurance plan reference is required"],
    },
    membershipId: {
      type: String,
      required: [true, "Membership ID is required"],
    },
    groupNumber: String,
    primaryCardholderName: String,
    relationship: {
      type: String,
      enum: ["SELF", "SPOUSE", "CHILD", "PARENT", "OTHER"],
      default: "SELF",
    },
    effectiveDate: {
      type: Date,
      required: [true, "Effective date is required"],
    },
    expirationDate: {
      type: Date,
      validate: {
        validator: function(this: any, value: Date) {
          return !value || value > this.effectiveDate;
        },
        message: "Expiration date must be after effective date",
      },
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    cardImage: String, // URL to stored image of insurance card
    notes: String,
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Insurance claim schema
const insuranceClaimSchema = new Schema(
  {
    claimNumber: {
      type: String,
      required: [true, "Claim number is required"],
      unique: true,
    },
    customerInsurance: {
      type: Schema.Types.ObjectId,
      ref: "customerInsurances",
      required: [true, "Customer insurance reference is required"],
    },
    invoice: {
      type: Schema.Types.ObjectId,
      ref: "invoices",
      required: [true, "Invoice reference is required"],
    },
    prescription: {
      type: Schema.Types.ObjectId,
      ref: "prescriptions",
    },
    submissionDate: {
      type: Date,
      required: [true, "Submission date is required"],
      default: Date.now,
    },
    claimAmount: {
      type: Number,
      required: [true, "Claim amount is required"],
      min: [0.01, "Claim amount must be at least 0.01"],
    },
    approvedAmount: {
      type: Number,
      min: [0, "Approved amount cannot be negative"],
    },
    rejectionReason: String,
    status: {
      type: String,
      enum: {
        values: ["SUBMITTED", "PROCESSING", "APPROVED", "PARTIALLY_APPROVED", "REJECTED", "RESUBMITTED", "PAID"],
        message: "Status must be one of the predefined values",
      },
      default: "SUBMITTED",
    },
    processingDate: Date,
    paymentDate: Date,
    supportingDocuments: [{
      type: String, // URLs to stored documents
      description: String,
    }],
    notes: String,
    submittedBy: {
      type: Schema.Types.ObjectId,
      ref: "staff",
      required: [true, "Staff reference who submitted the claim is required"],
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Generate claim number before saving
insuranceClaimSchema.pre("save", async function(next) {
  if (!this.claimNumber) {
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    
    // Find the latest claim for this month/year
    const latestClaim = await mongoose.model("insuranceClaims").findOne(
      { claimNumber: new RegExp(`^CLM-${year}${month}-`) },
      { claimNumber: 1 },
      { sort: { claimNumber: -1 } }
    );

    let counter = 1;
    if (latestClaim && latestClaim.claimNumber) {
      const parts = latestClaim.claimNumber.split("-");
      if (parts.length === 3) {
        counter = parseInt(parts[2]) + 1;
      }
    }

    this.claimNumber = `CLM-${year}${month}-${counter.toString().padStart(4, "0")}`;
  }
  next();
});

// Export all schemas
export const InsuranceProvider = mongoose.model("insuranceProviders", insuranceProviderSchema);
export const InsurancePlan = mongoose.model("insurancePlans", insurancePlanSchema);
export const CustomerInsurance = mongoose.model("customerInsurances", customerInsuranceSchema);
export const InsuranceClaim = mongoose.model("insuranceClaims", insuranceClaimSchema);
