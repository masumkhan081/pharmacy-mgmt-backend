import { Types } from "mongoose";
import { Prisma } from "@prisma/client";

// ─── Direction ────────────────────────────────────────────────────────────────

export type MovementDirection = "OUT" | "IN";

// ─── Single batch allocation record ─────────────────────────────────────────

/**
 * Describes how much stock was taken from (or added to) one specific batch.
 * Returned in every movement receipt so callers can store traceability data.
 */
export interface BatchAllocation {
  batchId: Types.ObjectId | string;
  batchNumber: string;
  expirationDate: Date;
  quantityMoved: number;
  purchasePrice: number;
  sellingPrice: number;
}

// ─── Receipt returned after every successful movement ────────────────────────

/**
 * Immutable record of what happened during a movement operation.
 * Callers (sale, purchase, return approval) must persist this in their own
 * document so full traceability is available without re-querying batches.
 */
export interface MovementReceipt {
  drugId: Types.ObjectId | string;
  direction: MovementDirection;
  requestedQty: number;
  totalMoved: number;
  allocations: BatchAllocation[];
  /** Updated drug.available value after the movement. */
  newDrugAvailable: number;
}

// ─── deductStock input ────────────────────────────────────────────────────────

export interface DeductStockInput {
  drugId: Types.ObjectId | string;
  quantity: number;
  /** Optional Prisma transaction client. */
  tx?: Prisma.TransactionClient;
}

// ─── receiveStock input ───────────────────────────────────────────────────────

export interface ReceiveStockInput {
  drugId: Types.ObjectId | string;
  batchId: Types.ObjectId | string;
  quantity: number;
  tx?: Prisma.TransactionClient;
}

// ─── restoreStock input (used only by approveReturn) ─────────────────────────

export interface RestoreStockInput {
  drugId: Types.ObjectId | string;
  batchId: Types.ObjectId | string;
  quantity: number;
  tx?: Prisma.TransactionClient;
}

// ─── adjustStock input (used only by manual adjustments) ───────────────────────

export interface AdjustStockInput {
  drugId: Types.ObjectId | string;
  batchId: Types.ObjectId | string;
  quantity: number; // Positive = add, Negative = subtract
  tx?: Prisma.TransactionClient;
}

