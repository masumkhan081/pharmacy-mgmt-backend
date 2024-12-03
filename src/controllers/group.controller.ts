import { entities } from "../config/constants.js";
import groupService from "../services/group.service.js";
import { sendFetchResponse } from "../utils/responseHandler.js";
import { TypeController } from "../types/requestResponse.js";
//

export const getGroups: TypeController = async (req, res) => {
  try {
    const result = await groupService.getGroups(req.query);
    sendFetchResponse({ res, result, entity: entities.group });
  } catch (error) {
    console.error(error);
    // sendErrorResponse({
    //   res,
    //   error,
    //   what: entities.category,
    // });
  }
};

export const getSingleGroup: TypeController = async (req, res) => {
  try {
    const result = await groupService.getSingleGroup(req.params.id);
    sendFetchResponse({ res, result, entity: entities.group });
  } catch (error) {
    console.error(error);
    // sendErrorResponse({
    //   res,
    //   error,
    //   what: entities.category,
    // });
  }
};

export const createGroup: TypeController = async (req, res) => {
  try {
    const result = await groupService.createGroup(req.body);
    sendFetchResponse({ res, result, entity: entities.group });
  } catch (error) {
    console.error(error);
    // sendErrorResponse({
    //   res,
    //   error,
    //   what: entities.category,
    // });
  }
};

export const updateGroup: TypeController = async (req, res) => {
  try {
    const result = await groupService.updateGroup({
      id: req.params.id,
      data: req.body,
    });
    sendFetchResponse({ res, result, entity: entities.group });
  } catch (error) {
    console.error(error);
    // sendErrorResponse({
    //   res,
    //   error,
    //   what: entities.category,
    // });
  }
};

export const deleteGroup: TypeController = async (req, res) => {
  try {
    const result = await groupService.deleteGroup(req.params.id);
    sendFetchResponse({ res, result, entity: entities.group });
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
  getGroups,
  createGroup,
  updateGroup,
  deleteGroup,
};
