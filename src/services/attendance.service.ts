import { entities } from "../config/constants";
import prisma from "../lib/prisma";
import { IDType, QueryParams } from "../types/requestResponse";
import getSearchAndPagination from "../utils/queryHandler";

const createAttendance = async (data: any) => 
  await prisma.attendance.create({
    data: {
      staffId: data.staff,
      date: data.date || new Date(),
      status: data.status,
    }
  });

const getSingleAttendance = async (id: IDType) => 
  prisma.attendance.findUnique({
    where: { id: id as string },
    include: { staff: true }
  });

const updateAttendance = async ({ id, data }: any) =>
  await prisma.attendance.update({
    where: { id: id as string },
    data
  });

const deleteAttendance = async (id: IDType) => 
  await prisma.attendance.delete({ where: { id: id as string } });

async function getAttendances(query: QueryParams) {
  try {
    const {
      currentPage,
      viewLimit,
      viewSkip,
      sortBy,
      sortOrder,
      searchTerm,
    } = getSearchAndPagination({ query, entity: entities.attendance });

    const where = searchTerm ? {
      staff: {
        name: { contains: searchTerm, mode: "insensitive" } as any
      }
    } : {};

    const fetchResult = await prisma.attendance.findMany({
      where,
      skip: viewSkip,
      take: viewLimit,
      orderBy: sortBy ? { [sortBy]: sortOrder ?? "desc" } : { date: "desc" },
      include: { staff: true }
    });

    const total = await prisma.attendance.count({ where });

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
  createAttendance,
  updateAttendance,
  getSingleAttendance,
  deleteAttendance,
  getAttendances,
};
