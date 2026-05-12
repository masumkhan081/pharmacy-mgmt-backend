import { entities } from "../config/constants";
import prisma from "../lib/prisma";
import { IDType, QueryParams } from "../types/requestResponse";
import getSearchAndPagination from "../utils/queryHandler";

const createUnit = async (data: any) => await prisma.unit.create({ data });

const getSingleUnit = async (id: IDType) => await prisma.unit.findUnique({ where: { id: id as string } });

const updateUnit = async ({ id, data }: any) =>
  await prisma.unit.update({ where: { id: id as string }, data });

const deleteUnit = async (id: IDType) => await prisma.unit.delete({ where: { id: id as string } });

async function getUnits(query: QueryParams) {
  try {
    const {
      currentPage,
      viewLimit,
      viewSkip,
      sortBy,
      sortOrder,
      searchTerm,
    } = getSearchAndPagination({ query, entity: entities.unit });

    const where = searchTerm ? {
      name: { contains: searchTerm, mode: "insensitive" } as any
    } : {};

    const fetchResult = await prisma.unit.findMany({
      where,
      skip: viewSkip,
      take: viewLimit,
      orderBy: sortBy ? { [sortBy]: sortOrder ?? "desc" } : { createdAt: "desc" },
    });

    const total = await prisma.unit.count({ where });
    
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
  createUnit,
  updateUnit,
  getSingleUnit,
  deleteUnit,
  getUnits,
};
