import { entities } from "../config/constants";
import brandRepository from "../repositories/brand.repository";
import { IDType, QueryParams } from "../types/requestResponse";
import { IBrand, IBrandUpdatePayload } from "../types/brand.type";
import getSearchAndPagination from "../utils/queryHandler";
import prisma from "../lib/prisma";

const createBrand = async (data: IBrand) => await brandRepository.create(data);

const getSingleBrand = async (id: IDType) => await brandRepository.findById(id as string);

const updateBrand = async ({ id, data }: IBrandUpdatePayload) =>
  await brandRepository.update(id as string, data);

const deleteBrand = async (id: IDType) => await brandRepository.deleteById(id as string);

async function getBrands(query: QueryParams) {
  try {
    const {
      currentPage,
      viewLimit,
      viewSkip,
      sortBy,
      sortOrder,
      searchTerm,
    } = getSearchAndPagination({ query, entity: entities.brand });

    const where = searchTerm ? {
      name: { contains: searchTerm, mode: "insensitive" } as any
    } : {};

    const fetchResult = await prisma.brand.findMany({
      where,
      skip: viewSkip,
      take: viewLimit,
      orderBy: sortBy ? { [sortBy]: sortOrder ?? "desc" } : { createdAt: "desc" },
    });

    const total = await prisma.brand.count({ where });
    
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
  createBrand,
  updateBrand,
  getSingleBrand,
  deleteBrand,
  getBrands,
};
