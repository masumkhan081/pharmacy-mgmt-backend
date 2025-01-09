import { entities } from "../config/constants";
import staffService from "../services/staff.service";
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

export const createStaff: TypeController = async (req, res) => {
  try {
    const result = await staffService.createStaff(req.body);
    sendCreateResponse({ res, result, entity: entities.staff });
  } catch (error) {
    console.error(error);
    sendErrorResponse({
      res,
      error,
      entity: entities.unit,
    });
  }
};

export const getStaffs: TypeController = async (req, res) => {
  try {
    const result = await staffService.getStaffs(req.query);
    sendFetchResponse({ res, result, entity: entities.staff });
  } catch (error) {
    console.error(error);
    sendErrorResponse({
      res,
      error,
      entity: entities.unit,
    });
  }
};

export const getSingleStaff: TypeController = async (req, res) => {
  try {
    const result = await staffService.getSingleStaff(req.params.id);
    sendSingleFetchResponse({ res, result, entity: entities.staff });
  } catch (error) {
    console.error(error);
    sendErrorResponse({
      res,
      error,
      entity: entities.unit,
    });
  }
};

export const updateStaff: TypeController = async (req, res) => {
  try {
    const result = await staffService.updateStaff({
      id: req.params.id,
      data: req.body,
    });
    sendUpdateResponse({ res, result, entity: entities.staff });
  } catch (error) {
    console.error(error);
    sendErrorResponse({
      res,
      error,
      entity: entities.unit,
    });
  }
};

export const deleteStaff: TypeController = async (req, res) => {
  try {
    const result = await staffService.deleteStaff(req.params.id);
    sendDeletionResponse({ res, result, entity: entities.staff });
  } catch (error) {
    console.error(error);
    sendErrorResponse({
      res,
      error,
      entity: entities.unit,
    });
  }
};

export default {
  getStaffs,
  getSingleStaff,
  createStaff,
  updateStaff,
  deleteStaff,
};
