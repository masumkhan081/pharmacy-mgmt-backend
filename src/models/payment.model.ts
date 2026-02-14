import mongoose, { Schema, Document, Types } from "mongoose";

// Interface for Refund subdocument
interface IRefund {
  amount: number;
  reason?: string;
  processedBy: Types.ObjectId;
  processedAt: Date;
  notes?: string;
}

// Main Payment Interface
export interface IPayment extends Document {
  invoice?: Types.ObjectId;
  amount: number;
  paymentDate: Date;
  paymentMethod: 'CASH' | 'CREDIT_CARD' | 'DEBIT_CARD' | 'MOBILE_BANKING' | 'BANK_TRANSFER' | 'INSURANCE' | 'OTHER';
  cardDetails?: {
    cardType?: string;
    lastFourDigits?: string;
    cardHolderName?: string;
    transactionId?: string;
  };
  mobilePaymentDetails?: {
    provider?: string;
    phoneNumber?: string;
    transactionId?: string;
  };
  bankTransferDetails?: {
    bankName?: string;
    accountNumber?: string;
    transactionId?: string;
  };
  receiptNumber?: string;
  status: 'PENDING' | 'COMPLETED' | 'FAILED' | 'REFUNDED' | 'PARTIALLY_REFUNDED';
  refundedAmount: number;
  refunds: IRefund[];
  processedBy: Types.ObjectId;
  createdBy: Types.ObjectId;
  updatedBy: Types.ObjectId;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Schema definition
const paymentSchema = new Schema<IPayment>(
  {
    invoice: {
      type: Schema.Types.ObjectId,
      ref: "invoices",
    },
    amount: {
      type: Number,
      required: [true, "Payment amount is required"],
      min: [0.01, "Payment amount must be at least 0.01"],
    },
    paymentDate: {
      type: Date,
      required: [true, "Payment date is required"],
      default: Date.now,
    },
    paymentMethod: {
      type: String,
      required: [true, "Payment method is required"],
      enum: {
        values: ["CASH", "CREDIT_CARD", "DEBIT_CARD", "MOBILE_BANKING", "BANK_TRANSFER", "INSURANCE", "OTHER"],
        message: "Payment method must be one of the predefined values",
      },
    },
    cardDetails: {
      cardType: String, // Visa, Mastercard, etc.
      lastFourDigits: String,
      cardHolderName: String,
      transactionId: String,
    },
    mobilePaymentDetails: {
      provider: String, // e.g., bKash, Nagad, etc.
      phoneNumber: String,
      transactionId: String,
    },
    bankTransferDetails: {
      bankName: String,
      accountNumber: String,
      transactionId: String,
    },
    receiptNumber: {
      type: String,
      unique: true,
    },
    status: {
      type: String,
      enum: {
        values: ["PENDING", "COMPLETED", "FAILED", "REFUNDED", "PARTIALLY_REFUNDED"],
        message: "Status must be one of 'PENDING', 'COMPLETED', 'FAILED', 'REFUNDED', or 'PARTIALLY_REFUNDED'",
      },
      default: "PENDING",
    },
    refundedAmount: {
      type: Number,
      default: 0,
      min: [0, "Refunded amount cannot be negative"]
    },
    refunds: [{
      amount: {
        type: Number,
        required: [true, "Refund amount is required"],
        min: [0.01, "Refund amount must be at least 0.01"]
      },
      reason: String,
      processedBy: {
        type: Schema.Types.ObjectId,
        ref: "users",
        required: true
      },
      processedAt: {
        type: Date,
        default: Date.now
      },
      notes: String
    }],
    processedBy: {
      type: Schema.Types.ObjectId,
      ref: "staff",
      required: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "users",
      required: true
    },
    updatedBy: {
      type: Schema.Types.ObjectId,
      ref: "users",
      required: true
    },
    notes: String,
  },
  {
    timestamps: true,
    versionKey: false,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Add virtuals or methods here if needed

// Pre-save middleware to generate receipt number
paymentSchema.pre("save", async function (next) {
  if (!this.receiptNumber) {
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    
    // Find the latest receipt number for today
    const latestPayment = await mongoose.model("payments").findOne(
      {},
      { receiptNumber: 1 },
      { sort: { receiptNumber: -1 } }
    );

    let counter = 1;
    if (latestPayment && latestPayment.receiptNumber) {
      const lastReceiptNumber = latestPayment.receiptNumber;
      if (lastReceiptNumber.startsWith(`RCT-${year}${month}${day}-`)) {
        counter = parseInt(lastReceiptNumber.split("-")[2]) + 1;
      }
    }

    this.receiptNumber = `RCT-${year}${month}${day}-${counter.toString().padStart(4, "0")}`;
  }
  next();
});

// If payment is for an invoice, update the invoice's amount paid
paymentSchema.post("save", async function () {
  if (this.invoice && this.status === "COMPLETED") {
    const invoice = await mongoose.model("invoices").findById(this.invoice);
    if (invoice) {
      invoice.amountPaid += this.amount;
      
      // Update invoice status based on payment
      if (invoice.amountPaid >= invoice.grandTotal) {
        invoice.status = "PAID";
      } else if (invoice.amountPaid > 0) {
        invoice.status = "PARTIALLY_PAID";
      }
      
      await invoice.save();
    }
  }
});

// Create and export the model
const Payment = mongoose.model<IPayment>('Payment', paymentSchema);

export default Payment;
