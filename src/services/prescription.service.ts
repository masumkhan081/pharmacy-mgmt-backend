import { entities } from "../config/constants";
import prisma from "../lib/prisma";
import { IDType, QueryParams } from "../types/requestResponse";
import getSearchAndPagination from "../utils/queryHandler";

const createPrescription = async (data: any) => 
  await prisma.prescription.create({
    data: {
      patientName: data.patientName || data.customerName,
      doctorName: data.doctorName,
      details: data.details || JSON.stringify(data.medications),
      image: data.image,
    }
  });

const getSinglePrescription = async (id: IDType) =>
  await prisma.prescription.findUnique({
    where: { id: id as string }
  });

const updatePrescription = async ({
  id,
  data,
}: {
  id: IDType;
  data: any;
}) => await prisma.prescription.update({
  where: { id: id as string },
  data
});

const deletePrescription = async (id: IDType) =>
  await prisma.prescription.delete({
    where: { id: id as string }
  });

async function getPrescriptions(query: QueryParams) {
  try {
    const {
      currentPage,
      viewLimit,
      viewSkip,
      sortBy,
      sortOrder,
      searchTerm,
    } = getSearchAndPagination({ query, entity: entities.prescription });

    const where = searchTerm ? {
      OR: [
        { patientName: { contains: searchTerm, mode: "insensitive" } as any },
        { doctorName: { contains: searchTerm, mode: "insensitive" } as any },
      ]
    } : {};

    const fetchResult = await prisma.prescription.findMany({
      where,
      skip: viewSkip,
      take: viewLimit,
      orderBy: sortBy ? { [sortBy]: sortOrder ?? "desc" } : { createdAt: "desc" },
    });

    const total = await prisma.prescription.count({ where });

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
  createPrescription,
  getSinglePrescription,
  updatePrescription,
  deletePrescription,
  getPrescriptions,
};
