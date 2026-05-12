import { Document, Types } from "mongoose";
import { IDType } from "./requestResponse";

export type ReturnType =
  | "CUSTOMER_RETURN"
  | "SUPPLIER_RETURN"
  | "DAMAGED_GOODS"
  | "EXPIRED_DRUGS";

export type ReturnStatus =
  | "PENDING"
  | "APPROVED"
  | "REJECTED"
  | "COMPLETED"
  | "CANCELLED";

export type ReturnReason =
  | "DAMAGED"
  | "EXPIRED"
  | "WRONG_ITEM"
  | "WRONG_QUANTITY"
  | "PATIENT_DECEASED"
  | "ADVERSE_REACTION"
  | "NOT_NEEDED"
  | "RECALL"
  | "QUALITY_ISSUE"
  | "OTHER";

export type ItemCondition = "NEW" | "OPENED" | "DAMAGED" | "EXPIRED";

export type RefundMethod =
  | "CASH"
  | "CREDIT_CARD_REVERSAL"
  | "STORE_CREDIT"
  | "REPLACEMENT"
  | "NONE";

// ─── Item in a return request ──────────────────────────────────────────────────
export interface IReturnItem {
  drug: Types.ObjectId | string;
  /**
   * The specific batch the item came from.
   * Required for CUSTOMER_RETURN so restoreStock knows which batch to replenish.
   */
  batch: Types.ObjectId | string;
  quantity: number;
  unitPrice: number;
  reason: ReturnReason;
  condition?: ItemCondition;
  notes?: string;
}

// ─── Payload for creating a return (always PENDING) ───────────────────────────
export interface ICreateReturnPayload {
  returnType: ReturnType;
  returnDate?: Date;
  customer?: Types.ObjectId | string;
  supplier?: Types.ObjectId | string;
  originalSale?: Types.ObjectId | string;
  originalPurchase?: Types.ObjectId | string;
  items: IReturnItem[];
  totalAmount: number;
  refundAmount?: number;
  refundMethod?: RefundMethod;
  processedBy: Types.ObjectId | string;
  notes?: string;
}

// ─── Payload for approving a return ───────────────────────────────────────────
export interface IApproveReturnPayload {
  returnId: IDType;
  approvedBy: Types.ObjectId | string;
}

// ─── Payload for rejecting a return ───────────────────────────────────────────
export interface IRejectReturnPayload {
  returnId: IDType;
  rejectedBy: Types.ObjectId | string;
  rejectionReason?: string;
}

// ─── Document interface ────────────────────────────────────────────────────────
export interface IReturn extends Document {
  returnNumber: string;
  returnType: ReturnType;
  returnDate: Date;
  customer?: Types.ObjectId;
  supplier?: Types.ObjectId;
  originalSale?: Types.ObjectId;
  originalPurchase?: Types.ObjectId;
  items: IReturnItem[];
  totalAmount: number;
  refundAmount?: number;
  refundMethod?: RefundMethod;
  refundDate?: Date;
  status: ReturnStatus;
  approvedBy?: Types.ObjectId;
  processedBy: Types.ObjectId;
  notes?: string;
}
