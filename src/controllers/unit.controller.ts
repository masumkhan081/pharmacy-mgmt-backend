import { entities } from "../config/constants";
import unitService from "../services/unit.service";
import {
  sendFetchResponse,
  sendSingleFetchResponse,
  sendErrorResponse,
} from "../utils/responseHandler";
import { TypeController } from "../types/requestResponse";
//

export const getUnits: TypeController = async (req, res) => {
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

export const getSingleUnit: TypeController = async (req, res) => {
  try {
    const result = await unitService.getSingleUnit(req.params.id);
    console.log("result: " + JSON.stringify(result));
    sendSingleFetchResponse({ res, result, entity: entities.unit });
  } catch (error) {
    // console.error("Error fetching unit:", error);
    sendErrorResponse({ res, error, entity: entities.unit });
  }
};

export const createUnit: TypeController = async (req, res) => {
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

export const updateUnit: TypeController = async (req, res) => {
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

export const deleteUnit: TypeController = async (req, res) => {
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
