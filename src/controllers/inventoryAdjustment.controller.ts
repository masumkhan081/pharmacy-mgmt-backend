import { TypeController } from "../types/requestResponse";
import inventoryAdjustmentService from "../services/inventoryAdjustment.service";
import {
  sendCreateResponse,
  sendFetchResponse,
  sendSingleFetchResponse,
  sendErrorResponse,
} from "../utils/responseHandler";
import { entities } from "../config/constants";

export const createAdjustment: TypeController = async (req, res) => {
  try {
    const result = await inventoryAdjustmentService.createAdjustment({
      ...req.body,
      actor: req.user?.id,
    });
    sendCreateResponse({ res, result, entity: entities.inventoryAdjustment });
  } catch (error) {
    console.error(error);
    sendErrorResponse({ res, error, entity: entities.inventoryAdjustment });
  }
};

export const getAdjustments: TypeController = async (req, res) => {
  try {
    const result = await inventoryAdjustmentService.getAdjustments(req.query);
    sendFetchResponse({ res, result, entity: entities.inventoryAdjustment });
  } catch (error) {
    console.error(error);
    sendErrorResponse({ res, error, entity: entities.inventoryAdjustment });
  }
};

export const getSingleAdjustment: TypeController = async (req, res) => {
  try {
    const result = await inventoryAdjustmentService.getSingleAdjustment(req.params.id);
    sendSingleFetchResponse({ res, result, entity: entities.inventoryAdjustment });
  } catch (error) {
    console.error(error);
    sendErrorResponse({ res, error, entity: entities.inventoryAdjustment });
  }
};

export default {
  createAdjustment,
  getAdjustments,
  getSingleAdjustment,
};
