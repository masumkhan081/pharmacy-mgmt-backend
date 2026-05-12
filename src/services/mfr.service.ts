import { entities } from "../config/constants";
import prisma from "../lib/prisma";
import { IDType, QueryParams } from "../types/requestResponse";
import getSearchAndPagination from "../utils/queryHandler";

const createManufacturer = async (data: any) => await prisma.manufacturer.create({ data });

const getSingleManufacturer = async (id: IDType) => await prisma.manufacturer.findUnique({ where: { id: id as string } });

const updateManufacturer = async ({ id, data }: { id: IDType; data: any }) =>
  await prisma.manufacturer.update({ where: { id: id as string }, data });

const deleteManufacturer = async (id: IDType) => await prisma.manufacturer.delete({ where: { id: id as string } });

async function getManufacturers(query: QueryParams) {
  try {
    const {
      currentPage,
      viewLimit,
      viewSkip,
      sortBy,
      sortOrder,
      searchTerm,
    } = getSearchAndPagination({ query, entity: entities.manufacturer });

    const where = searchTerm ? {
      name: { contains: searchTerm, mode: "insensitive" } as any
    } : {};

    const fetchResult = await prisma.manufacturer.findMany({
      where,
      skip: viewSkip,
      take: viewLimit,
      orderBy: sortBy ? { [sortBy]: sortOrder ?? "desc" } : { createdAt: "desc" },
    });

    const total = await prisma.manufacturer.count({ where });
    
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
  createManufacturer,
  getSingleManufacturer,
  updateManufacturer,
  deleteManufacturer,
  getManufacturers,
};
