import prisma from "../lib/prisma";
import { Prisma, AdjustmentType } from "@prisma/client";

/**
 * InventoryAdjustment Repository (Prisma implementation)
 * Handles all InventoryAdjustment persistence logic for PostgreSQL.
 */
export class InventoryAdjustmentRepository {
  async create(data: {
    adjustmentType: AdjustmentType;
    drugId: string;
    batchId: string;
    quantity: number;
    reason: string;
    notes?: string;
    actorId: string;
  }, tx?: Prisma.TransactionClient) {
    const client = tx || prisma;

    return await client.inventoryAdjustment.create({
      data: {
        adjustmentType: data.adjustmentType,
        drugId: data.drugId,
        batchId: data.batchId,
        quantity: data.quantity,
        reason: data.reason,
        notes: data.notes,
        actorId: data.actorId,
      },
    });
  }

  async findById(id: string) {
    return await prisma.inventoryAdjustment.findUnique({
      where: { id },
      include: {
        drug: true,
        batch: true,
      },
    });
  }

  async search(params: {
    drugId?: string;
    adjustmentType?: AdjustmentType;
    skip?: number;
    take?: number;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
  }) {
    const where: Prisma.InventoryAdjustmentWhereInput = {};

    if (params.drugId) {
      where.drugId = params.drugId;
    }

    if (params.adjustmentType) {
      where.adjustmentType = params.adjustmentType;
    }

    const [data, total] = await Promise.all([
      prisma.inventoryAdjustment.findMany({
        where,
        skip: params.skip,
        take: params.take,
        orderBy: params.sortBy ? { [params.sortBy]: params.sortOrder ?? "desc" } : { createdAt: "desc" },
        include: {
          drug: true,
          batch: true,
        },
      }),
      prisma.inventoryAdjustment.count({ where }),
    ]);

    return { data, total };
  }
}

export default new InventoryAdjustmentRepository();
