import { Prisma } from "@prisma/client";
import { MovementDirection, BatchAllocation, DeductStockInput, MovementReceipt, ReceiveStockInput, RestoreStockInput, AdjustStockInput } from "../types/inventoryMovement.type";
import inventoryBatchRepository from "../repositories/inventoryBatch.repository";
import prisma from "../lib/prisma";
import drugRepository from "../repositories/drug.repository";

// ─── Internal helpers ─────────────────────────────────────────────────────────

/**
 * Atomically recalculates drug.available by summing currentQuantity across
 * all non-expired, active batches for the drug, then writes it in a single
 * findByIdAndUpdate call — no read-modify-write race.
 *
 * This is the ONLY place that may update drug.available.
 * No model hook, controller, or other service may touch this field.
 */
async function syncDrugAvailable(
  drugId: string,
): Promise<number> {
  const newAvailable = await inventoryBatchRepository.sumAvailableStock(drugId);
  
  // Update the Drug cache in Prisma
  await drugRepository.updateAvailability(drugId, newAvailable);

  return newAvailable;
}

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * Deducts `quantity` units for `drugId` using FIFO batch selection.
 *
 * FIFO order: batches sorted by expirationDate ASC (nearest expiry first).
 *
 * Safety guarantees:
 *  - Expired batches are never selected (expirationDate <= now is skipped).
 *  - Inactive batches (isActive = false) are never selected.
 *  - If total available stock across all eligible batches < quantity, throws
 *    before mutating anything.
 *  - All batch writes happen inside the caller-provided transaction.
 *  - drug.available is updated atomically after all batch writes succeed.
 *
 * Throws if:
 *  - quantity <= 0
 *  - drugId does not exist
 *  - insufficient non-expired stock
 *
 * @returns MovementReceipt — callers must store allocations in their own doc.
 */
async function deductStock({
  drugId,
  quantity,
  tx,
}: DeductStockInput): Promise<MovementReceipt> {
  if (quantity <= 0) {
    throw new Error("Deduction quantity must be greater than 0");
  }

  const drug = await drugRepository.findById(drugId.toString());
  if (!drug) {
    throw new Error(`Drug not found: ${drugId}`);
  }

  const runDeduction = async (txClient: Prisma.TransactionClient) => {
    const eligibleBatches = await inventoryBatchRepository.findFIFO(drugId.toString(), txClient);

    const totalAvailable = eligibleBatches.reduce((sum, b) => sum + b.currentQuantity, 0);

    if (totalAvailable < quantity) {
      throw new Error(
        `Insufficient stock for drug "${drug.name}". ` +
        `Requested: ${quantity}, available (non-expired): ${totalAvailable}`
      );
    }

    let remaining = quantity;
    const allocations: BatchAllocation[] = [];

    for (const batch of eligibleBatches) {
      if (remaining <= 0) break;

      const take = Math.min(batch.currentQuantity, remaining);
      const newQty = batch.currentQuantity - take;
      remaining -= take;

      // Update batch in Prisma
      await inventoryBatchRepository.update(batch.id, {
        currentQuantity: newQty,
        status: newQty === 0 ? "OUT_OF_STOCK" : undefined,
      }, txClient);

      allocations.push({
        batchId: batch.id,
        batchNumber: batch.batchNumber,
        expirationDate: batch.expirationDate,
        quantityMoved: take,
        purchasePrice: batch.purchasePrice,
        sellingPrice: batch.sellingPrice,
      });
    }

    // Update the denormalized cache
    const newDrugAvailable = await inventoryBatchRepository.sumAvailableStock(drugId.toString(), txClient);
    await drugRepository.updateAvailability(drugId.toString(), newDrugAvailable, txClient);

    return {
      drugId: drugId.toString(),
      direction: "OUT" as MovementDirection,
      requestedQty: quantity,
      totalMoved: quantity,
      allocations,
      newDrugAvailable,
    };
  };

  if (tx) return await runDeduction(tx);
  return await prisma.$transaction(runDeduction);
}

/**
 * Receives `quantity` units into a specific, already-created batch record.
 *
 * Used by the purchase flow after `InventoryBatch` has been created.
 * Increments `batch.currentQuantity` and syncs `drug.available`.
 *
 * All writes happen inside the caller-provided transaction.
 *
 * Throws if:
 *  - quantity <= 0
 *  - batchId does not exist
 *  - drugId does not match the batch's drug reference
 *
 * @returns MovementReceipt with a single allocation entry.
 */
async function receiveStock({
  drugId,
  batchId,
  quantity,
  tx,
}: ReceiveStockInput): Promise<MovementReceipt> {
  if (quantity <= 0) {
    throw new Error("Receive quantity must be greater than 0");
  }

  const runReceive = async (txClient: Prisma.TransactionClient) => {
    const batch = await inventoryBatchRepository.findById(batchId.toString(), txClient);
    if (!batch) {
      throw new Error(`InventoryBatch not found: ${batchId}`);
    }

    if (batch.drugId !== drugId.toString()) {
      throw new Error(`Batch ${batchId} does not belong to drug ${drugId}`);
    }

    const newQty = batch.currentQuantity + quantity;
    await inventoryBatchRepository.update(batch.id, {
      currentQuantity: newQty,
      status: newQty > 0 ? "AVAILABLE" : undefined,
    }, txClient);

    const newDrugAvailable = await inventoryBatchRepository.sumAvailableStock(drugId.toString(), txClient);
    await drugRepository.updateAvailability(drugId.toString(), newDrugAvailable, txClient);

    return {
      drugId: drugId.toString(),
      direction: "IN" as MovementDirection,
      requestedQty: quantity,
      totalMoved: quantity,
      allocations: [
        {
          batchId: batch.id,
          batchNumber: batch.batchNumber,
          expirationDate: batch.expirationDate,
          quantityMoved: quantity,
          purchasePrice: batch.purchasePrice,
          sellingPrice: batch.sellingPrice,
        },
      ],
      newDrugAvailable,
    };
  };

  if (tx) return await runReceive(tx);
  return await prisma.$transaction(runReceive);
}

