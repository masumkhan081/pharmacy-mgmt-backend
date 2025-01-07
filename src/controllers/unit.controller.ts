import { entities } from "../config/constants";
import unitService from "../services/unit.service";
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

export const getUnits: TypeController = async (req, res) => {
  try {
    const result = await unitService.getUnits(req.query);
    sendFetchResponse({ res, result, entity: entities.unit });
  } catch (error) {
    console.error(error);
    sendErrorResponse({
      res,
      error,
      entity: entities.unit,
    });
  }
};

export const getSingleUnit: TypeController = async (req, res) => {
  try {
    const result = await unitService.getSingleUnit(req.params.id);
    sendSingleFetchResponse({ res, result, entity: entities.unit });
  } catch (error) {
    // console.error("Error fetching unit:", error);
    sendErrorResponse({ res, error, entity: entities.unit });
  }
};

export const createUnit: TypeController = async (req, res) => {
  try {
    const result = await unitService.createUnit(req.body);
    console.log(JSON.stringify(req.body) + "\n \n")

    console.log(JSON.stringify(result))
    sendCreateResponse({ res, result, entity: entities.unit });
  } catch (error) {
    console.error(error instanceof Error ? error.message : "Unknown error");
    sendErrorResponse({
      res,
      error,
      entity: entities.unit,
    });
  }
};

export const updateUnit: TypeController = async (req, res) => {
  try {
    const result = await unitService.updateUnit({
      id: req.params.id,
      data: req.body,
    });
    sendUpdateResponse({ res, result, entity: entities.unit });
  } catch (error) {
    console.error(error);
    sendErrorResponse({
      res,
      error,
      entity: entities.unit,
    });
  }
};

export const deleteUnit: TypeController = async (req, res) => {
  try {
    const result = await unitService.deleteUnit(req.params.id);
    sendDeletionResponse({ res, result, entity: entities.unit });
  } catch (error) {
    console.error(error);
    sendErrorResponse({
      res,
      error,
      entity: entities.unit,
    });
  }
};
