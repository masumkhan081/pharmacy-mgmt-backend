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
      entity: entities.drug,
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
      entity: entities.drug,
    });
  }
};

export const createDrug: TypeController = async (req, res) => {
  try {
    const result = await drugService.createDrug({ ...req.body, actor: req.user?.userId });
    sendCreateResponse({ res, result, entity: entities.drug });
  } catch (error) {
    console.error(error);
    sendErrorResponse({ res, error, entity: entities.drug });
  }
};

export const updateDrug: TypeController = async (req, res) => {
  try {
    const result = await drugService.updateDrug({
      id: req.params.id,
      data: req.body,
      actor: req.user?.userId,
    });
    sendUpdateResponse({ res, result, entity: entities.drug });
  } catch (error) {
    console.error(error);
    sendErrorResponse({ res, error, entity: entities.drug });
  }
};

export const deleteDrug: TypeController = async (req, res) => {
  try {
    const result = await drugService.deleteDrug({ id: req.params.id, actor: req.user?.userId });
    sendDeletionResponse({ res, result, entity: entities.drug });
  } catch (error) {
    console.error(error);
    sendErrorResponse({ res, error, entity: entities.drug });
  }
};

export default {
  getDrugs,
  getSingleDrug,
  createDrug,
  updateDrug,
  deleteDrug,
};
