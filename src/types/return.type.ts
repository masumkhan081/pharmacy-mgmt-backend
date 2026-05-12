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
  drug: IDType;
  /**
   * The specific batch the item came from.
   * Required for CUSTOMER_RETURN so restoreStock knows which batch to replenish.
   */
  batch: IDType;
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
  customer?: IDType;
  supplier?: IDType;
  originalSale?: IDType;
  originalPurchase?: IDType;
  items: IReturnItem[];
  totalAmount: number;
  refundAmount?: number;
  refundMethod?: RefundMethod;
  processedBy: IDType;
  notes?: string;
}

// ─── Payload for approving a return ───────────────────────────────────────────
export interface IApproveReturnPayload {
  returnId: IDType;
  approvedBy: IDType;
}

// ─── Payload for rejecting a return ───────────────────────────────────────────
export interface IRejectReturnPayload {
  returnId: IDType;
  rejectedBy: IDType;
  rejectionReason?: string;
}

// ─── Document interface ────────────────────────────────────────────────────────
export interface IReturn {
  returnNumber: string;
  returnType: ReturnType;
  returnDate: Date;
  customer?: IDType;
  supplier?: IDType;
  originalSale?: IDType;
  originalPurchase?: IDType;
  items: IReturnItem[];
  totalAmount: number;
  refundAmount?: number;
  refundMethod?: RefundMethod;
  refundDate?: Date;
  status: ReturnStatus;
  approvedBy?: IDType;
  processedBy: IDType;
  notes?: string;
}
