import mongoose, { Document, Schema } from "mongoose";

export interface IRefillReminder extends Document {
  prescription: Schema.Types.ObjectId;
  customer: Schema.Types.ObjectId;
  drug: Schema.Types.ObjectId;
  currentQuantity: number;
  reminderDate: Date;
  status: 'PENDING' | 'SENT' | 'CANCELLED';
  sentAt?: Date;
  createdBy: Schema.Types.ObjectId;
  updatedBy?: Schema.Types.ObjectId;
}

const refillReminderSchema = new Schema<IRefillReminder>({
  prescription: { type: Schema.Types.ObjectId, ref: 'Prescription', required: true },
  customer: { type: Schema.Types.ObjectId, ref: 'Customer', required: true },
  drug: { type: Schema.Types.ObjectId, ref: 'Drug', required: true },
  currentQuantity: { type: Number, required: true, min: 0 },
  reminderDate: { type: Date, required: true },
  status: { 
    type: String, 
    enum: ['PENDING', 'SENT', 'CANCELLED'],
    default: 'PENDING'
  },
  sentAt: { type: Date },
  createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  updatedBy: { type: Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

export default mongoose.model<IRefillReminder>('RefillReminder', refillReminderSchema);
