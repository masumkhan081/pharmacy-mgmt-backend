import mongoose from "mongoose";

const staffSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, "Full name is required."],
      minlength: [1, "Full name must be at least 1 character long."],
      maxlength: [100, "Full name must be at most 100 characters long."],
    },
    phone: {
      type: String,
      required: [true, "Phone number is required."],
      unique: true,
      minlength: [10, "Phone number must be at least 10 characters long."],
      maxlength: [15, "Phone number must be at most 15 characters long."],
      validate: {
        validator: function (value: string) {
          return /^(?:\+?[1-9]\d{0,14}|0\d{9,14})$/.test(value);
        },
        message: "Phone number must be a valid format.",
      },
    },
    altPhone: {
      type: String,
      required: [true, "Phone number is required."],
      unique: true,
      minlength: [10, "Phone number must be at least 10 characters long."],
      maxlength: [15, "Phone number must be at most 15 characters long."],
    },
    gender: {
      type: String,
      enum: {
        values: ["MALE", "FEMALE", "OTHER"],
        message: "Gender must be either MALE, FEMALE, or OTHER.",
      },
    },
    email: {
      type: String,
      required: [true, "Email is required."],
      unique: true,
      validate: {
        validator: function (value: string) {
          return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
        },
        message: "Please enter a valid email address.",
      },
    },
    designation: {
      type: String,
      min: 25,
      max: 200,
      enum: ["admin", "manager", "pharmacist", "salesman"],
      default: "salesman",
      required: true,
    },
    address: {
      type: String,
      maxlength: [55, "Address must be at most 55 characters long."],
    },
    shift: {
      type: String,
      enum: ["Morning", "Afternoon", "Night"],
      default: "Morning",
    },
    salaryType: {
      type: String,
      enum: ["Hourly", "Weekly", "Monthly"],
      default: "Hourly",
      required: [true, "Salary type is required."],
    },
    hourlySalary: {
      type: Number,
      min: [0, "Weekly salary cannot be negative."],
    },
    weeklySalary: {
      type: Number,
      min: [0, "Weekly salary cannot be negative."],
    },
    monthlySalary: {
      type: Number,
      min: [0, "Monthly salary cannot be negative."],
    },
    hoursPerDay: {
      type: Number,
      required: true,
      min: [1, "Hours per day must be at least 1 hour."],
      max: [24, "Hours per day cannot exceed 24 hours."],
    },
    daysPerWeek: {
      type: Number,
      required: true,
      min: [1, "Days per week must be at least 1 day."],
      max: [7, "Days per week cannot exceed 7 days."],
    },
    isUser: {
      type: Boolean,
    },
    isActive: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    versionKey: false,
    toJSON: { virtuals: true },
  }
);

// Pre-save hook to handle conditional validation
staffSchema.pre("save", function (next) {
  // Check if the salaryType is "Hourly" and ensure that hourlySalary is set
  if (this.salaryType === "Hourly" && this.hourlySalary == null) {
    return next(new Error("Hourly salary is required for Hourly salary type."));
  }

  // Check if the salaryType is "Weekly" and ensure that weeklySalary is set
  if (this.salaryType === "Weekly" && this.weeklySalary == null) {
    return next(new Error("Weekly salary is required for Weekly salary type."));
  }

  // Check if the salaryType is "Monthly" and ensure that monthlySalary is set
  if (this.salaryType === "Monthly" && this.monthlySalary == null) {
    return next(
      new Error("Monthly salary is required for Monthly salary type.")
    );
  }

  next();
});

export default mongoose.model("staff", staffSchema);
