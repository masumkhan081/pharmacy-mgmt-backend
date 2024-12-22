import { entities } from "../config/constants";
import mfrService from "../services/mfr.service";
import { sendFetchResponse } from "../utils/responseHandler";
import { TypeController } from "../types/requestResponse";
//

export const getManufacturers: TypeController = async (req, res) => {
  try {
    const result = await mfrService.getManufacturers(req.query);
    sendFetchResponse({ res, result, entity: entities.manufacturer });
  } catch (error) {
    console.error(error);
    // sendErrorResponse({
    //   res,
    //   error,
    //   what: entities.category,
    // });
  }
};

export const getSingleManufacturer: TypeController = async (req, res) => {
  try {
    const result = await mfrService.getSingleManufacturer(req.params.id);
    sendFetchResponse({ res, result, entity: entities.manufacturer });
  } catch (error) {
    console.error(error);
    // sendErrorResponse({
    //   res,
    //   error,
    //   what: entities.category,
    // });
  }
};

export const createManufacturer: TypeController = async (req, res) => {
  try {
    const result = await mfrService.createManufacturer(req.body);
    sendFetchResponse({ res, result, entity: entities.manufacturer });
  } catch (error) {
    console.error(error);
    // sendErrorResponse({
    //   res,
    //   error,
    //   what: entities.category,
    // });
  }
};

export const updateManufacturer: TypeController = async (req, res) => {
  try {
    const result = await mfrService.updateManufacturer({
      id: req.params.id,
      data: req.body,
    });
    sendFetchResponse({ res, result, entity: entities.manufacturer });
  } catch (error) {
    console.error(error);
    // sendErrorResponse({
    //   res,
    //   error,
    //   what: entities.category,
    // });
  }
};

export const deleteManufacturer: TypeController = async (req, res) => {
  try {
    const result = await mfrService.deleteManufacturer(req.params.id);
    sendFetchResponse({ res, result, entity: entities.manufacturer });
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
  getManufacturers,
  createManufacturer,
  updateManufacturer,
  deleteManufacturer,
};
