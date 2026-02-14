import { entities } from "../config/constants";
import { returnService } from "../services";
import {
  sendFetchResponse,
  sendSingleFetchResponse,
  sendErrorResponse,
  sendCreateResponse,
  sendUpdateResponse,
  sendDeletionResponse,
} from "../utils/responseHandler";
import { TypeController } from "../types/requestResponse";

// Get all returns with pagination and filtering
export const getReturns: TypeController = async (req, res) => {
  try {
    const result = await returnService.getReturns(req.query);
    sendFetchResponse({ res, result, entity: entities.return });
  } catch (error) {
    console.error(error);
    sendErrorResponse({
      res,
      error,
      entity: entities.return,
    });
  }
};

// Get a single return by ID
export const getSingleReturn: TypeController = async (req, res) => {
  try {
    const result = await returnService.getSingleReturn(req.params.id);
    sendSingleFetchResponse({ res, result, entity: entities.return });
  } catch (error) {
    console.error(error);
    sendErrorResponse({
      res,
      error,
      entity: entities.return,
    });
  }
};

// Create a new return
export const createReturn: TypeController = async (req, res) => {
  try {
    const result = await returnService.createReturn(req.body);
    sendCreateResponse({ res, result, entity: entities.return });
  } catch (error) {
    console.error(error);
    sendErrorResponse({
      res,
      error,
      entity: entities.return,
    });
  }
};

// Update an existing return
export const updateReturn: TypeController = async (req, res) => {
  try {
    const result = await returnService.updateReturn({
      id: req.params.id,
      data: req.body,
    });
    sendUpdateResponse({ res, result, entity: entities.return });
  } catch (error) {
    console.error(error);
    sendErrorResponse({
      res,
      error,
      entity: entities.return,
    });
  }
};

// Delete a return
export const deleteReturn: TypeController = async (req, res) => {
  try {
    const result = await returnService.deleteReturn(req.params.id);
    sendDeletionResponse({ res, result, entity: entities.return });
  } catch (error) {
    console.error(error);
    sendErrorResponse({
      res,
      error,
      entity: entities.return,
    });
  }
};

export default {
  getReturns,
  getSingleReturn,
  createReturn,
  updateReturn,
  deleteReturn,
};
