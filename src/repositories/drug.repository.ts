import prisma from "../lib/prisma";
import { IDrug, IDrugCreateInput, IDrugUpdateInput } from "../types/drug.type";
import { DrugStatus, Prisma } from "@prisma/client";

/**
 * Drug Repository (Prisma implementation)
 * Handles all Drug persistence logic for PostgreSQL.
 */
export class DrugRepository {
  async findById(id: string): Promise<IDrug | null> {
    const drug = await prisma.drug.findUnique({
      where: { id },
      include: {
        brand: true,
        generic: true,
        unit: true,
        group: true,
        manufacturer: true,
        formulation: true,
      }
    });
    return (drug as unknown as IDrug) || null;
  }

  async create(data: IDrugCreateInput): Promise<IDrug> {
    const drug = await prisma.drug.create({
      data: {
        name: data.name,
        brandId: data.brandId,
        formulationId: data.formulationId,
        strength: data.strength,
        unitId: data.unitId,
        groupId: (data as any).groupId,
        mfrId: (data as any).mfrId,
        available: data.available ?? 0,
        purchasePrice: data.purchasePrice,
        mrp: data.mrp,
        status: (data.status as DrugStatus) || "ACTIVE",
      },
    });
    return drug as unknown as IDrug;
  }

  async update(id: string, data: IDrugUpdateInput): Promise<IDrug> {
    const drug = await prisma.drug.update({
      where: { id },
      data: {
        ...data,
        status: data.status as DrugStatus | undefined,
      },
    });
    return drug as unknown as IDrug;
  }

  async softDelete(id: string, actor?: string): Promise<IDrug> {
    const drug = await prisma.drug.update({
      where: { id },
      data: {
        isDeleted: true,
        deletedAt: new Date(),
        // Note: deletedBy is not in Prisma schema yet to keep it simple, 
        // but we could add it if needed. For now we use AuditLog.
      },
    });
    return drug as unknown as IDrug;
  }

  async search(params: {
    searchTerm?: string;
    status?: DrugStatus;
    isDeleted?: boolean;
    skip?: number;
    take?: number;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
  }): Promise<{ data: IDrug[]; total: number }> {
    const where: any = {
      isDeleted: params.isDeleted ?? false,
    };

    if (params.searchTerm) {
      where.name = {
        contains: params.searchTerm,
        mode: "insensitive",
      };
    }

    if (params.status) {
      where.status = params.status;
    }

    const [data, total] = await Promise.all([
      prisma.drug.findMany({
        where,
        skip: params.skip,
        take: params.take,
        orderBy: params.sortBy ? { [params.sortBy]: params.sortOrder ?? "desc" } : { createdAt: "desc" },
        include: {
          brand: true,
          unit: true,
        }
      }),
      prisma.drug.count({ where }),
    ]);

    return {
      data: data as unknown as IDrug[],
      total,
    };
  }

  async updateAvailability(
    id: string,
    newAvailable: number,
    tx?: Prisma.TransactionClient
  ): Promise<IDrug> {
    const client = tx || prisma;
    const drug = await client.drug.update({
      where: { id },
      data: {
        available: newAvailable,
      },
    });
    return drug as unknown as IDrug;
  }

  async hasOperationalHistory(id: string): Promise<boolean> {
    const [batchCount, saleItemCount, purchaseItemCount] = await Promise.all([
      prisma.inventoryBatch.count({ where: { drugId: id } }),
      prisma.saleItem.count({ where: { drugId: id } }),
      prisma.purchaseItem.count({ where: { drugId: id } }),
    ]);

    return batchCount > 0 || saleItemCount > 0 || purchaseItemCount > 0;
  }
}

export default new DrugRepository();
