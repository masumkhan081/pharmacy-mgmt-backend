import { entities } from "../config/constants";
import prisma from "../lib/prisma";
import { IDType, QueryParams } from "../types/requestResponse";
import getSearchAndPagination from "../utils/queryHandler";

const createStaff = async (data: any) => await prisma.staff.create({ data });

const getSingleStaff = async (id: IDType) => await prisma.staff.findUnique({ where: { id: id as string } });

const updateStaff = async ({ id, data }: any) =>
  await prisma.staff.update({ where: { id: id as string }, data });

const deleteStaff = async (id: IDType) => await prisma.staff.delete({ where: { id: id as string } });

async function getStaffs(query: QueryParams) {
  try {
    const {
      currentPage,
      viewLimit,
      viewSkip,
      sortBy,
      sortOrder,
      searchTerm,
    } = getSearchAndPagination({ query, entity: entities.staff });

    const where = searchTerm ? {
      OR: [
        { name: { contains: searchTerm, mode: "insensitive" } as any },
        { email: { contains: searchTerm, mode: "insensitive" } as any },
      ]
    } : {};

    const fetchResult = await prisma.staff.findMany({
      where,
      skip: viewSkip,
      take: viewLimit,
      orderBy: sortBy ? { [sortBy]: sortOrder ?? "desc" } : { createdAt: "desc" },
    });

    const total = await prisma.staff.count({ where });

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
  createStaff,
  updateStaff,
  getSingleStaff,
  deleteStaff,
  getStaffs,
};
