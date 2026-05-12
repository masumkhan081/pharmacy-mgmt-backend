import returnRepository from "../repositories/return.repository";
import inventoryBatchRepository from "../repositories/inventoryBatch.repository";
import prisma from "../lib/prisma";
import { ReturnStatus, ReturnType } from "@prisma/client";
import { IDType, QueryParams } from "../types/requestResponse";
import { entities } from "../config/constants";
import getSearchAndPagination from "../utils/queryHandler";
import inventoryMovementService from "./inventoryMovement.service";
import type {
  ICreateReturnPayload,
  IApproveReturnPayload,
  IRejectReturnPayload,
} from "../types/return.type";
import { createAuditLog } from "../utils/auditLog";
import { logOperationalFailure } from "../utils/logger";

// ─── Read operations (no mutation) ────────────────────────────────────────────

const getSingleReturn = async (id: IDType) => returnRepository.findById(id as string);

const getReturns = async (query: QueryParams) => {
  try {
    const {
      currentPage,
      viewLimit,
      viewSkip,
      sortBy,
      sortOrder,
      searchTerm,
    } = getSearchAndPagination({ query, entity: entities.return });

    const result = await returnRepository.search({
      searchTerm,
      skip: viewSkip,
      take: viewLimit,
      sortBy: sortBy as string,
      sortOrder: sortOrder as any,
    });

    return {
      meta: { 
        total: result.total, 
        limit: viewLimit, 
        page: currentPage, 
        skip: viewSkip, 
        sortBy, 
        sortOrder 
      },
      data: result.data,
    };
  } catch (error) {
    return error;
  }
};

const getReturnsByStatus = async (status: string, query: QueryParams) => {
  try {
    const {
      currentPage,
      viewLimit,
      viewSkip,
      sortBy,
      sortOrder,
      searchTerm,
    } = getSearchAndPagination({
      query,
      entity: entities.return,
    });

    const result = await returnRepository.search({
      status: status as ReturnStatus,
      searchTerm,
      skip: viewSkip,
      take: viewLimit,
      sortBy: sortBy as string,
      sortOrder: sortOrder as any,
    });

    return {
      meta: { 
        total: result.total, 
        limit: viewLimit, 
        page: currentPage, 
        skip: viewSkip, 
        sortBy, 
        sortOrder 
      },
      data: result.data,
    };
  } catch (error) {
    return error;
  }
};

// ─── createReturn ─────────────────────────────────────────────────────────────

/**
 * Creates a return REQUEST with status = PENDING.
 *
 * NO inventory is touched here.
 * NO stock is restored here.
 *
 * Validation enforced:
 *  - All items must have a batch reference
 *  - Batch must exist and belong to the stated drug
 *  - Quantity must be > 0
 *
 * Inventory restoration happens ONLY in approveReturn().
 */
const createReturn = async (data: ICreateReturnPayload) => {
  try {
    // Validate batches exist
    for (const item of data.items) {
      const batch = await inventoryBatchRepository.findById(item.batch.toString());
      if (!batch) {
        throw new Error(`Batch not found: ${item.batch}`);
      }
      if (batch.drugId !== item.drug.toString()) {
        throw new Error(`Batch ${item.batch} does not belong to drug ${item.drug}`);
      }
    }

    const savedReturn = await returnRepository.create({
      returnNumber: `RET-${Date.now()}`,
      returnType: (data.returnType as any) || ReturnType.CUSTOMER_RETURN,
      reason: data.items[0]?.reason || "No reason provided",
      processedById: data.processedBy as string,
      items: data.items.map(item => ({
        drugId: item.drug.toString(),
        batchId: item.batch.toString(),
        quantity: item.quantity,
        price: item.unitPrice,
      })),
    });

    if (data.processedBy) {
      await createAuditLog({
        actor: data.processedBy.toString(),
        action: "CREATE_RETURN",
        entityType: "Return",
        entityId: savedReturn.id,
        after: savedReturn as any,
      });
    }

    return savedReturn;
  } catch (error) {
    logOperationalFailure("INVENTORY", error, { data });
    throw error;
  }
};

