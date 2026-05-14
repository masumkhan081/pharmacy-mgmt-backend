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
      entity: entities.purchase,
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
      entity: entities.purchase,
    });
  }
};

export const createPurchase: TypeController = async (req, res) => {
  try {
    const result = await purchaseService.createPurchase({
      ...req.body,
      actor: req.user?.userId,
    });
    sendCreateResponse({ res, result, entity: entities.purchase });
  } catch (error) {
    console.error(error);
    sendErrorResponse({ res, error, entity: entities.purchase });
  }
};

export const deletePurchase: TypeController = async (req, res) => {
  try {
    const result = await purchaseService.deletePurchase({
      id: req.params.id,
      actor: req.user?.userId,
    });
    sendDeletionResponse({ res, result, entity: entities.purchase });
  } catch (error) {
    console.error(error);
    sendErrorResponse({ res, error, entity: entities.purchase });
  }
};

export default {
  getPurchases,
  getSinglePurchase,
  createPurchase,
  deletePurchase,
};
