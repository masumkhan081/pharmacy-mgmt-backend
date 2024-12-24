import { entities } from "../config/constants";
import mfrService from "../services/mfr.service";
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

export const getManufacturers: TypeController = async (req, res) => {
  try {
    const result = await mfrService.getManufacturers(req.query);
    sendFetchResponse({ res, result, entity: entities.manufacturer });
  } catch (error) {
    console.error(error);
    sendErrorResponse({
      res,
      error,
      entity: entities.unit,
    });
  }
};

export const getSingleManufacturer: TypeController = async (req, res) => {
  try {
    const result = await mfrService.getSingleManufacturer(req.params.id);
    sendSingleFetchResponse({ res, result, entity: entities.manufacturer });
  } catch (error) {
    console.error(error);
    sendErrorResponse({
      res,
      error,
      entity: entities.unit,
    });
  }
};

export const createManufacturer: TypeController = async (req, res) => {
  try {
    const result = await mfrService.createManufacturer(req.body);
    sendCreateResponse({ res, result, entity: entities.manufacturer });
  } catch (error) {
    console.error(error);
    sendErrorResponse({
      res,
      error,
      entity: entities.unit,
    });
  }
};

export const updateManufacturer: TypeController = async (req, res) => {
  try {
    const result = await mfrService.updateManufacturer({
      id: req.params.id,
      data: req.body,
    });
    sendUpdateResponse({ res, result, entity: entities.manufacturer });
  } catch (error) {
    console.error(error);
    sendErrorResponse({
      res,
      error,
      entity: entities.unit,
    });
  }
};

export const deleteManufacturer: TypeController = async (req, res) => {
  try {
    const result = await mfrService.deleteManufacturer(req.params.id);
    sendDeletionResponse({ res, result, entity: entities.manufacturer });
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
  getManufacturers,
  getSingleManufacturer,
  createManufacturer,
  updateManufacturer,
  deleteManufacturer,
};
