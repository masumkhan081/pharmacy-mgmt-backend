import { IDType, QueryParams } from "../types/requestResponse";
import InventoryBatch from "../models/inventoryBatch.model";
import getSearchAndPagination from "../utils/queryHandler";
import { entities } from "../config/constants";

// Create a new inventory batch
const createInventoryBatch = async (data: any) => {
  return await InventoryBatch.create(data);
};

// Get a single batch by ID
const getSingleInventoryBatch = async (id: IDType) => {
  return await InventoryBatch.findById(id)
    .populate('drug', 'name code')
    .populate('manufacturer', 'name')
    .populate('supplier', 'name');
};

// Update a batch
const updateInventoryBatch = async ({ id, data }: { id: IDType; data: any }) => {
  return await InventoryBatch.findByIdAndUpdate(id, data, { new: true })
    .populate('drug', 'name code')
    .populate('manufacturer', 'name')
    .populate('supplier', 'name');
};

// Delete a batch
const deleteInventoryBatch = async (id: IDType) => {
  return await InventoryBatch.findByIdAndDelete(id);
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
      filterConditions,
      sortConditions,
    } = getSearchAndPagination({ query, entity: entities.inventoryBatch });

    const fetchResult = await InventoryBatch.find(filterConditions)
      .populate('drug', 'name')
      .populate('manufacturer', 'name')
      .sort(sortConditions)
      .skip(viewSkip)
      .limit(viewLimit);

    const total = await InventoryBatch.countDocuments(filterConditions);
    
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
      filterConditions,
      sortConditions,
    } = getSearchAndPagination({ 
      query, 
      entity: entities.inventoryBatch,
      additionalFilters: { drug: drugId }
    });

    const fetchResult = await InventoryBatch.find(filterConditions)
      .populate('manufacturer', 'name')
      .sort(sortConditions)
      .skip(viewSkip)
      .limit(viewLimit);

    const total = await InventoryBatch.countDocuments(filterConditions);
    
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
};

// Get expiring batches
const getExpiringBatches = async (days: number = 30) => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  
  return await InventoryBatch.find({
    expirationDate: { $lte: date },
    currentQuantity: { $gt: 0 },
  })
  .populate('drug', 'name')
  .sort({ expirationDate: 1 });
};

// Get low stock batches
const getLowStockBatches = async (threshold: number = 10) => {
  return await InventoryBatch.find({
    $and: [
      { currentQuantity: { $lte: threshold } },
      { currentQuantity: { $gt: 0 } }
    ]
  })
  .populate('drug', 'name')
  .sort({ currentQuantity: 1 });
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
