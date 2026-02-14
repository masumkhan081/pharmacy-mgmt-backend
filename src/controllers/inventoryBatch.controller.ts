import { entities } from "../config/constants";
import { inventoryBatchService } from "../services";
import {
  sendFetchResponse,
  sendSingleFetchResponse,
  sendErrorResponse,
  sendCreateResponse,
  sendUpdateResponse,
  sendDeletionResponse,
} from "../utils/responseHandler";
import { TypeController } from "../types/requestResponse";

// Get all inventory batches with pagination and filtering
export const getInventoryBatches: TypeController = async (req, res) => {
  try {
    const result = await inventoryBatchService.getInventoryBatches(req.query);
    sendFetchResponse({ res, result, entity: entities.inventoryBatch });
  } catch (error) {
    console.error(error);
    sendErrorResponse({
      res,
      error,
      entity: entities.inventoryBatch,
    });
  }
};

// Get a single inventory batch by ID
export const getSingleInventoryBatch: TypeController = async (req, res) => {
  try {
    const result = await inventoryBatchService.getSingleInventoryBatch(req.params.id);
    sendSingleFetchResponse({ res, result, entity: entities.inventoryBatch });
  } catch (error) {
    console.error(error);
    sendErrorResponse({
      res,
      error,
      entity: entities.inventoryBatch,
    });
  }
};

// Create a new inventory batch
export const createInventoryBatch: TypeController = async (req, res) => {
  try {
    const result = await inventoryBatchService.createInventoryBatch(req.body);
    sendCreateResponse({ res, result, entity: entities.inventoryBatch });
  } catch (error) {
    console.error(error);
    sendErrorResponse({
      res,
      error,
      entity: entities.inventoryBatch,
    });
  }
};

// Update an existing inventory batch
export const updateInventoryBatch: TypeController = async (req, res) => {
  try {
    const result = await inventoryBatchService.updateInventoryBatch({
      id: req.params.id,
      data: req.body,
    });
    sendUpdateResponse({ res, result, entity: entities.inventoryBatch });
  } catch (error) {
    console.error(error);
    sendErrorResponse({
      res,
      error,
      entity: entities.inventoryBatch,
    });
  }
};

// Delete an inventory batch
export const deleteInventoryBatch: TypeController = async (req, res) => {
  try {
    const result = await inventoryBatchService.deleteInventoryBatch(req.params.id);
    sendDeletionResponse({ res, result, entity: entities.inventoryBatch });
  } catch (error) {
    console.error(error);
    sendErrorResponse({
      res,
      error,
      entity: entities.inventoryBatch,
    });
  }
};

// Get batches by drug ID
export const getBatchesByDrug: TypeController = async (req, res) => {
  try {
    const result = await inventoryBatchService.getBatchesByDrug({
      drugId: req.params.drugId,
      query: req.query,
    });
    sendFetchResponse({ res, result, entity: entities.inventoryBatch });
  } catch (error) {
    console.error(error);
    sendErrorResponse({
      res,
      error,
      entity: entities.inventoryBatch,
    });
  }
};

export default {
  getInventoryBatches,
  getSingleInventoryBatch,
  createInventoryBatch,
  updateInventoryBatch,
  deleteInventoryBatch,
  getBatchesByDrug,
};
