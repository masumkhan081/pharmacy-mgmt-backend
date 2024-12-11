import { entities } from "../config/constants.js";
import unitService from "../services/unit.service.js";
import { sendFetchResponse } from "../utils/responseHandler.js";
import { TypeController } from "../types/requestResponse.js";
//

export const getDrugs: TypeController = async (req, res) => {
  try {
    const result = await unitService.getUnits(req.query);
    sendFetchResponse({ res, result, entity: entities.unit });
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
    const result = await unitService.getSingleUnit(req.params.id);
    sendFetchResponse({ res, result, entity: entities.unit });
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
    const result = await unitService.createUnit(req.body);
    sendFetchResponse({ res, result, entity: entities.unit });
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
    const result = await unitService.updateUnit({
      id: req.params.id,
      data: req.body,
    });
    sendFetchResponse({ res, result, entity: entities.unit });
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
    const result = await unitService.deleteUnit(req.params.id);
    sendFetchResponse({ res, result, entity: entities.unit });
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
