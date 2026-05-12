import { entities } from "../config/constants";
import prisma from "../lib/prisma";
import { IDType, QueryParams } from "../types/requestResponse";
import getSearchAndPagination from "../utils/queryHandler";

const createSupplier = async (data: any) => await prisma.supplier.create({ data });

const getSingleSupplier = async (id: IDType) => await prisma.supplier.findUnique({ where: { id: id as string } });

const updateSupplier = async ({ id, data }: { id: IDType; data: any }) =>
  await prisma.supplier.update({ where: { id: id as string }, data });

const deleteSupplier = async (id: IDType) =>
  await prisma.supplier.delete({ where: { id: id as string } });

async function getSuppliers(query: QueryParams) {
  try {
    const {
      currentPage,
      viewLimit,
      viewSkip,
      sortBy,
      sortOrder,
      searchTerm,
    } = getSearchAndPagination({ query, entity: entities.supplier });

    const where = searchTerm ? {
      OR: [
        { name: { contains: searchTerm, mode: "insensitive" } as any },
        { email: { contains: searchTerm, mode: "insensitive" } as any },
      ]
    } : {};

    const fetchResult = await prisma.supplier.findMany({
      where,
      skip: viewSkip,
      take: viewLimit,
      orderBy: sortBy ? { [sortBy]: sortOrder ?? "desc" } : { createdAt: "desc" },
    });

    const total = await prisma.supplier.count({ where });

    return {
      meta: {
        total,
        limit: viewLimit,
        page: currentPage,
        skip: viewSkip,
        sortBy,
        sortOrder,
      },
      data: fetchResult,
    };
  } catch (error) {
    return error;
  }
}

export default {
  getSuppliers,
  getSingleSupplier,
  createSupplier,
  updateSupplier,
  deleteSupplier,
};
