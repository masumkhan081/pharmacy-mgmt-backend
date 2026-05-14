import { entities } from "../config/constants";
import { IDType, QueryParams } from "../types/requestResponse";
import { ISalePayload } from "../types/sale.type";
import getSearchAndPagination from "../utils/queryHandler";
import inventoryMovementService from "./inventoryMovement.service";
import { createAuditLog } from "../utils/auditLog";
import { logOperationalFailure } from "../utils/logger";
import saleRepository from "../repositories/sale.repository";
import prisma from "../lib/prisma";

const getSingleSale = async (id: IDType) => saleRepository.findById(id as string);

const deleteSale = async ({ id, actor }: { id: IDType; actor: string | undefined }) => {
  const sale = await saleRepository.findById(id as string);
  if (!sale) throw new Error("Sale not found");
  if (sale.isDeleted) return sale;

  const beforeState = JSON.parse(JSON.stringify(sale));
  
  const updated = await saleRepository.softDelete(id as string, actor);

  if (actor) {
    await createAuditLog({
      actor,
      action: "SOFT_DELETE",
      entityType: "Sale",
      entityId: id as any,
      before: beforeState,
    });
  }

  return updated;
};
export const createSale = async (data: ISalePayload) => {
  return await prisma.$transaction(async (tx) => {
    try {
      const saleItems = [];
      const auditDetails = [];

      // Deduct stock for each drug in the sale
      for (const item of data.drugs) {
        const movementReceipt = await inventoryMovementService.deductStock({
          drugId: item.drug.toString(),
          quantity: item.quantity,
          tx,
        });

        saleItems.push({
          drugId: item.drug.toString(),
          quantity: item.quantity,
          price: item.mrp,
          batchMovements: movementReceipt.allocations.map(alloc => ({
            batchId: alloc.batchId.toString(),
            quantity: alloc.quantityMoved,
          }))
        });
      }

      // Create the sale record in Prisma
      const savedSale = await saleRepository.create({
        saleNumber: `SALE-${Date.now()}`,
        totalBill: data.bill,
        actorId: data.actor || "SYSTEM",
        customerId: data.customerId,
        items: saleItems,
      }, tx);

      if (data.actor) {
        await createAuditLog({
          actor: data.actor,
          action: "CREATE_SALE",
          entityType: "Sale",
          entityId: savedSale.id as any,
          after: savedSale as any,
          tx,
        });
      }

      return savedSale;
    } catch (error) {
      logOperationalFailure("SALE", error, { data });
      throw error;
    }
  });
};
// 
async function getSales(query: QueryParams) {
  try {
    const {
      currentPage,
      viewLimit,
      viewSkip,
      sortBy,
      sortOrder,
      searchTerm,
    } = getSearchAndPagination({ query, entity: entities.sale });

    const result = await saleRepository.search({
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
  getSales,
  getSingleSale,
  createSale,
  deleteSale,
};
