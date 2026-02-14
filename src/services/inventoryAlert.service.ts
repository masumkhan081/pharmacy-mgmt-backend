import { IDType, QueryParams } from "../types/requestResponse";
import InventoryAlert from "../models/inventoryAlert.model";
import getSearchAndPagination from "../utils/queryHandler";
import { entities } from "../config/constants";

// Create a new inventory alert
const createInventoryAlert = async (data: any) => {
  return await InventoryAlert.create(data);
};

// Get a single alert by ID
const getSingleInventoryAlert = async (id: IDType) => {
  return await InventoryAlert.findById(id)
    .populate('drug', 'name code')
    .populate('preferredSupplier', 'name');
};

// Update an alert
const updateInventoryAlert = async ({ id, data }: { id: IDType; data: any }) => {
  return await InventoryAlert.findByIdAndUpdate(id, data, { new: true })
    .populate('drug', 'name code')
    .populate('preferredSupplier', 'name');
};

// Delete an alert
const deleteInventoryAlert = async (id: IDType) => {
  return await InventoryAlert.findByIdAndDelete(id);
};

// Get all alerts with pagination and filtering
const getInventoryAlerts = async (query: QueryParams) => {
  try {
    const {
      currentPage,
      viewLimit,
      viewSkip,
      sortBy,
      sortOrder,
      filterConditions,
      sortConditions,
    } = getSearchAndPagination({ query, entity: entities.inventoryAlert });

    const fetchResult = await InventoryAlert.find(filterConditions)
      .populate('drug', 'name')
      .sort(sortConditions)
      .skip(viewSkip)
      .limit(viewLimit);

    const total = await InventoryAlert.countDocuments(filterConditions);
    
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

// Get active alerts for a specific drug
const getAlertsByDrug = async (drugId: IDType, query: QueryParams) => {
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
      entity: entities.inventoryAlert,
      additionalFilters: { 
        drug: drugId,
        isActive: true 
      }
    });

    const fetchResult = await InventoryAlert.find(filterConditions)
      .sort(sortConditions)
      .skip(viewSkip)
      .limit(viewLimit);

    const total = await InventoryAlert.countDocuments(filterConditions);
    
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

// Get all active alerts that need attention
const getActiveAlerts = async (query: QueryParams) => {
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
      entity: entities.inventoryAlert,
      additionalFilters: { isActive: true }
    });

    const fetchResult = await InventoryAlert.find(filterConditions)
      .populate('drug', 'name currentStock')
      .sort(sortConditions)
      .skip(viewSkip)
      .limit(viewLimit);

    const total = await InventoryAlert.countDocuments(filterConditions);
    
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
  createInventoryAlert,
  getSingleInventoryAlert,
  updateInventoryAlert,
  deleteInventoryAlert,
  getInventoryAlerts,
  getAlertsByDrug,
  getActiveAlerts,
};
