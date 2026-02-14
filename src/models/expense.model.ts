import mongoose, { Schema } from "mongoose";

const expenseSchema = new Schema(
  {
    expenseNumber: {
      type: String,
      required: [true, "Expense number is required"],
      unique: true,
    },
    category: {
      type: String,
      required: [true, "Expense category is required"],
      enum: {
        values: [
          "RENT", "UTILITIES", "SALARIES", "MAINTENANCE", "OFFICE_SUPPLIES",
          "EQUIPMENT", "MARKETING", "INSURANCE", "TAXES", "LICENSES",
          "PROFESSIONAL_FEES", "TRAVEL", "TRAINING", "SOFTWARE", "OTHER"
        ],
        message: "Category must be one of the predefined values",
      },
    },
    subcategory: String,
    description: {
      type: String,
      required: [true, "Description is required"],
    },
    amount: {
      type: Number,
      required: [true, "Amount is required"],
      min: [0.01, "Amount must be at least 0.01"],
    },
    taxAmount: {
      type: Number,
      default: 0,
      min: [0, "Tax amount cannot be negative"],
    },
    paymentMethod: {
      type: String,
      required: [true, "Payment method is required"],
      enum: {
        values: ["CASH", "CREDIT_CARD", "DEBIT_CARD", "BANK_TRANSFER", "CHECK", "MOBILE_BANKING", "OTHER"],
        message: "Payment method must be one of the predefined values",
      },
    },
    paymentReference: String, // e.g., check number, transaction ID
    expenseDate: {
      type: Date,
      required: [true, "Expense date is required"],
      default: Date.now,
    },
    paidTo: {
      name: {
        type: String,
        required: [true, "Vendor/recipient name is required"],
      },
      contactNumber: String,
      email: String,
    },
    receiptImage: String, // URL to stored receipt image
    approvalStatus: {
      type: String,
      enum: {
        values: ["PENDING", "APPROVED", "REJECTED"],
        message: "Approval status must be one of the predefined values",
      },
      default: "PENDING",
    },
    approvedBy: {
      type: Schema.Types.ObjectId,
      ref: "staff",
    },
    approvalDate: Date,
    recurrent: {
      type: Boolean,
      default: false,
    },
    recurrencePattern: {
      frequency: {
        type: String,
        enum: ["DAILY", "WEEKLY", "MONTHLY", "QUARTERLY", "ANNUALLY"],
      },
      nextDueDate: Date,
    },
    notes: String,
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "staff",
      required: [true, "Staff reference who created the expense is required"],
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Pre-save middleware to generate expense number
expenseSchema.pre("save", async function (next) {
  if (!this.expenseNumber) {
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    
    // Find the latest expense number for this month/year
    const latestExpense = await mongoose.model("expenses").findOne(
      { expenseNumber: new RegExp(`^EXP-${year}${month}-`) },
      { expenseNumber: 1 },
      { sort: { expenseNumber: -1 } }
    );

    let counter = 1;
    if (latestExpense && latestExpense.expenseNumber) {
      const parts = latestExpense.expenseNumber.split("-");
      if (parts.length === 3) {
        counter = parseInt(parts[2]) + 1;
      }
    }

    this.expenseNumber = `EXP-${year}${month}-${counter.toString().padStart(4, "0")}`;
  }
  
  // Set approval date if expense is approved
  if (this.isModified('approvalStatus') && this.approvalStatus === 'APPROVED' && !this.approvalDate) {
    this.approvalDate = new Date();
  }
  
  next();
});

export default mongoose.model("expenses", expenseSchema);
