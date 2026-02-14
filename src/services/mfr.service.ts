import { IDType, QueryParams } from "../types/requestResponse";
import Manufacturer from "../models/mfr.model";
import getSearchAndPagination from "../utils/queryHandler";
import { entities } from "../config/constants";

// Create a new manufacturer
const createManufacturer = async (data: any) => {
  return await Manufacturer.create(data);
};

// Get a single manufacturer by ID
const getSingleManufacturer = async (id: IDType) => {
  return await Manufacturer.findById(id);
};

// Update a manufacturer
const updateManufacturer = async ({ id, data }: { id: IDType; data: any }) => {
  return await Manufacturer.findByIdAndUpdate(id, data, { new: true });
};

// Delete a manufacturer
const deleteManufacturer = async (id: IDType) => {
  return await Manufacturer.findByIdAndDelete(id);
};

// Get all manufacturers with pagination and filtering
const getManufacturers = async (query: QueryParams) => {
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
      entity: entities.manufacturer 
    });

    const fetchResult = await Manufacturer.find(filterConditions)
      .sort(sortConditions)
      .skip(viewSkip)
      .limit(viewLimit);

    const total = await Manufacturer.countDocuments(filterConditions);
    
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
  createManufacturer,
  getSingleManufacturer,
  updateManufacturer,
  deleteManufacturer,
  getManufacturers,
};
