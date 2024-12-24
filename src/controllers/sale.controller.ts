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
      entity: entities.unit,
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
      entity: entities.unit,
    });
  }
};
// 
export const createSale: TypeController = async (req, res) => {
  try {
    const result = await saleService.createSale(req.body);
    sendCreateResponse({ res, result, entity: entities.sale });
  } catch (error) {
    console.error(error);
    sendErrorResponse({
      res,
      error,
      entity: entities.unit,
    });
  }
};
// 
export const updateSale: TypeController = async (req, res) => {
  try {
    const result = await saleService.updateSale({
      id: req.params.id,
      data: req.body,
    });
    sendUpdateResponse({ res, result, entity: entities.sale });
  } catch (error) {
    console.error(error);
    sendErrorResponse({
      res,
      error,
      entity: entities.unit,
    });
  }
};
// 
export const deleteSale: TypeController = async (req, res) => {
  try {
    const result = await saleService.deleteSale(req.params.id);
    sendDeletionResponse({ res, result, entity: entities.sale });
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
  getSales,
  createSale,
  updateSale,
  deleteSale,
};
