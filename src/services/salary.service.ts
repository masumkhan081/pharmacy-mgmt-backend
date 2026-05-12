import { entities } from "../config/constants";
import prisma from "../lib/prisma";
import { IDType, QueryParams } from "../types/requestResponse";
import getSearchAndPagination from "../utils/queryHandler";

const getSingleSalary = async (id: IDType) => 
  prisma.salary.findUnique({
    where: { id: id as string },
    include: { staff: true }
  });

const deleteSalary = async (id: IDType) => 
  await prisma.salary.delete({ where: { id: id as string } });

const createSalary = async (data: any) => 
  await prisma.salary.create({
    data: {
      staffId: data.staff,
      amount: data.amount,
      month: data.month,
      year: data.year,
      paidAt: data.paidAt || new Date(),
    }
  });

const updateSalary = async ({ id, data }: any) =>
  await prisma.salary.update({
    where: { id: id as string },
    data
  });

async function getSalaries(query: QueryParams) {
  try {
    const {
      currentPage,
      viewLimit,
      viewSkip,
      sortBy,
      sortOrder,
      searchTerm,
    } = getSearchAndPagination({ query, entity: entities.salary });

    const where = searchTerm ? {
      staff: {
        name: { contains: searchTerm, mode: "insensitive" } as any
      }
    } : {};

    const fetchResult = await prisma.salary.findMany({
      where,
      skip: viewSkip,
      take: viewLimit,
      orderBy: sortBy ? { [sortBy]: sortOrder ?? "desc" } : { createdAt: "desc" },
      include: { staff: true }
    });

    const total = await prisma.salary.count({ where });
    
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
  getSalaries,
  getSingleSalary,
  createSalary,
  updateSalary,
  deleteSalary,
};
