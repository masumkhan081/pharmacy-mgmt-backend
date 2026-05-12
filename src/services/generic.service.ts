import { entities } from "../config/constants";
import genericRepository from "../repositories/generic.repository";
import { IDType, QueryParams } from "../types/requestResponse";
import getSearchAndPagination from "../utils/queryHandler";
import prisma from "../lib/prisma";

const createGeneric = async (data: any) => await genericRepository.create(data);

const getSingleGeneric = async (id: IDType) => await genericRepository.findById(id as string);

const updateGeneric = async ({ id, data }: { id: IDType; data: any }) =>
  await genericRepository.update(id as string, data);

const deleteGeneric = async (id: IDType) => await genericRepository.deleteById(id as string);

async function getGenerics(query: QueryParams) {
  try {
    const {
      currentPage,
      viewLimit,
      viewSkip,
      sortBy,
      sortOrder,
      searchTerm,
    } = getSearchAndPagination({ query, entity: entities.generic });

    const where = searchTerm ? {
      name: { contains: searchTerm, mode: "insensitive" } as any
    } : {};

    const fetchResult = await prisma.generic.findMany({
      where,
      skip: viewSkip,
      take: viewLimit,
      orderBy: sortBy ? { [sortBy]: sortOrder ?? "desc" } : { createdAt: "desc" },
    });

    const total = await prisma.generic.count({ where });
    
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
  createGeneric,
  updateGeneric,
  getSingleGeneric,
  deleteGeneric,
  getGenerics,
};
