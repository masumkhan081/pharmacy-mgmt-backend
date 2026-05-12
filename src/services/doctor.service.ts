import { entities } from "../config/constants";
import prisma from "../lib/prisma";
import { IDType, QueryParams } from "../types/requestResponse";
import getSearchAndPagination from "../utils/queryHandler";

const createDoctor = async (data: any) => await prisma.doctor.create({ data });

const getSingleDoctor = async (id: IDType) => await prisma.doctor.findUnique({ where: { id: id as string } });

const updateDoctor = async ({ id, data }: { id: IDType; data: any }) =>
  await prisma.doctor.update({ where: { id: id as string }, data });

const deleteDoctor = async (id: IDType) => await prisma.doctor.delete({ where: { id: id as string } });

async function getDoctors(query: QueryParams) {
  try {
    const {
      currentPage,
      viewLimit,
      viewSkip,
      sortBy,
      sortOrder,
      searchTerm,
    } = getSearchAndPagination({ query, entity: entities.doctor });

    const where = searchTerm ? {
      OR: [
        { name: { contains: searchTerm, mode: "insensitive" } as any },
        { specialty: { contains: searchTerm, mode: "insensitive" } as any },
      ]
    } : {};

    const fetchResult = await prisma.doctor.findMany({
      where,
      skip: viewSkip,
      take: viewLimit,
      orderBy: sortBy ? { [sortBy]: sortOrder ?? "desc" } : { createdAt: "desc" },
    });

    const total = await prisma.doctor.count({ where });

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
  createDoctor,
  getSingleDoctor,
  updateDoctor,
  deleteDoctor,
  getDoctors,
};
