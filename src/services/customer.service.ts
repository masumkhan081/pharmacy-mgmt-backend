import { entities } from "../config/constants";
import customerRepository from "../repositories/customer.repository";
import { IDType, QueryParams } from "../types/requestResponse";
import getSearchAndPagination from "../utils/queryHandler";
import prisma from "../lib/prisma";

const createCustomer = async (data: any) => await customerRepository.create(data);

const getSingleCustomer = async (id: IDType) => await customerRepository.findById(id as string);

const updateCustomer = async ({ id, data }: { id: IDType; data: any }) =>
  await customerRepository.update(id as string, data);

const deleteCustomer = async (id: IDType) =>
  await customerRepository.deleteById(id as string);

async function getCustomers(query: QueryParams) {
  try {
    const {
      currentPage,
      viewLimit,
      viewSkip,
      sortBy,
      sortOrder,
      searchTerm,
    } = getSearchAndPagination({ query, entity: entities.customer });

    const where = searchTerm ? {
      OR: [
        { fullName: { contains: searchTerm, mode: "insensitive" } as any },
        { phone: { contains: searchTerm, mode: "insensitive" } as any },
      ]
    } : {};

    const fetchResult = await prisma.customer.findMany({
      where,
      skip: viewSkip,
      take: viewLimit,
      orderBy: sortBy ? { [sortBy]: sortOrder ?? "desc" } : { createdAt: "desc" },
    });

    const total = await prisma.customer.count({ where });

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
  createCustomer,
  getSingleCustomer,
  updateCustomer,
  deleteCustomer,
  getCustomers,
};
