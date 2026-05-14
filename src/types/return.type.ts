import { IDType } from "./requestResponse";

// Aligned to Prisma enums.
export type ReturnType = "CUSTOMER_RETURN" | "SUPPLIER_RETURN";

export type ReturnStatus = "PENDING" | "APPROVED" | "REJECTED";

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
  reason: string;
}

// ─── Payload for creating a return (always PENDING) ───────────────────────────
export interface ICreateReturnPayload {
  returnType: ReturnType;
  items: IReturnItem[];
  processedBy: IDType;
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
}
