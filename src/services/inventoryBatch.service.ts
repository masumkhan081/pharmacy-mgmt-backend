import { IDType, QueryParams } from "../types/requestResponse";
import inventoryBatchRepository from "../repositories/inventoryBatch.repository";
import prisma from "../lib/prisma";
import { entities } from "../config/constants";
import getSearchAndPagination from "../utils/queryHandler";

// Create a new inventory batch
const createInventoryBatch = async (data: any) => {
  return await inventoryBatchRepository.create(data);
};

// Get a single batch by ID
const getSingleInventoryBatch = async (id: IDType) => {
  return await inventoryBatchRepository.findById(id as string);
};

// Update a batch
const updateInventoryBatch = async ({ id, data }: { id: IDType; data: any }) => {
  return await inventoryBatchRepository.update(id as string, data);
};

// Delete a batch
const deleteInventoryBatch = async (id: IDType) => {
  return await prisma.inventoryBatch.delete({ where: { id: id as string } });
};

// Get all batches with pagination and filtering
const getInventoryBatches = async (query: QueryParams) => {
  try {
    const {
      currentPage,
      viewLimit,
      viewSkip,
      sortBy,
      sortOrder,
      searchTerm,
    } = getSearchAndPagination({ query, entity: entities.inventoryBatch });

    const result = await prisma.inventoryBatch.findMany({
      where: searchTerm ? {
        batchNumber: { contains: searchTerm, mode: "insensitive" }
      } : {},
      skip: viewSkip,
      take: viewLimit,
      orderBy: sortBy ? { [sortBy]: sortOrder ?? "desc" } : { createdAt: "desc" },
      include: { drug: true },
    });

    const total = await prisma.inventoryBatch.count({
      where: searchTerm ? {
        batchNumber: { contains: searchTerm, mode: "insensitive" }
      } : {},
    });
    
    return {
      meta: {
        total,
        limit: viewLimit,
        page: currentPage,
        skip: viewSkip,
        sortBy,
        sortOrder,
      },
      data: result,
    };
  } catch (error) {
    return error;
  }
};

// Get batches for a specific drug
const getBatchesByDrug = async ({ drugId, query }: { drugId: IDType; query: QueryParams }) => {
  try {
    const {
      currentPage,
      viewLimit,
      viewSkip,
      sortBy,
      sortOrder,
    } = getSearchAndPagination({ query, entity: entities.inventoryBatch });

    const result = await prisma.inventoryBatch.findMany({
      where: { drugId: drugId as string },
      skip: viewSkip,
      take: viewLimit,
      orderBy: sortBy ? { [sortBy]: sortOrder ?? "desc" } : { createdAt: "desc" },
      include: { drug: true },
    });

    const total = await prisma.inventoryBatch.count({
      where: { drugId: drugId as string },
    });
    
    return {
      meta: {
        total,
        limit: viewLimit,
        page: currentPage,
        skip: viewSkip,
        sortBy,
        sortOrder,
      },
      data: result,
    };
  } catch (error) {
    return error;
  }
};

// Get expiring batches
const getExpiringBatches = async (days: number = 30) => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  
  return await prisma.inventoryBatch.findMany({
    where: {
      expirationDate: { lte: date },
      currentQuantity: { gt: 0 },
    },
    include: { drug: true },
    orderBy: { expirationDate: "asc" },
  });
};

// Get low stock batches
const getLowStockBatches = async (threshold: number = 10) => {
  return await prisma.inventoryBatch.findMany({
    where: {
      currentQuantity: { lte: threshold, gt: 0 },
    },
    include: { drug: true },
    orderBy: { currentQuantity: "asc" },
  });
};

export default {
  createInventoryBatch,
  getSingleInventoryBatch,
  updateInventoryBatch,
  deleteInventoryBatch,
  getInventoryBatches,
  getBatchesByDrug,
  getExpiringBatches,
  getLowStockBatches,
};
