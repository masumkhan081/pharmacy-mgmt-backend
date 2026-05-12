import { entities } from "../config/constants";
import prisma from "../lib/prisma";
import { IDType, QueryParams } from "../types/requestResponse";
import getSearchAndPagination from "../utils/queryHandler";

const createFormulation = async (data: any) => await prisma.formulation.create({ data });

const getSingleFormulation = async (id: IDType) => await prisma.formulation.findUnique({ where: { id: id as string } });

const updateFormulation = async ({ id, data }: { id: IDType; data: any }) =>
  await prisma.formulation.update({ where: { id: id as string }, data });

const deleteFormulation = async (id: IDType) => await prisma.formulation.delete({ where: { id: id as string } });

async function getFormulations(query: QueryParams) {
  try {
    const {
      currentPage,
      viewLimit,
      viewSkip,
      sortBy,
      sortOrder,
      searchTerm,
    } = getSearchAndPagination({ query, entity: entities.formulation });

    const where = searchTerm ? {
      name: { contains: searchTerm, mode: "insensitive" } as any
    } : {};

    const fetchResult = await prisma.formulation.findMany({
      where,
      skip: viewSkip,
      take: viewLimit,
      orderBy: sortBy ? { [sortBy]: sortOrder ?? "desc" } : { createdAt: "desc" },
    });

    const total = await prisma.formulation.count({ where });
    
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
  createFormulation,
  updateFormulation,
  getSingleFormulation,
  deleteFormulation,
  getFormulations,
};
