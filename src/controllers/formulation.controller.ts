import { entities } from "../config/constants";
import formulationService from "../services/formulation.service";
import { sendFetchResponse } from "../utils/responseHandler";
import { TypeController } from "../types/requestResponse";
//

export const getFormulations: TypeController = async (req, res) => {
  try {
    const result = await formulationService.getFormulations(req.query);
    sendFetchResponse({ res, result, entity: entities.formulation });
  } catch (error) {
    console.error(error);
    // sendErrorResponse({
    //   res,
    //   error,
    //   what: entities.category,
    // });
  }
};

export const getSingleFormulation: TypeController = async (req, res) => {
  try {
    const result = await formulationService.getSingleFormulation(req.params.id);
    sendFetchResponse({ res, result, entity: entities.formulation });
  } catch (error) {
    console.error(error);
    // sendErrorResponse({
    //   res,
    //   error,
    //   what: entities.category,
    // });
  }
};

export const createFormulation: TypeController = async (req, res) => {
  try {
    const result = await formulationService.createFormulation(req.body);
    sendFetchResponse({ res, result, entity: entities.formulation });
  } catch (error) {
    console.error(error);
    // sendErrorResponse({
    //   res,
    //   error,
    //   what: entities.category,
    // });
  }
};

export const updateFormulation: TypeController = async (req, res) => {
  try {
    const result = await formulationService.updateFormulation({
      id: req.params.id,
      data: req.body,
    });
    sendFetchResponse({ res, result, entity: entities.formulation });
  } catch (error) {
    console.error(error);
    // sendErrorResponse({
    //   res,
    //   error,
    //   what: entities.category,
    // });
  }
};

export const deleteFormulation: TypeController = async (req, res) => {
  try {
    const result = await formulationService.deleteFormulation(req.params.id);
    sendFetchResponse({ res, result, entity: entities.formulation });
  } catch (error) {
    console.error(error);
    // sendErrorResponse({
    //   res,
    //   error,
    //   what: entities.category,
    // });
  }
};

export default {
  getFormulations,
  createFormulation,
  updateFormulation,
  deleteFormulation,
};
