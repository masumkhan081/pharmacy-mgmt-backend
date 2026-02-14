import { entities } from "../config/constants";
import { inventoryAlertService } from "../services";
import {
  sendFetchResponse,
  sendSingleFetchResponse,
  sendErrorResponse,
  sendCreateResponse,
  sendUpdateResponse,
  sendDeletionResponse,
} from "../utils/responseHandler";
import { TypeController } from "../types/requestResponse";

// Get all inventory alerts with pagination and filtering
export const getInventoryAlerts: TypeController = async (req, res) => {
  try {
    const result = await inventoryAlertService.getInventoryAlerts(req.query);
    sendFetchResponse({ res, result, entity: entities.inventoryAlert });
  } catch (error) {
    console.error(error);
    sendErrorResponse({
      res,
      error,
      entity: entities.inventoryAlert,
    });
  }
};

// Get a single inventory alert by ID
export const getSingleInventoryAlert: TypeController = async (req, res) => {
  try {
    const result = await inventoryAlertService.getSingleInventoryAlert(req.params.id);
    sendSingleFetchResponse({ res, result, entity: entities.inventoryAlert });
  } catch (error) {
    console.error(error);
    sendErrorResponse({
      res,
      error,
      entity: entities.inventoryAlert,
    });
  }
};

// Create a new inventory alert
export const createInventoryAlert: TypeController = async (req, res) => {
  try {
    const result = await inventoryAlertService.createInventoryAlert(req.body);
    sendCreateResponse({ res, result, entity: entities.inventoryAlert });
  } catch (error) {
    console.error(error);
    sendErrorResponse({
      res,
      error,
      entity: entities.inventoryAlert,
    });
  }
};

// Update an existing inventory alert
export const updateInventoryAlert: TypeController = async (req, res) => {
  try {
    const result = await inventoryAlertService.updateInventoryAlert({
      id: req.params.id,
      data: req.body,
    });
    sendUpdateResponse({ res, result, entity: entities.inventoryAlert });
  } catch (error) {
    console.error(error);
    sendErrorResponse({
      res,
      error,
      entity: entities.inventoryAlert,
    });
  }
};

// Delete an inventory alert
export const deleteInventoryAlert: TypeController = async (req, res) => {
  try {
    const result = await inventoryAlertService.deleteInventoryAlert(req.params.id);
    sendDeletionResponse({ res, result, entity: entities.inventoryAlert });
  } catch (error) {
    console.error(error);
    sendErrorResponse({
      res,
      error,
      entity: entities.inventoryAlert,
    });
  }
};

export default {
  getInventoryAlerts,
  getSingleInventoryAlert,
  createInventoryAlert,
  updateInventoryAlert,
  deleteInventoryAlert,
};
