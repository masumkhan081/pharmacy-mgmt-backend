import { entities } from "../config/constants.js";
import staffService from "../services/staff.service.js";
import { sendFetchResponse } from "../utils/responseHandler.js";
import { TypeController } from "../types/requestResponse.js";
//

export const getStaffs: TypeController = async (req, res) => {
  try {
    const result = await staffService.getStaffs(req.query);
    sendFetchResponse({ res, result, entity: entities.staff });
  } catch (error) {
    console.error(error);
    // sendErrorResponse({
    //   res,
    //   error,
    //   what: entities.category,
    // });
  }
};

export const getSingleStaff: TypeController = async (req, res) => {
  try {
    const result = await staffService.getSingleStaff(req.params.id);
    sendFetchResponse({ res, result, entity: entities.staff });
  } catch (error) {
    console.error(error);
    // sendErrorResponse({
    //   res,
    //   error,
    //   what: entities.category,
    // });
  }
};

export const createStaff: TypeController = async (req, res) => {
  try {
    const result = await staffService.createStaff(req.body);
    sendFetchResponse({ res, result, entity: entities.staff });
  } catch (error) {
    console.error(error);
    // sendErrorResponse({
    //   res,
    //   error,
    //   what: entities.category,
    // });
  }
};

export const updateStaff: TypeController = async (req, res) => {
  try {
    const result = await staffService.updateStaff({
      id: req.params.id,
      data: req.body,
    });
    sendFetchResponse({ res, result, entity: entities.staff });
  } catch (error) {
    console.error(error);
    // sendErrorResponse({
    //   res,
    //   error,
    //   what: entities.category,
    // });
  }
};

export const deleteStaff: TypeController = async (req, res) => {
  try {
    const result = await staffService.deleteStaff(req.params.id);
    sendFetchResponse({ res, result, entity: entities.staff });
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
  getStaffs,
  createStaff,
  updateStaff,
  deleteStaff,
};
