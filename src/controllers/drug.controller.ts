import { entities } from "../config/constants.js";
import drugService from "../services/drug.service.js";
import { sendFetchResponse } from "../utils/responseHandler.js";
import { TypeController } from "../types/requestResponse.js";
//

export const getDrugs: TypeController = async (req, res) => {
  try {
    const result = await drugService.getDrugs(req.query);
    sendFetchResponse({ res, result, entity: entities.drug });
  } catch (error) {
    console.error(error);
    // sendErrorResponse({
    //   res,
    //   error,
    //   what: entities.category,
    // });
  }
};

export const getSingleDrug: TypeController = async (req, res) => {
  try {
    const result = await drugService.getSingleDrug(req.params.id);
    sendFetchResponse({ res, result, entity: entities.drug });
  } catch (error) {
    console.error(error);
    // sendErrorResponse({
    //   res,
    //   error,
    //   what: entities.category,
    // });
  }
};

export const createDrug: TypeController = async (req, res) => {
  try {
    const result = await drugService.createDrug(req.body);
    sendFetchResponse({ res, result, entity: entities.drug });
  } catch (error) {
    console.error(error);
    // sendErrorResponse({
    //   res,
    //   error,
    //   what: entities.category,
    // });
  }
};

export const updateDrug: TypeController = async (req, res) => {
  try {
    const result = await drugService.updateDrug({
      id: req.params.id,
      data: req.body,
    });
    sendFetchResponse({ res, result, entity: entities.drug });
  } catch (error) {
    console.error(error);
    // sendErrorResponse({
    //   res,
    //   error,
    //   what: entities.category,
    // });
  }
};

export const deleteDrug: TypeController = async (req, res) => {
  try {
    const result = await drugService.deleteDrug(req.params.id);
    sendFetchResponse({ res, result, entity: entities.drug });
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
  getDrugs,
  createDrug,
  updateDrug,
  deleteDrug,
};
