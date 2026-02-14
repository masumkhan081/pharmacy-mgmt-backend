import mongoose, { Document, Schema, Types } from "mongoose";

export interface INotificationRecipient {
  recipientType: "STAFF" | "CUSTOMER" | "SUPPLIER" | "DOCTOR" | "ADMIN" | "SYSTEM";
  recipientId: Types.ObjectId;
  _id?: Types.ObjectId;
}

export interface IRecurringPattern {
  frequency?: "DAILY" | "WEEKLY" | "MONTHLY" | "QUARTERLY" | "ANNUALLY";
  interval?: number;
  endAfter?: number;
  endDate?: Date;
  _id?: Types.ObjectId;
}

export interface IAction {
  type: "LINK" | "BUTTON" | "FORM" | "NONE";
  label?: string;
  url?: string;
  _id?: Types.ObjectId;
}

export interface INotification extends Document {
  type: 
    | "INVENTORY_ALERT" 
    | "EXPIRY_ALERT" 
    | "REFILL_REMINDER" 
    | "PRESCRIPTION_EXPIRY" 
    | "PAYMENT_DUE" 
    | "SYSTEM_ALERT"
    | "CUSTOMER_BIRTHDAY" 
    | "ORDER_STATUS" 
    | "NEW_CUSTOMER"
    | "REGULATORY_REMINDER" 
    | "STAFF_REMINDER" 
    | "CUSTOM";
  title: string;
  message: string;
  priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
  status: "PENDING" | "SENT" | "DELIVERED" | "READ" | "FAILED" | "CANCELLED";
  recipients: INotificationRecipient[];
  scheduledFor: Date;
  expiresAt?: Date;
  isRecurring: boolean;
  recurringPattern?: IRecurringPattern;
  createdBy: Types.ObjectId;
  metadata?: Record<string, unknown>;
  action: IAction;
  createdAt: Date;
  updatedAt: Date;
}

const notificationSchema = new Schema<INotification>(
  {
    type: {
      type: String,
      required: [true, "Notification type is required"],
      enum: {
        values: [
          "INVENTORY_ALERT", "EXPIRY_ALERT", "REFILL_REMINDER", 
          "PRESCRIPTION_EXPIRY", "PAYMENT_DUE", "SYSTEM_ALERT",
          "CUSTOMER_BIRTHDAY", "ORDER_STATUS", "NEW_CUSTOMER",
          "REGULATORY_REMINDER", "STAFF_REMINDER", "CUSTOM"
        ],
        message: "Type must be one of the predefined values",
      },
    },
    title: {
      type: String,
      required: [true, "Title is required"],
    },
    message: {
      type: String,
      required: [true, "Message is required"],
    },
    priority: {
      type: String,
      enum: {
        values: ["LOW", "MEDIUM", "HIGH", "URGENT"],
        message: "Priority must be one of the predefined values",
      },
      default: "MEDIUM",
    },
    status: {
      type: String,
      enum: {
        values: ["PENDING", "SENT", "DELIVERED", "READ", "FAILED", "CANCELLED"],
        message: "Status must be one of the predefined values",
      },
      default: "PENDING",
    },
    recipients: [{
      recipientType: {
        type: String,
        enum: {
          values: ["STAFF", "CUSTOMER", "SUPPLIER", "DOCTOR", "ADMIN", "SYSTEM"],
          message: "Recipient type must be one of the predefined values",
        },
        required: [true, "Recipient type is required"],
      },
      recipientId: {
        type: Schema.Types.ObjectId,
        required: [true, "Recipient ID is required"],
      },
    }],
    scheduledFor: {
      type: Date,
      default: Date.now,
    },
    expiresAt: {
      type: Date,
    },
    isRecurring: {
      type: Boolean,
      default: false,
    },
    recurringPattern: {
      frequency: {
        type: String,
        enum: ["DAILY", "WEEKLY", "MONTHLY", "QUARTERLY", "ANNUALLY"],
      },
      interval: {
        type: Number,
        min: [1, "Interval must be at least 1"],
      },
      endAfter: {
        type: Number,
      },
      endDate: {
        type: Date,
      },
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    metadata: {
      type: Schema.Types.Mixed,
    },
    action: {
      type: {
        type: String,
        enum: ["LINK", "BUTTON", "FORM", "NONE"],
        default: "NONE",
      },
      label: {
        type: String,
      },
      url: {
        type: String,
      },
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Create indexes for better query performance
notificationSchema.index({ scheduledFor: 1 });
notificationSchema.index({ "recipients.recipientId": 1 });
notificationSchema.index({ relatedEntityType: 1, relatedEntityId: 1 });

// Create a model for reminders specifically for medication refills
const refillReminderSchema = new Schema(
  {
    customer: {
      type: Schema.Types.ObjectId,
      ref: "customers",
      required: [true, "Customer reference is required"],
    },
    prescription: {
      type: Schema.Types.ObjectId,
      ref: "prescriptions",
    },
    drug: {
      type: Schema.Types.ObjectId,
      ref: "drugs",
      required: [true, "Drug reference is required"],
    },
    dueDate: {
      type: Date,
      required: [true, "Refill due date is required"],
    },
    daysSupply: {
      type: Number,
      required: [true, "Days supply is required"],
      min: [1, "Days supply must be at least 1"],
    },
    reminderDays: {
      type: Number,
      default: 3,
      description: "Days before due date to send the first reminder",
    },
    notificationsSent: [{
      type: Schema.Types.ObjectId,
      ref: "notifications",
    }],
    status: {
      type: String,
      enum: {
        values: ["SCHEDULED", "REMINDED", "COMPLETED", "CANCELLED"],
        message: "Status must be one of the predefined values",
      },
      default: "SCHEDULED",
    },
    notes: String,
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Export all schemas
export const Notification = mongoose.model<INotification>("notifications", notificationSchema);

export interface IRefillReminder extends Document {
  customer: Types.ObjectId;
  prescription?: Types.ObjectId;
  drug: Types.ObjectId;
  dueDate: Date;
  daysSupply: number;
  reminderDays: number;
  notificationsSent: Types.ObjectId[];
  status: "SCHEDULED" | "REMINDED" | "COMPLETED" | "CANCELLED";
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export const RefillReminder = mongoose.model<IRefillReminder>("refillReminders", refillReminderSchema);
