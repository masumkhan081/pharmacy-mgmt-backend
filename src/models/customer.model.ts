import mongoose from "mongoose";

const customerSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, "Full name is required"],
      minlength: [2, "Full name must be at least 2 characters long"],
      maxlength: [100, "Full name must be at most 100 characters long"],
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      unique: true,
      minlength: [10, "Phone number must be at least 10 characters long"],
      maxlength: [15, "Phone number must be at most 15 characters long"],
    },
    altPhone: {
      type: String,
      minlength: [10, "Alternate phone number must be at least 10 characters long"],
      maxlength: [15, "Alternate phone number must be at most 15 characters long"],
    },
    email: {
      type: String,
      validate: {
        validator: function (value: string) {
          return !value || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
        },
        message: "Please enter a valid email address",
      },
    },
    dateOfBirth: {
      type: Date,
    },
    gender: {
      type: String,
      enum: {
        values: ["MALE", "FEMALE", "OTHER"],
        message: "Gender must be either MALE, FEMALE, or OTHER",
      },
    },
    address: {
      street: String,
      city: String,
      state: String,
      zipCode: String,
      country: String,
    },
    allergies: [{
      type: String,
      trim: true,
    }],
    medicalConditions: [{
      type: String,
      trim: true,
    }],
    isActive: {
      type: Boolean,
      default: true,
    },
    loyaltyPoints: {
      type: Number,
      default: 0,
      min: [0, "Loyalty points cannot be negative"],
    },
    notes: {
      type: String,
      maxlength: [500, "Notes must be at most 500 characters long"],
    },
  },
  {
    timestamps: true,
    versionKey: false,
    toJSON: { virtuals: true },
  }
);

// Virtual for customer's age
customerSchema.virtual('age').get(function() {
  if (!this.dateOfBirth) return null;
  const ageDifMs = Date.now() - this.dateOfBirth.getTime();
  const ageDate = new Date(ageDifMs);
  return Math.abs(ageDate.getUTCFullYear() - 1970);
});

export default mongoose.model("customers", customerSchema);
