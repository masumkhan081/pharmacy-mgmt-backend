import prisma from "../lib/prisma";
import { Prisma, ReturnStatus, ReturnType } from "@prisma/client";

/**
 * Return Repository (Prisma implementation)
 * Handles all Return persistence logic for PostgreSQL.
 */
export class ReturnRepository {
  async create(data: {
    returnNumber: string;
    returnType: ReturnType;
    reason: string;
    processedById: string;
    items: {
      drugId: string;
      batchId: string;
      quantity: number;
      price: number;
    }[];
  }, tx?: Prisma.TransactionClient) {
    const client = tx || prisma;

    return await client.return.create({
      data: {
        returnNumber: data.returnNumber,
        returnType: data.returnType,
        reason: data.reason,
        processedById: data.processedById,
        status: ReturnStatus.PENDING,
        items: {
          create: data.items.map(item => ({
            drugId: item.drugId,
            batchId: item.batchId,
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
    return await prisma.return.findUnique({
      where: { id },
      include: {
        items: true,
      },
    });
  }

  async updateStatus(id: string, status: ReturnStatus, approvedById: string, tx?: Prisma.TransactionClient) {
    const client = tx || prisma;
    return await client.return.update({
      where: { id },
      data: {
        status,
        approvedById,
        refundDate: status === ReturnStatus.APPROVED ? new Date() : undefined,
      },
    });
  }

  async softDelete(id: string) {
    return await prisma.return.update({
      where: { id },
      data: {
        isDeleted: true,
        deletedAt: new Date(),
      },
    });
  }

  async search(params: {
    status?: ReturnStatus;
    searchTerm?: string;
    skip?: number;
    take?: number;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
  }) {
    const where: Prisma.ReturnWhereInput = {
      isDeleted: false,
    };

    if (params.status) {
      where.status = params.status;
    }

    if (params.searchTerm) {
      where.returnNumber = {
        contains: params.searchTerm,
        mode: "insensitive",
      };
    }

    const [data, total] = await Promise.all([
      prisma.return.findMany({
        where,
        skip: params.skip,
        take: params.take,
        orderBy: params.sortBy ? { [params.sortBy]: params.sortOrder ?? "desc" } : { createdAt: "desc" },
        include: {
          items: true,
        },
      }),
      prisma.return.count({ where }),
    ]);

    return { data, total };
  }
}

export default new ReturnRepository();
