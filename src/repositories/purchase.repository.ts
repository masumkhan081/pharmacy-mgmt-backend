import prisma from "../lib/prisma";
import { Prisma } from "@prisma/client";

/**
 * Purchase Repository (Prisma implementation)
 * Handles all Purchase persistence logic for PostgreSQL.
 */
export class PurchaseRepository {
  async create(data: {
    purchaseNumber: string;
    purchaseDate: Date;
    totalCost: number;
    status: string;
    supplierId?: string;
    actorId?: string;
    items: {
      drugId: string;
      quantity: number;
      price: number;
    }[];
  }, tx?: Prisma.TransactionClient) {
    const client = tx || prisma;

    return await client.purchase.create({
      data: {
        purchaseNumber: data.purchaseNumber,
        purchaseDate: data.purchaseDate,
        totalCost: data.totalCost,
        status: data.status,
        supplierId: data.supplierId,
        actorId: data.actorId,
        items: {
          create: data.items.map(item => ({
            drugId: item.drugId,
            quantity: item.quantity,
            price: item.price,
          })),
        },
      },
      include: {
        items: true,
      },
    });
  }

  async findById(id: string) {
    return await prisma.purchase.findUnique({
      where: { id },
      include: {
        items: true,
        batches: true,
      },
    });
  }

  async softDelete(id: string, actorId?: string) {
    return await prisma.purchase.update({
      where: { id },
      data: {
        isDeleted: true,
        deletedAt: new Date(),
      },
    });
  }

  async search(params: {
    searchTerm?: string;
    skip?: number;
    take?: number;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
  }) {
    const where: Prisma.PurchaseWhereInput = {
      isDeleted: false,
    };

    if (params.searchTerm) {
      where.purchaseNumber = {
        contains: params.searchTerm,
        mode: "insensitive",
      };
    }

    const [data, total] = await Promise.all([
      prisma.purchase.findMany({
        where,
        skip: params.skip,
        take: params.take,
        orderBy: params.sortBy ? { [params.sortBy]: params.sortOrder ?? "desc" } : { createdAt: "desc" },
        include: {
          items: true,
        },
      }),
      prisma.purchase.count({ where }),
    ]);

    return { data, total };
  }
}

export default new PurchaseRepository();
