import { entities } from "../config/constants";
import purchaseService from "../services/purchase.service";
import {
  sendFetchResponse,
  sendSingleFetchResponse,
  sendErrorResponse,
  sendCreateResponse,
  sendUpdateResponse,
  sendDeletionResponse
} from "../utils/responseHandler";
import { TypeController } from "../types/requestResponse";
//

export const getPurchases: TypeController = async (req, res) => {
  try {
    const result = await purchaseService.getPurchases(req.query);
    sendFetchResponse({ res, result, entity: entities.purchase });
  } catch (error) {
    console.error(error);
    sendErrorResponse({
      res,
      error,
      entity: entities.unit,
    });
  }
};

export const getSinglePurchase: TypeController = async (req, res) => {
  try {
    const result = await purchaseService.getSinglePurchase(req.params.id);
    sendSingleFetchResponse({ res, result, entity: entities.purchase });
  } catch (error) {
    console.error(error);
    sendErrorResponse({
      res,
      error,
      entity: entities.unit,
    });
  }
};

export const createPurchase: TypeController = async (req, res) => {
  try {
    const result = await purchaseService.createPurchase(req.body);
    sendCreateResponse({ res, result, entity: entities.purchase });
  } catch (error) {
    console.error(error);
    sendErrorResponse({
      res,
      error,
      entity: entities.unit,
    });
  }
};

export const updatePurchase: TypeController = async (req, res) => {
  try {
    const result = await purchaseService.updatePurchase({
      id: req.params.id,
      data: req.body,
    });
    sendUpdateResponse({ res, result, entity: entities.purchase });
  } catch (error) {
    console.error(error);
    sendErrorResponse({
      res,
      error,
      entity: entities.unit,
    });
  }
};

export const deletePurchase: TypeController = async (req, res) => {
  try {
    const result = await purchaseService.deletePurchase(req.params.id);
    sendDeletionResponse({ res, result, entity: entities.purchase });
  } catch (error) {
    console.error(error);
    sendErrorResponse({
      res,
      error,
      entity: entities.unit,
    });
  }
};

export default {
  getPurchases,
  getSinglePurchase,
  createPurchase,
  updatePurchase,
  deletePurchase,
};
