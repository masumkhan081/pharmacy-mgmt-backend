import { entities } from "../config/constants";
import formulationService from "../services/formulation.service";
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

export const getFormulations: TypeController = async (req, res) => {
  try {
    const result = await formulationService.getFormulations(req.query);
    sendFetchResponse({ res, result, entity: entities.formulation });
  } catch (error) {
    console.error(error);
    sendErrorResponse({
      res,
      error,
      entity: entities.formulation,
    });
  }
};

export const getSingleFormulation: TypeController = async (req, res) => {
  try {
    const result = await formulationService.getSingleFormulation(req.params.id);
    sendSingleFetchResponse({ res, result, entity: entities.formulation });
  } catch (error) {
    console.error(error);
    sendErrorResponse({
      res,
      error,
      entity: entities.formulation,
    });
  }
};

export const createFormulation: TypeController = async (req, res) => {
  try {
    const result = await formulationService.createFormulation(req.body);
    sendCreateResponse({ res, result, entity: entities.formulation });
  } catch (error) {
    console.error(error);
    sendErrorResponse({
      res,
      error,
      entity: entities.formulation,
    });
  }
};

export const updateFormulation: TypeController = async (req, res) => {
  try {
    const result = await formulationService.updateFormulation({
      id: req.params.id,
      data: req.body,
    });
    sendUpdateResponse({ res, result, entity: entities.formulation });
  } catch (error) {
    console.error(error);
    sendErrorResponse({
      res,
      error,
      entity: entities.formulation,
    });
  }
};
// 

export const deleteFormulation: TypeController = async (req, res) => {
  try {
    const result = await formulationService.deleteFormulation(req.params.id);
    sendDeletionResponse({ res, result, entity: entities.formulation });
  } catch (error) {
    console.error(error);
    sendErrorResponse({
      res,
      error,
      entity: entities.formulation,
    });
  }
};

export default {
  getFormulations,
  getSingleFormulation,
  createFormulation,
  updateFormulation,
  deleteFormulation,
};
