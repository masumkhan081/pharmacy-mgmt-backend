import { entities } from "../config/constants.js";
import genericService from "../services/generic.service.js";
import { sendFetchResponse } from "../utils/responseHandler.js";
import { TypeController } from "../types/requestResponse.js";
//

export const getGenerics: TypeController = async (req, res) => {
  try {
    const result = await genericService.getGenerics(req.query);
    sendFetchResponse({ res, result, entity: entities.generic });
  } catch (error) {
    console.error(error);
    // sendErrorResponse({
    //   res,
    //   error,
    //   what: entities.category,
    // });
  }
};

export const getSingleGeneric: TypeController = async (req, res) => {
  try {
    const result = await genericService.getSingleGeneric(req.params.id);
    sendFetchResponse({ res, result, entity: entities.generic });
  } catch (error) {
    console.error(error);
    // sendErrorResponse({
    //   res,
    //   error,
    //   what: entities.category,
    // });
  }
};

export const createGeneric: TypeController = async (req, res) => {
  try {
    const result = await genericService.createGeneric(req.body);
    sendFetchResponse({ res, result, entity: entities.generic });
  } catch (error) {
    console.error(error);
    // sendErrorResponse({
    //   res,
    //   error,
    //   what: entities.category,
    // });
  }
};

export const updateGeneric: TypeController = async (req, res) => {
  try {
    const result = await genericService.updateGeneric({
      id: req.params.id,
      data: req.body,
    });
    sendFetchResponse({ res, result, entity: entities.generic });
  } catch (error) {
    console.error(error);
    // sendErrorResponse({
    //   res,
    //   error,
    //   what: entities.category,
    // });
  }
};

export const deleteGeneric: TypeController = async (req, res) => {
  try {
    const result = await genericService.deleteGeneric(req.params.id);
    sendFetchResponse({ res, result, entity: entities.generic });
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
  getGenerics,
  createGeneric,
  updateGeneric,
  deleteGeneric,
};