// ─── approveReturn ────────────────────────────────────────────────────────────

/**
 * Approves a PENDING return and atomically restores inventory.
 *
 * ONLY this function may restore stock to inventory.
 * This separation prevents stock inflation from pending/unverified returns.
 *
 * Transaction flow:
 *  1. Fetch and lock the return
 *  2. Validate it is PENDING
 *  3. For CUSTOMER_RETURN: call restoreStock for each item's batch
 *  4. Mark return as APPROVED
 *  5. Commit — or roll back entirely on any failure
 */
const approveReturn = async ({ returnId, approvedBy }: IApproveReturnPayload) => {
  return await prisma.$transaction(async (tx) => {
    try {
      const returnRecord = await returnRepository.findById(returnId as string);
      if (!returnRecord) {
        throw new Error(`Return not found: ${returnId}`);
      }
      if (returnRecord.status !== ReturnStatus.PENDING) {
        throw new Error(`Return ${returnId} is not in PENDING state`);
      }

      if (returnRecord.returnType === ReturnType.CUSTOMER_RETURN) {
        for (const item of returnRecord.items) {
          await inventoryMovementService.restoreStock({
            drugId: item.drugId,
            batchId: item.batchId,
            quantity: item.quantity,
            tx,
          });
        }
      }

      const updated = await returnRepository.updateStatus(
        returnId as string,
        ReturnStatus.APPROVED,
        approvedBy as string,
        tx
      );

      await createAuditLog({
        actor: approvedBy.toString(),
        action: "APPROVE_RETURN",
        entityType: "Return",
        entityId: returnId as string,
        after: updated as any,
      });

      return updated;
    } catch (error) {
      logOperationalFailure("INVENTORY", error, { returnId });
      throw error;
    }
  });
};

// ─── rejectReturn ─────────────────────────────────────────────────────────────

/**
 * Rejects a PENDING return. No inventory is touched.
 */
const rejectReturn = async ({ returnId, rejectedBy }: IRejectReturnPayload) => {
  const returnRecord = await returnRepository.findById(returnId as string);
  if (!returnRecord) {
    throw new Error(`Return not found: ${returnId}`);
  }
  if (returnRecord.status !== ReturnStatus.PENDING) {
    throw new Error(`Return ${returnId} is not in PENDING state`);
  }

  const updated = await returnRepository.updateStatus(
    returnId as string,
    ReturnStatus.REJECTED,
    rejectedBy as string
  );

  await createAuditLog({
    actor: rejectedBy as string,
    action: "REJECT_RETURN",
    entityType: "Return",
    entityId: returnId as any,
    after: updated as any,
  });

  return updated;
};

// ─── deleteReturn ─────────────────────────────────────────────────────────────

/**
 * Hard delete — only allowed for PENDING returns.
 * Approved/completed returns must never be deleted (financial audit trail).
 */
const deleteReturn = async ({ id, actor }: { id: IDType; actor: string | undefined }) => {
  const returnRecord = await returnRepository.findById(id as string);
  if (!returnRecord) {
    throw new Error(`Return not found: ${id}`);
  }
  if (returnRecord.status !== ReturnStatus.PENDING) {
    throw new Error(`Cannot delete return ${id} with status ${returnRecord.status}.`);
  }
  if (returnRecord.isDeleted) return returnRecord;

  const beforeState = JSON.parse(JSON.stringify(returnRecord));

  const updated = await returnRepository.softDelete(id as string);

  if (actor) {
    await createAuditLog({
      actor,
      action: "SOFT_DELETE",
      entityType: "Return",
      entityId: id as any,
      before: beforeState,
    });
  }

  return updated;
};

// ─── Export ───────────────────────────────────────────────────────────────────

export default {
  createReturn,
  approveReturn,
  rejectReturn,
  getSingleReturn,
  getReturns,
  getReturnsByStatus,
  deleteReturn,
};