/**
 * Restores `quantity` units back to a specific batch.
 *
 * Used ONLY by the return APPROVAL flow — never on return creation.
 * This prevents stock inflation from unverified/pending returns.
 *
 * All writes happen inside the caller-provided transaction.
 *
 * Throws if:
 *  - quantity <= 0
 *  - batchId does not exist
 *  - drugId does not match the batch
 *
 * @returns MovementReceipt with a single allocation entry.
 */
async function restoreStock({
  drugId,
  batchId,
  quantity,
  tx,
}: RestoreStockInput): Promise<MovementReceipt> {
  if (quantity <= 0) {
    throw new Error("Restore quantity must be greater than 0");
  }

  const runRestore = async (txClient: Prisma.TransactionClient) => {
    const batch = await inventoryBatchRepository.findById(batchId.toString(), txClient);
    if (!batch) {
      throw new Error(`InventoryBatch not found: ${batchId}`);
    }

    if (batch.drugId !== drugId.toString()) {
      throw new Error(`Batch ${batchId} does not belong to drug ${drugId}`);
    }

    const newQty = batch.currentQuantity + quantity;
    await inventoryBatchRepository.update(batch.id, {
      currentQuantity: newQty,
      status: "AVAILABLE",
    }, txClient);

    const newDrugAvailable = await inventoryBatchRepository.sumAvailableStock(drugId.toString(), txClient);
    await drugRepository.updateAvailability(drugId.toString(), newDrugAvailable, txClient);

    return {
      drugId: drugId.toString(),
      direction: "IN" as MovementDirection,
      requestedQty: quantity,
      totalMoved: quantity,
      allocations: [
        {
          batchId: batch.id,
          batchNumber: batch.batchNumber,
          expirationDate: batch.expirationDate,
          quantityMoved: quantity,
          purchasePrice: batch.purchasePrice,
          sellingPrice: batch.sellingPrice,
        },
      ],
      newDrugAvailable,
    };
  };

  if (tx) return await runRestore(tx);
  return await prisma.$transaction(runRestore);
}

/**
 * Adjusts `quantity` units for a specific batch.
 * Supports both additions (positive) and deductions (negative).
 *
 * Safety guarantees:
 *  - Prevents negative inventory (currentQuantity + quantity >= 0).
 *  - Validates batch ownership.
 *  - Updates drug.available cache.
 *
 * Throws if:
 *  - adjustment results in negative batch quantity
 *  - batchId does not exist
 *  - drugId does not match batch
 */
async function adjustStock({
  drugId,
  batchId,
  quantity,
  tx,
}: AdjustStockInput): Promise<MovementReceipt> {
  const runAdjust = async (txClient: Prisma.TransactionClient) => {
    const batch = await inventoryBatchRepository.findById(batchId.toString(), txClient);
    if (!batch) {
      throw new Error(`InventoryBatch not found: ${batchId}`);
    }

    if (batch.drugId !== drugId.toString()) {
      throw new Error(`Batch ${batchId} does not belong to drug ${drugId}`);
    }

    if (batch.currentQuantity + quantity < 0) {
      throw new Error(
        `Insufficient stock in batch ${batch.batchNumber}. ` +
        `Current: ${batch.currentQuantity}, Adjustment: ${quantity}`
      );
    }

    const newQty = batch.currentQuantity + quantity;
    await inventoryBatchRepository.update(batch.id, {
      currentQuantity: newQty,
      status: newQty === 0 ? "OUT_OF_STOCK" : "AVAILABLE",
    }, txClient);

    const newDrugAvailable = await inventoryBatchRepository.sumAvailableStock(drugId.toString(), txClient);
    await drugRepository.updateAvailability(drugId.toString(), newDrugAvailable, txClient);

    return {
      drugId: drugId.toString(),
      direction: (quantity >= 0 ? "IN" : "OUT") as MovementDirection,
      requestedQty: Math.abs(quantity),
      totalMoved: Math.abs(quantity),
      allocations: [
        {
          batchId: batch.id,
          batchNumber: batch.batchNumber,
          expirationDate: batch.expirationDate,
          quantityMoved: Math.abs(quantity),
          purchasePrice: batch.purchasePrice,
          sellingPrice: batch.sellingPrice,
        },
      ],
      newDrugAvailable,
    };
  };

  if (tx) return await runAdjust(tx);
  return await prisma.$transaction(runAdjust);
}


// ─── Exported service ─────────────────────────────────────────────────────────

/**
 * InventoryMovementService
 *
 * The SINGLE authoritative pipeline for all inventory stock mutations.
 * No other service, model hook, or controller may mutate:
 *   - InventoryBatch.currentQuantity
 *   - Drug.available
 *
 * Methods optionally accept a Prisma TransactionClient (`tx`). When the
 * caller is already inside `prisma.$transaction`, pass `tx` so batch + drug
 * writes are part of the same atomic unit. When called standalone, the
 * service opens its own short-lived transaction.
 *
 * Methods:
 *   deductStock   — FIFO deduction (sales)
 *   receiveStock  — increment a batch (purchases)
 *   restoreStock  — restore to a batch (return approvals only)
 *   adjustStock   — signed delta on a specific batch (admin adjustments)
 */
const inventoryMovementService = {
  deductStock,
  receiveStock,
  restoreStock,
  adjustStock,
};

export default inventoryMovementService;
