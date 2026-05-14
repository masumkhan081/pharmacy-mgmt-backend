import inventoryAdjustmentRepository from "../repositories/inventoryAdjustment.repository";
import prisma from "../lib/prisma";
import { AdjustmentType } from "@prisma/client";
import inventoryMovementService from "./inventoryMovement.service";
import { createAuditLog } from "../utils/auditLog";
import getSearchAndPagination from "../utils/queryHandler";
import { logOperationalFailure } from "../utils/logger";
import { entities } from "../config/constants";
import { IDType, QueryParams } from "../types/requestResponse";

export interface ICreateAdjustmentPayload {
  drug: string;
  batch: string;
  adjustmentType: AdjustmentType;
  quantity: number;
  reason: string;
  notes?: string;
  actor: string;
}

const createAdjustment = async (data: ICreateAdjustmentPayload) => {
  // Enforce adjustmentType ↔ quantity sign consistency. The inventory movement
  // pipeline treats `quantity` as signed (+ adds, − removes); the recorded type
  // must match that direction so reads of historical adjustments are truthful.
  if (data.adjustmentType === AdjustmentType.ADDITION && data.quantity <= 0) {
    throw new Error("ADDITION adjustments require a positive quantity");
  }
  if (data.adjustmentType === AdjustmentType.DEDUCTION && data.quantity >= 0) {
    throw new Error("DEDUCTION adjustments require a negative quantity");
  }

  return await prisma.$transaction(async (tx) => {
    try {
      // 1. Mutate inventory via authoritative service
      const movementReceipt = await inventoryMovementService.adjustStock({
        drugId: data.drug,
        batchId: data.batch,
        quantity: data.quantity,
        tx,
      });

      // 2. Create adjustment record in Prisma
      const savedAdjustment = await inventoryAdjustmentRepository.create({
        adjustmentType: data.adjustmentType as AdjustmentType,
        drugId: data.drug,
        batchId: data.batch,
        quantity: data.quantity,
        reason: data.reason,
        notes: data.notes,
        actorId: data.actor,
      }, tx);

      // 3. Create Audit Log — on the same tx so rollback removes it too.
      await createAuditLog({
        actor: data.actor,
        action: "STOCK_ADJUSTMENT",
        entityType: "InventoryAdjustment",
        entityId: savedAdjustment.id as any,
        after: {
          ...savedAdjustment,
          movement: movementReceipt,
        } as any,
        tx,
      });

      return savedAdjustment;
    } catch (error) {
      logOperationalFailure("ADJUSTMENT", error, { data });
      throw error;
    }
  });
};

const getAdjustments = async (query: QueryParams) => {
  try {
    const {
      viewSkip,
      viewLimit,
      currentPage,
      sortBy,
      sortOrder,
    } = getSearchAndPagination({ query, entity: "inventoryAdjustment" }); 

    const result = await inventoryAdjustmentRepository.search({
      skip: viewSkip,
      take: viewLimit,
      sortBy: sortBy as string,
      sortOrder: sortOrder as any,
    });

    return {
      meta: { total: result.total, limit: viewLimit, page: currentPage, skip: viewSkip, sortBy, sortOrder },
      data: result.data,
    };
  } catch (error) {
    return error;
  }
};

const getSingleAdjustment = async (id: IDType) => {
  return await inventoryAdjustmentRepository.findById(id as string);
};

export default {
  createAdjustment,
  getAdjustments,
  getSingleAdjustment,
};
