import { entities } from "../config/constants";
import genericService from "../services/generic.service";
import { sendFetchResponse } from "../utils/responseHandler";
import { TypeController } from "../types/requestResponse";
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
