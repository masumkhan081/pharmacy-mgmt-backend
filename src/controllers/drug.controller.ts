import { entities } from "../config/constants";
import drugService from "../services/drug.service";
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

export const getDrugs: TypeController = async (req, res) => {
  try {
    const result = await drugService.getDrugs(req.query);
    sendFetchResponse({ res, result, entity: entities.drug });
  } catch (error) {
    console.error(error);
    sendErrorResponse({
      res,
      error,
      entity: entities.unit,
    });
  }
};

export const getSingleDrug: TypeController = async (req, res) => {
  try {
    const result = await drugService.getSingleDrug(req.params.id);
    sendSingleFetchResponse({ res, result, entity: entities.drug });
  } catch (error) {
    console.error(error);
    sendErrorResponse({
      res,
      error,
      entity: entities.unit,
    });
  }
};

export const createDrug: TypeController = async (req, res) => {
  try {
    const result = await drugService.createDrug(req.body);
    sendCreateResponse({ res, result, entity: entities.drug });
  } catch (error) {
    console.error(error);
    sendErrorResponse({
      res,
      error,
      entity: entities.unit,
    });
  }
};

export const updateDrug: TypeController = async (req, res) => {
  try {
    const result = await drugService.updateDrug({
      id: req.params.id,
      data: req.body,
    });
    sendUpdateResponse({ res, result, entity: entities.drug });
  } catch (error) {
    console.error(error);
    sendErrorResponse({
      res,
      error,
      entity: entities.unit,
    });
  }
};

export const deleteDrug: TypeController = async (req, res) => {
  try {
    const result = await drugService.deleteDrug(req.params.id);
    sendDeletionResponse({ res, result, entity: entities.drug });
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
  getDrugs,
  getSingleDrug,
  createDrug,
  updateDrug,
  deleteDrug,
};
