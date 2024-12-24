import { entities } from "../config/constants";
import genericService from "../services/generic.service";
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

export const getGenerics: TypeController = async (req, res) => {
  try {
    const result = await genericService.getGenerics(req.query);
    sendFetchResponse({ res, result, entity: entities.generic });
  } catch (error) {
    console.error(error);
    sendErrorResponse({
      res,
      error,
      entity: entities.unit,
    });
  }
};

export const getSingleGeneric: TypeController = async (req, res) => {
  try {
    const result = await genericService.getSingleGeneric(req.params.id);
    sendSingleFetchResponse({ res, result, entity: entities.generic });
  } catch (error) {
    console.error(error);
    sendErrorResponse({
      res,
      error,
      entity: entities.unit,
    });
  }
};

export const createGeneric: TypeController = async (req, res) => {
  try {
    const result = await genericService.createGeneric(req.body);
    sendCreateResponse({ res, result, entity: entities.generic });
  } catch (error) {
    console.error(error);
    sendErrorResponse({
      res,
      error,
      entity: entities.unit,
    });
  }
};

export const updateGeneric: TypeController = async (req, res) => {
  try {
    const result = await genericService.updateGeneric({
      id: req.params.id,
      data: req.body,
    });
    sendUpdateResponse({ res, result, entity: entities.generic });
  } catch (error) {
    console.error(error);
    sendErrorResponse({
      res,
      error,
      entity: entities.unit,
    });
  }
};

export const deleteGeneric: TypeController = async (req, res) => {
  try {
    const result = await genericService.deleteGeneric(req.params.id);
    sendDeletionResponse({ res, result, entity: entities.generic });
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
  getGenerics,
  getSingleGeneric,
  createGeneric,
  updateGeneric,
  deleteGeneric,
};
