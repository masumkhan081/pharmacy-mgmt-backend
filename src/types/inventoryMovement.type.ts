import { Prisma } from "@prisma/client";
import { IDType } from "./requestResponse";

// ─── Direction ────────────────────────────────────────────────────────────────

export type MovementDirection = "OUT" | "IN";

// ─── Single batch allocation record ─────────────────────────────────────────

/**
 * Describes how much stock was taken from (or added to) one specific batch.
 * Returned in every movement receipt so callers can store traceability data.
 */
export interface BatchAllocation {
  batchId: IDType;
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
  drugId: IDType;
  direction: MovementDirection;
  requestedQty: number;
  totalMoved: number;
  allocations: BatchAllocation[];
  /** Updated drug.available value after the movement. */
  newDrugAvailable: number;
}

// ─── deductStock input ────────────────────────────────────────────────────────

export interface DeductStockInput {
  drugId: IDType;
  quantity: number;
  /** Optional Prisma transaction client. */
  tx?: Prisma.TransactionClient;
}

// ─── receiveStock input ───────────────────────────────────────────────────────

export interface ReceiveStockInput {
  drugId: IDType;
  batchId: IDType;
  quantity: number;
  tx?: Prisma.TransactionClient;
}

// ─── restoreStock input (used only by approveReturn) ─────────────────────────

export interface RestoreStockInput {
  drugId: IDType;
  batchId: IDType;
  quantity: number;
  tx?: Prisma.TransactionClient;
}

// ─── adjustStock input (used only by manual adjustments) ───────────────────────

export interface AdjustStockInput {
  drugId: IDType;
  batchId: IDType;
  quantity: number; // Positive = add, Negative = subtract
  tx?: Prisma.TransactionClient;
}

