import { entities } from "../config/constants";
import saleService from "../services/sale.service";
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
export const getSales: TypeController = async (req, res) => {
  try {
    const result = await saleService.getSales(req.query);
    sendFetchResponse({ res, result, entity: entities.sale });
  } catch (error) {
    console.error(error);
    sendErrorResponse({
      res,
      error,
      entity: entities.sale,
    });
  }
};

export const getSingleSale: TypeController = async (req, res) => {
  try {
    const result = await saleService.getSingleSale(req.params.id);
    sendSingleFetchResponse({ res, result, entity: entities.sale });
  } catch (error) {
    console.error(error);
    sendErrorResponse({
      res,
      error,
      entity: entities.sale,
    });
  }
};
// 
export const createSale: TypeController = async (req, res) => {
  try {
    const result = await saleService.createSale({
      ...req.body,
      actor: req.user?.userId,
    });
    sendCreateResponse({ res, result, entity: entities.sale });
  } catch (error) {
    console.error(error);
    sendErrorResponse({
      res,
      error,
      entity: entities.sale,
    });
  }
};
// 
export const deleteSale: TypeController = async (req, res) => {
  try {
    const result = await saleService.deleteSale({
      id: req.params.id,
      actor: req.user?.userId,
    });
    sendDeletionResponse({ res, result, entity: entities.sale });
  } catch (error) {
    console.error(error);
    sendErrorResponse({
      res,
      error,
      entity: entities.sale,
    });
  }
};

export default {
  getSales,
  getSingleSale,
  createSale,
  deleteSale,
};
