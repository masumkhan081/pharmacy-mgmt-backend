import { entities } from "../config/constants";
import prisma from "../lib/prisma";
import { IDType, QueryParams } from "../types/requestResponse";
import getSearchAndPagination from "../utils/queryHandler";

const createGroup = async (data: any) => await prisma.group.create({ data });

const getSingleGroup = async (id: IDType) => await prisma.group.findUnique({ where: { id: id as string } });

const updateGroup = async ({ id, data }: { id: IDType; data: any }) =>
  await prisma.group.update({ where: { id: id as string }, data });

const deleteGroup = async (id: IDType) => await prisma.group.delete({ where: { id: id as string } });

async function getGroups(query: QueryParams) {
  try {
    const {
      currentPage,
      viewLimit,
      viewSkip,
      sortBy,
      sortOrder,
      searchTerm,
    } = getSearchAndPagination({ query, entity: entities.group });

    const where = searchTerm ? {
      name: { contains: searchTerm, mode: "insensitive" } as any
    } : {};

    const fetchResult = await prisma.group.findMany({
      where,
      skip: viewSkip,
      take: viewLimit,
      orderBy: sortBy ? { [sortBy]: sortOrder ?? "desc" } : { createdAt: "desc" },
    });

    const total = await prisma.group.count({ where });
    
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
  createGroup,
  updateGroup,
  getSingleGroup,
  deleteGroup,
  getGroups,
};
