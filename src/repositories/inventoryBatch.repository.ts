import prisma from "../lib/prisma";
import { IInventoryBatch, IInventoryBatchCreateInput, IInventoryBatchUpdateInput } from "../types/inventoryBatch.type";
import { BatchStatus, Prisma } from "@prisma/client";

/**
 * InventoryBatch Repository (Prisma implementation)
 * Handles all batch persistence logic for PostgreSQL.
 */
export class InventoryBatchRepository {
  async findById(id: string, tx?: Prisma.TransactionClient): Promise<IInventoryBatch | null> {
    const client = tx || prisma;
    const batch = await client.inventoryBatch.findUnique({
      where: { id },
    });
    return (batch as unknown as IInventoryBatch) || null;
  }

  async findFIFO(drugId: string, tx?: Prisma.TransactionClient): Promise<IInventoryBatch[]> {
    const client = tx || prisma;
    const now = new Date();
    const batches = await client.inventoryBatch.findMany({
      where: {
        drugId,
        isActive: true,
        expirationDate: { gt: now },
        currentQuantity: { gt: 0 },
      },
      orderBy: {
        expirationDate: "asc",
      },
    });
    return batches as unknown as IInventoryBatch[];
  }

  async create(data: IInventoryBatchCreateInput, tx?: Prisma.TransactionClient): Promise<IInventoryBatch> {
    const client = tx || prisma;
    const batch = await client.inventoryBatch.create({
      data: {
        drugId: data.drugId,
        batchNumber: data.batchNumber,
        lotNumber: data.lotNumber,
        expirationDate: data.expirationDate,
        initialQuantity: data.initialQuantity,
        currentQuantity: data.currentQuantity,
        purchasePrice: data.purchasePrice,
        sellingPrice: data.sellingPrice,
        purchaseId: data.purchaseId,
        status: (data.status as BatchStatus) || "AVAILABLE",
        isActive: data.isActive ?? true,
      },
    });
    return batch as unknown as IInventoryBatch;
  }

  async update(id: string, data: IInventoryBatchUpdateInput, tx?: Prisma.TransactionClient): Promise<IInventoryBatch> {
    const client = tx || prisma;
    const batch = await client.inventoryBatch.update({
      where: { id },
      data: {
        ...data,
        status: data.status as BatchStatus | undefined,
      },
    });
    return batch as unknown as IInventoryBatch;
  }

  async sumAvailableStock(drugId: string, tx?: Prisma.TransactionClient): Promise<number> {
    const client = tx || prisma;
    const now = new Date();
    const result = await client.inventoryBatch.aggregate({
      where: {
        drugId,
        isActive: true,
        expirationDate: { gt: now },
        currentQuantity: { gt: 0 },
      },
      _sum: {
        currentQuantity: true,
      },
    });
    return result._sum.currentQuantity || 0;
  }

  async findByDrug(drugId: string, tx?: Prisma.TransactionClient): Promise<IInventoryBatch[]> {
    const client = tx || prisma;
    return (await client.inventoryBatch.findMany({
      where: { drugId },
      orderBy: { createdAt: "desc" },
    })) as unknown as IInventoryBatch[];
  }

  async findByDrugAndBatchNumber(drugId: string, batchNumber: string, tx?: Prisma.TransactionClient): Promise<IInventoryBatch | null> {
    const client = tx || prisma;
    const batch = await client.inventoryBatch.findUnique({
      where: {
        drugId_batchNumber: {
          drugId,
          batchNumber,
        },
      },
    });
    return (batch as unknown as IInventoryBatch) || null;
  }
}

export default new InventoryBatchRepository();
