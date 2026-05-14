import { entities } from "../config/constants";
import { IDType, QueryParams } from "../types/requestResponse";
import { IPurchasePayload } from "../types/purchase.type";
import getSearchAndPagination from "../utils/queryHandler";
import inventoryBatchRepository from "../repositories/inventoryBatch.repository";
import inventoryMovementService from "./inventoryMovement.service";
import { createAuditLog } from "../utils/auditLog";
import purchaseRepository from "../repositories/purchase.repository";
import prisma from "../lib/prisma";

const getSinglePurchase = async (id: IDType) => purchaseRepository.findById(id as string);
// 
export const createPurchase = async (data: IPurchasePayload) => {
  return await prisma.$transaction(async (tx) => {
    try {
      const purchaseItems = [];
      const now = new Date();

      // Process each incoming drug line
      for (const item of data.drugs) {
        if (item.quantity <= 0) {
          throw new Error("Quantity must be positive");
        }

        const itemExpiration = new Date(item.expirationDate);
        if (itemExpiration <= now) {
          throw new Error(`Cannot purchase expired batch for drug: ${item.drug}`);
        }

        // 1. Check for duplicate batch (same drug + same batchNumber)
        let targetBatchId: string | null = null;
        
        const existingBatch = await inventoryBatchRepository.findByDrugAndBatchNumber(
          item.drug.toString(),
          item.batchNumber,
          tx
        );

        if (existingBatch) {
          // Enforce duplicate batch rules
          if (
            Math.abs(existingBatch.purchasePrice - item.purchasePrice) > 0.01 ||
            Math.abs(existingBatch.sellingPrice - item.mrp) > 0.01 ||
            existingBatch.expirationDate.getTime() !== itemExpiration.getTime()
          ) {
            throw new Error(`Batch ${item.batchNumber} already exists with different pricing or expiration.`);
          }
          targetBatchId = existingBatch.id;
        } else {
          // Create new batch explicitly inside the transaction with 0 currentQuantity
          const savedBatch = await inventoryBatchRepository.create({
            drugId: item.drug.toString(),
            batchNumber: item.batchNumber,
            initialQuantity: item.quantity,
            currentQuantity: 0, 
            purchasePrice: item.purchasePrice,
            sellingPrice: item.mrp,
            expirationDate: itemExpiration,
          }, tx);
          targetBatchId = savedBatch.id;
        }

        // 2. Safely receive stock via the authoritative movement pipeline
        await inventoryMovementService.receiveStock({
          drugId: item.drug.toString(),
          batchId: targetBatchId,
          quantity: item.quantity,
          tx,
        });

        // 3. Keep record for purchase item
        purchaseItems.push({
          drugId: item.drug.toString(),
          quantity: item.quantity,
          price: item.purchasePrice,
        });
      }

      // 4. Create the final purchase record in Prisma
      const savedPurchase = await purchaseRepository.create({
        purchaseNumber: `PUR-${Date.now()}`,
        purchaseDate: new Date(data.purchaseAt),
        totalCost: data.bill || 0, 
        status: "RECEIVED",
        supplierId: data.supplier?.toString(),
        actorId: data.actor,
        items: purchaseItems,
      }, tx);

      if (data.actor) {
        await createAuditLog({
          actor: data.actor,
          action: "CREATE_PURCHASE",
          entityType: "Purchase",
          entityId: savedPurchase.id as any,
          after: savedPurchase as any,
          tx,
        });
      }

      return savedPurchase;
    } catch (error) {
      throw error;
    }
  });
};
const deletePurchase = async ({ id, actor }: { id: IDType; actor: string | undefined }) => {
  const purchase = await purchaseRepository.findById(id as string);
  if (!purchase) throw new Error("Purchase not found");
  if (purchase.isDeleted) return purchase;

  const beforeState = JSON.parse(JSON.stringify(purchase));

  const updated = await purchaseRepository.softDelete(id as string, actor);

  if (actor) {
    await createAuditLog({
      actor,
      action: "SOFT_DELETE",
      entityType: "Purchase",
      entityId: id as any,
      before: beforeState,
    });
  }

  return updated;
};
// 
async function getPurchases(query: QueryParams) {
  try {
    const {
      currentPage,
      viewLimit,
      viewSkip,
      sortBy,
      sortOrder,
      searchTerm,
    } = getSearchAndPagination({ query, entity: entities.purchase });

    const result = await purchaseRepository.search({
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
        sortOrder,
      },
      data: result.data,
    };
  } catch (error) {
    return error;
  }
}



export default {
  getPurchases,
  getSinglePurchase,
  createPurchase,
  deletePurchase,
};
