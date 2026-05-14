import prisma from "../lib/prisma";
import { Prisma } from "@prisma/client";

/**
 * Sale Repository (Prisma implementation)
 * Handles all Sale persistence logic for PostgreSQL.
 */
export class SaleRepository {
  async create(data: {
    saleNumber: string;
    totalBill: number;
    actorId: string;
    customerId?: string;
    items: {
      drugId: string;
      quantity: number;
      price: number;
      batchMovements: {
        batchId: string;
        quantity: number;
      }[];
    }[];
  }, tx?: Prisma.TransactionClient) {
    const client = tx || prisma;

    return await client.sale.create({
      data: {
        saleNumber: data.saleNumber,
        totalBill: data.totalBill,
        actorId: data.actorId,
        ...(data.customerId ? { customerId: data.customerId } : {}),
        items: {
          create: data.items.map(item => ({
            drugId: item.drugId,
            quantity: item.quantity,
            price: item.price,
            batchMovements: {
              create: item.batchMovements.map(bm => ({
                batchId: bm.batchId,
                quantity: bm.quantity,
              })),
            },
          })),
        },
      },
      include: {
        items: {
          include: {
            batchMovements: true,
          },
        },
      },
    });
  }

  async findById(id: string) {
    return await prisma.sale.findUnique({
      where: { id },
      include: {
        items: {
          include: {
            batchMovements: true,
          },
        },
      },
    });
  }

  async softDelete(id: string, actorId?: string) {
    return await prisma.sale.update({
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
    const where: Prisma.SaleWhereInput = {
      isDeleted: false,
    };

    if (params.searchTerm) {
      where.saleNumber = {
        contains: params.searchTerm,
        mode: "insensitive",
      };
    }

    const [data, total] = await Promise.all([
      prisma.sale.findMany({
        where,
        skip: params.skip,
        take: params.take,
        orderBy: params.sortBy ? { [params.sortBy]: params.sortOrder ?? "desc" } : { createdAt: "desc" },
        include: {
          items: true,
        },
      }),
      prisma.sale.count({ where }),
    ]);

    return { data, total };
  }
}

export default new SaleRepository();
