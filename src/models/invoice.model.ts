import mongoose, { Schema } from "mongoose";

const invoiceSchema = new Schema(
  {
    invoiceNumber: {
      type: String,
      required: [true, "Invoice number is required"],
      unique: true,
    },
    customer: {
      type: Schema.Types.ObjectId,
      ref: "customers",
      required: [true, "Customer reference is required"],
    },
    sale: {
      type: Schema.Types.ObjectId,
      ref: "sales",
    },
    prescription: {
      type: Schema.Types.ObjectId,
      ref: "prescriptions",
    },
    issueDate: {
      type: Date,
      required: [true, "Issue date is required"],
      default: Date.now,
    },
    dueDate: {
      type: Date,
      required: [true, "Due date is required"],
      validate: {
        validator: function(this: any, value: Date) {
          return value >= this.issueDate;
        },
        message: "Due date must be on or after issue date",
      },
    },
    items: [
      {
        name: {
          type: String,
          required: [true, "Item name is required"],
        },
        description: String,
        quantity: {
          type: Number,
          required: [true, "Quantity is required"],
          min: [1, "Quantity must be at least 1"],
        },
        unitPrice: {
          type: Number,
          required: [true, "Unit price is required"],
          min: [0, "Unit price cannot be negative"],
        },
        discount: {
          type: Number,
          default: 0,
          min: [0, "Discount cannot be negative"],
        },
        tax: {
          type: Number,
          default: 0,
          min: [0, "Tax cannot be negative"],
        },
        totalPrice: {
          type: Number,
          required: [true, "Total price is required"],
          min: [0, "Total price cannot be negative"],
        },
      },
    ],
    subtotal: {
      type: Number,
      required: [true, "Subtotal is required"],
      min: [0, "Subtotal cannot be negative"],
    },
    taxTotal: {
      type: Number,
      required: [true, "Tax total is required"],
      min: [0, "Tax total cannot be negative"],
    },
    discountTotal: {
      type: Number,
      required: [true, "Discount total is required"],
      min: [0, "Discount total cannot be negative"],
    },
    grandTotal: {
      type: Number,
      required: [true, "Grand total is required"],
      min: [0, "Grand total cannot be negative"],
    },
    amountPaid: {
      type: Number,
      default: 0,
      min: [0, "Amount paid cannot be negative"],
    },
    status: {
      type: String,
      enum: {
        values: ["DRAFT", "ISSUED", "PARTIALLY_PAID", "PAID", "OVERDUE", "CANCELLED", "REFUNDED"],
        message: "Status must be one of the predefined values",
      },
      default: "DRAFT",
    },
    notes: String,
    paymentTerms: String,
  },
  {
    timestamps: true,
    versionKey: false,
    toJSON: { virtuals: true },
  }
);

// Virtual for balance due
invoiceSchema.virtual('balanceDue').get(function() {
  return this.grandTotal - this.amountPaid;
});

// Virtual for invoice age in days
invoiceSchema.virtual('ageInDays').get(function() {
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - this.issueDate.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
});

// Virtual for overdue status
invoiceSchema.virtual('isOverdue').get(function() {
  const now = new Date();
  return this.status !== 'PAID' && this.status !== 'CANCELLED' && 
         this.status !== 'REFUNDED' && now > this.dueDate;
});

export default mongoose.model("invoices", invoiceSchema);
