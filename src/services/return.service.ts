import { IDType, QueryParams } from "../types/requestResponse";
import Return from "../models/return.model";
import getSearchAndPagination from "../utils/queryHandler";
import { entities } from "../config/constants";

// Create a new return
const createReturn = async (data: any) => {
  return await Return.create(data);
};

// Get a single return by ID
const getSingleReturn = async (id: IDType) => {
  return await Return.findById(id)
    .populate('items.drug', 'name code')
    .populate('customer', 'name phone')
    .populate('processedBy', 'name');
};

// Update a return
const updateReturn = async ({ id, data }: { id: IDType; data: any }) => {
  return await Return.findByIdAndUpdate(id, data, { new: true })
    .populate('items.drug', 'name code')
    .populate('customer', 'name phone')
    .populate('processedBy', 'name');
};

// Delete a return
const deleteReturn = async (id: IDType) => {
  return await Return.findByIdAndDelete(id);
};

// Get all returns with pagination and filtering
const getReturns = async (query: QueryParams) => {
  try {
    const {
      currentPage,
      viewLimit,
      viewSkip,
      sortBy,
      sortOrder,
      filterConditions,
      sortConditions,
    } = getSearchAndPagination({ query, entity: entities.return });

    const fetchResult = await Return.find(filterConditions)
      .populate('customer', 'name')
      .sort(sortConditions)
      .skip(viewSkip)
      .limit(viewLimit);

    const total = await Return.countDocuments(filterConditions);
    
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

// Get returns by status
const getReturnsByStatus = async (status: string, query: QueryParams) => {
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
      entity: entities.return,
      additionalFilters: { status }
    });

    const fetchResult = await Return.find(filterConditions)
      .populate('customer', 'name')
      .sort(sortConditions)
      .skip(viewSkip)
      .limit(viewLimit);

    const total = await Return.countDocuments(filterConditions);
    
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

export default {
  createReturn,
  getSingleReturn,
  updateReturn,
  deleteReturn,
  getReturns,
  getReturnsByStatus,
};
